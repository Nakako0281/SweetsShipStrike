const { PeerServer } = require('peer');

const PORT = process.env.PORT || 9000;

const peerServer = PeerServer({
  port: PORT,
  path: '/peerjs',
  proxied: true,

  // セキュリティ設定
  allow_discovery: false,

  // CORS設定
  corsOptions: {
    origin: '*',
    credentials: true,
  },

  // 接続タイムアウト設定
  alive_timeout: 60000,

  // ログ設定
  debug: process.env.NODE_ENV !== 'production',
});

peerServer.on('connection', (client) => {
  console.log(`[INFO] Client connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`[INFO] Client disconnected: ${client.getId()}`);
});

peerServer.on('error', (error) => {
  console.error('[ERROR] PeerServer error:', error);
});

console.log(`[INFO] PeerJS server running on port ${PORT}`);
console.log(`[INFO] Path: /peerjs`);
console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
