const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');

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
    const pool = await getPool();
    const result = await pool.request().query('SELECT NOW() as current_time, COUNT(*) as total_estudiantes FROM estudiantes');
    
    res.json({
      status: 'OK',
      database: 'Connected',
      current_time: result.recordset[0].current_time,
      total_estudiantes: result.recordset[0].total_estudiantes
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
