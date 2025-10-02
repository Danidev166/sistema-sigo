const express = require('express');
const app = express();

// Endpoint simple de debug
app.get('/debug', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    render: process.env.RENDER,
    databaseUrl: process.env.DATABASE_URL ? 'Configurado' : 'NO CONFIGURADO',
    pgSsl: process.env.PG_SSL,
    mailUser: process.env.MAIL_USER ? 'Configurado' : 'NO CONFIGURADO',
    jwtSecret: process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO',
    port: process.env.PORT || 3001
  });
});

// Endpoint de prueba de base de datos
app.get('/test-db', async (req, res) => {
  try {
    const { Pool } = require('pg');
    
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL no configurado' });
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    client.release();
    await pool.end();

    res.json({
      status: 'OK',
      database: 'Conectado',
      time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error de base de datos',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Debug server running on port ${PORT}`);
});
