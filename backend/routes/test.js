const express = require('express');
const router = express.Router();

// Endpoint de prueba simple
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor funcionando correctamente'
  });
});

// Endpoint de prueba de base de datos
router.get('/db-test', async (req, res) => {
  try {
    const { Pool } = require('pg');
    
    const renderConfig = {
      user: 'sigo_user',
      host: 'dpg-d391d4nfte5s73cff6p0-a.oregon-postgres.render.com',
      database: 'sigo_pro',
      password: 'qgEyTD5LiGu22qdSOoROC1UFqjGZaxIv',
      port: 5432,
      ssl: { rejectUnauthorized: false },
    };
    
    const pool = new Pool(renderConfig);
    const result = await pool.query('SELECT NOW() as current_time, COUNT(*) as total_estudiantes FROM estudiantes');
    await pool.end();
    
    res.json({
      status: 'OK',
      database: 'Connected',
      current_time: result.rows[0].current_time,
      total_estudiantes: result.rows[0].total_estudiantes
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
});

module.exports = router;

