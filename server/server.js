const http = require('http');
const store = require('./store');
const auth = require('./auth');

const PORT = process.env.PORT || 5000;

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

function getSessionToken(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  // Check cookie
  const cookies = parseCookies(req);
  return cookies.portfolio_session || null;
}

function requireAuth(req, res) {
  const token = getSessionToken(req);
  if (!token || !auth.validateSession(token)) {
    sendJson(res, 401, {
      success: false,
      error: 'Unauthorized: Admin session is invalid or has expired. Please re-authenticate.'
    });
    return false;
  }
  return true;
}

function sendJson(res, status, data, extraHeaders = {}) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...extraHeaders
  });
  res.end(payload);
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    const maxBodySize = 5 * 1024 * 1024; // 5MB

    req.on('data', chunk => {
      body += chunk;
      if (body.length > maxBodySize) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!body) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });

    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const ip = getClientIp(req);

  try {
    // ---------------- AUTH ROUTES ----------------
    if (pathname === '/api/auth/verify-pin' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const result = auth.verifyPin(body.pin, ip);

      if (!result.success) {
        return sendJson(res, result.status || 401, {
          success: false,
          error: result.error
        });
      }

      // Successful login
      const cookieHeader = `portfolio_session=${result.sessionToken}; HttpOnly; Path=/; Max-Age=7200; SameSite=Lax`;
      return sendJson(
        res,
        200,
        {
          success: true,
          message: 'PIN verified successfully.',
          sessionToken: result.sessionToken,
          expiresAt: result.expiresAt
        },
        { 'Set-Cookie': cookieHeader }
      );
    }

    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const token = getSessionToken(req);
      if (token) {
        auth.revokeSession(token);
      }
      const clearCookie = `portfolio_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
      return sendJson(
        res,
        200,
        { success: true, message: 'Logged out successfully' },
        { 'Set-Cookie': clearCookie }
      );
    }

    if (pathname === '/api/auth/check' && req.method === 'GET') {
      const token = getSessionToken(req);
      const isValid = Boolean(token && auth.validateSession(token));
      return sendJson(res, 200, { authenticated: isValid });
    }

    // ---------------- PUBLIC PORTFOLIO ROUTES ----------------
    if (pathname === '/api/portfolio' && req.method === 'GET') {
      const publicData = store.getPublicPortfolio();
      return sendJson(res, 200, { success: true, data: publicData });
    }

    // ---------------- PROTECTED ADMIN ROUTES ----------------
    if (pathname.startsWith('/api/admin/')) {
      if (!requireAuth(req, res)) return;

      if (pathname === '/api/admin/portfolio' && req.method === 'GET') {
        const fullData = store.getAdminPortfolio();
        return sendJson(res, 200, { success: true, data: fullData });
      }

      if (pathname === '/api/admin/about' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = store.updateAbout(body);
        return sendJson(res, 200, { success: true, message: 'About section updated', data: updated });
      }

      if (pathname === '/api/admin/skills' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = store.updateSkills(body);
        return sendJson(res, 200, { success: true, message: 'Skills updated', data: updated });
      }

      if (pathname === '/api/admin/projects' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = store.updateProjects(body);
        return sendJson(res, 200, { success: true, message: 'Projects updated', data: updated });
      }

      if (pathname === '/api/admin/experience' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = store.updateExperience(body);
        return sendJson(res, 200, { success: true, message: 'Experience updated', data: updated });
      }

      if (pathname === '/api/admin/portfolio' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const updated = store.updateAll(body);
        return sendJson(res, 200, { success: true, message: 'Portfolio updated', data: updated });
      }

      if (pathname === '/api/admin/change-pin' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        auth.changePin(body.newPin);
        return sendJson(res, 200, { success: true, message: 'Admin PIN updated successfully.' });
      }
    }

    // Health check
    if (pathname === '/api/health') {
      return sendJson(res, 200, { status: 'healthy', uptime: process.uptime() });
    }

    // 404 for unmatched API routes
    return sendJson(res, 404, { success: false, error: 'API endpoint not found' });
  } catch (error) {
    console.error('Server error:', error);
    return sendJson(res, 500, {
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Portfolio Admin Backend running on port ${PORT}`);
  });
}

module.exports = server;
