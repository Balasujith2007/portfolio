const { spawn } = require('child_process');
const path = require('path');
const server = require('../server/server');

const PORT = process.env.PORT || 5000;

// Start backend API server
server.listen(PORT, () => {
  console.log(`[API Server] Portfolio backend active on http://localhost:${PORT}`);
});

// Start React frontend via craco
const isWin = process.platform === 'win32';
const cracoCmd = isWin ? 'npx.cmd' : 'npx';

const clientProcess = spawn(cracoCmd, ['craco', 'start'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    PORT: process.env.CLIENT_PORT || 3000
  }
});

clientProcess.on('error', (err) => {
  console.error('[Frontend] Failed to start frontend:', err);
});

clientProcess.on('exit', (code) => {
  console.log(`[Frontend] Exited with code ${code}`);
  process.exit(code || 0);
});

// Graceful shutdown
function shutdown() {
  console.log('\nShutting down dev servers...');
  server.close(() => {
    console.log('[API Server] Closed.');
  });
  if (clientProcess) {
    clientProcess.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
