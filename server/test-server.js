const http = require('http');
const assert = require('assert');
const server = require('./server');

const TEST_PORT = 5099;

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...options, port: TEST_PORT, host: '127.0.0.1' }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body || '{}') });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  server.listen(TEST_PORT, async () => {
    console.log(`Test server running on ${TEST_PORT}`);
    try {
      // 1. Public endpoint test
      console.log('Testing GET /api/portfolio (public)...');
      const publicRes = await request({ path: '/api/portfolio', method: 'GET' });
      assert.strictEqual(publicRes.status, 200);
      assert.ok(publicRes.body.data.about.name === 'Balasujith S');
      assert.ok(Array.isArray(publicRes.body.data.projects));
      console.log('✓ Public endpoint returns data');

      // 2. Unauthenticated protected endpoint test
      console.log('Testing GET /api/admin/portfolio (without auth)...');
      const unauthRes = await request({ path: '/api/admin/portfolio', method: 'GET' });
      assert.strictEqual(unauthRes.status, 401);
      console.log('✓ Unauthorized access correctly rejected');

      // 3. Invalid PIN format
      console.log('Testing POST /api/auth/verify-pin with invalid format...');
      const badFormatRes = await request({
        path: '/api/auth/verify-pin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { pin: 'abc' });
      assert.strictEqual(badFormatRes.status, 400);
      console.log('✓ Bad PIN format rejected with 400');

      // 4. Incorrect PIN
      console.log('Testing POST /api/auth/verify-pin with wrong PIN...');
      const wrongPinRes = await request({
        path: '/api/auth/verify-pin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { pin: '9999' });
      assert.strictEqual(wrongPinRes.status, 401);
      assert.ok(wrongPinRes.body.error.includes('Invalid PIN'));
      console.log('✓ Wrong PIN rejected with 401');

      // 5. Correct PIN
      console.log('Testing POST /api/auth/verify-pin with correct PIN (2007)...');
      const loginRes = await request({
        path: '/api/auth/verify-pin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, { pin: '2007' });
      assert.strictEqual(loginRes.status, 200);
      assert.ok(loginRes.body.sessionToken);
      const token = loginRes.body.sessionToken;
      console.log('✓ Correct PIN verified, received sessionToken');

      // 6. Access admin endpoint with session token
      console.log('Testing GET /api/admin/portfolio with Authorization header...');
      const adminRes = await request({
        path: '/api/admin/portfolio',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(adminRes.status, 200);
      assert.ok(adminRes.body.data.projects);
      console.log('✓ Admin endpoint accessible with valid session');

      // 7. Update About info
      console.log('Testing PUT /api/admin/about with token...');
      const updateAboutRes = await request({
        path: '/api/admin/about',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }, { headline: 'AI & Full Stack Engineer' });
      assert.strictEqual(updateAboutRes.status, 200);
      console.log('✓ About section updated successfully');

      // 8. Logout
      console.log('Testing POST /api/auth/logout...');
      const logoutRes = await request({
        path: '/api/auth/logout',
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(logoutRes.status, 200);

      // Verify token is now invalid
      const afterLogoutRes = await request({
        path: '/api/admin/portfolio',
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.strictEqual(afterLogoutRes.status, 401);
      console.log('✓ Logout successfully invalidated session');

      console.log('\nALL BACKEND API TESTS PASSED SUCCESSFULLY! 🎉\n');
      process.exit(0);
    } catch (err) {
      console.error('Test failed:', err);
      process.exit(1);
    }
  });
}

runTests();
