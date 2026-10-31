const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const AUTH_FILE = path.join(__dirname, 'data', 'auth.json');
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// In-memory sessions map: token -> { createdAt, expiresAt }
const activeSessions = new Map();

// Rate limiting map: ip -> { failedAttempts: number, lockedUntil: number, windowStart: number }
const rateLimitMap = new Map();

function hashPin(pin, salt) {
  return crypto.pbkdf2Sync(String(pin), salt, 100000, 64, 'sha512').toString('hex');
}

function initAuth() {
  const envPin = process.env.PORTFOLIO_ADMIN_PIN || '2007';
  if (!fs.existsSync(AUTH_FILE)) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPin(envPin, salt);
    fs.writeFileSync(
      AUTH_FILE,
      JSON.stringify({ salt, hash, updatedAt: new Date().toISOString() }, null, 2),
      'utf8'
    );
    return { salt, hash };
  }

  try {
    const raw = fs.readFileSync(AUTH_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPin(envPin, salt);
    fs.writeFileSync(
      AUTH_FILE,
      JSON.stringify({ salt, hash, updatedAt: new Date().toISOString() }, null, 2),
      'utf8'
    );
    return { salt, hash };
  }
}

let authData = initAuth();

// Rate limit helper
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    return { allowed: true };
  }

  if (entry.lockedUntil && now < entry.lockedUntil) {
    const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
    return {
      allowed: false,
      reason: `Account locked due to repeated failed attempts. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
      retryAfterMinutes: minutesLeft
    };
  }

  // If lockout expired or window expired (15m)
  if (now - entry.windowStart > LOCKOUT_DURATION_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > LOCKOUT_DURATION_MS) {
    entry = { failedAttempts: 1, lockedUntil: 0, windowStart: now };
  } else {
    entry.failedAttempts += 1;
    if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }

  rateLimitMap.set(ip, entry);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts);
  return {
    locked: Boolean(entry.lockedUntil && now < entry.lockedUntil),
    remainingAttempts: remaining
  };
}

function resetRateLimit(ip) {
  rateLimitMap.delete(ip);
}

// PIN Verification
function verifyPin(inputPin, ip) {
  const rateStatus = checkRateLimit(ip);
  if (!rateStatus.allowed) {
    return { success: false, status: 429, error: rateStatus.reason };
  }

  if (!inputPin || typeof inputPin !== 'string' || !/^\d{4}$/.test(inputPin.trim())) {
    return {
      success: false,
      status: 400,
      error: 'Invalid input. Please enter a 4-digit numeric PIN.'
    };
  }

  // Verify against current hash
  const inputHash = hashPin(inputPin.trim(), authData.salt);
  const inputBuf = Buffer.from(inputHash, 'hex');
  const targetBuf = Buffer.from(authData.hash, 'hex');

  const matches = inputBuf.length === targetBuf.length && crypto.timingSafeEqual(inputBuf, targetBuf);

  if (!matches) {
    const failInfo = recordFailedAttempt(ip);
    if (failInfo.locked) {
      return {
        success: false,
        status: 429,
        error: 'Too many incorrect attempts. Admin access locked for 15 minutes.'
      };
    }
    return {
      success: false,
      status: 401,
      error: `Invalid PIN. ${failInfo.remainingAttempts} attempt${failInfo.remainingAttempts === 1 ? '' : 's'} remaining before temporary lockout.`
    };
  }

  // Successful verification
  resetRateLimit(ip);
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;

  activeSessions.set(sessionToken, {
    createdAt: Date.now(),
    expiresAt,
    ip
  });

  return {
    success: true,
    sessionToken,
    expiresAt
  };
}

// Session validation
function validateSession(token) {
  if (!token || typeof token !== 'string') return false;
  const session = activeSessions.get(token);
  if (!session) return false;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return false;
  }

  // Sliding window extension on valid active call
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

function revokeSession(token) {
  if (token) {
    activeSessions.delete(token);
  }
}

// Change PIN while authenticated
function changePin(newPin) {
  if (!newPin || typeof newPin !== 'string' || !/^\d{4}$/.test(newPin.trim())) {
    throw new Error('New PIN must be exactly 4 numeric digits');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPin(newPin.trim(), salt);

  const updatedAuth = {
    salt,
    hash,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(updatedAuth, null, 2), 'utf8');
  authData = updatedAuth;
  return true;
}

module.exports = {
  verifyPin,
  validateSession,
  revokeSession,
  changePin
};
