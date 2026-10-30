// server/src/server.js
import 'dotenv/config';
import app from './app.js';
import { testConnection } from './config/database.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    console.log('[Sentinel AI] Database connection established with Supabase.');
  } else {
    console.log(`[Sentinel AI] Database connection info: ${dbStatus.reason}`);
    console.log('[Sentinel AI] Running in resilient demo/memory audit mode.');
  }

  const server = app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🛡️  SENTINEL AI GATEWAY IS ACTIVE`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`🔒 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🤖 Gemini Engine: ${process.env.GEMINI_API_KEY ? 'Connected' : 'Offline'}`);
    console.log(`💓 Health: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });

  return server;
}

startServer().catch(err => {
  console.error('[Sentinel AI] Critical startup failure:', err);
  process.exit(1);
});

