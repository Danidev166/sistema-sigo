// Script temporal de migración para agregar columnas a la tabla agenda
const express = require("express");
const router = express.Router();
const { getPool } = require("../config/db");
const logger = require("../utils/logger");

// Endpoint temporal para migración
router.post("/agenda-columns", async (req, res) => {
  try {
    logger.info("🔧 Iniciando migración de columnas de agenda...");
    
    const pool = await getPool();
    
    // Verificar si las columnas ya existen
    const checkColumns = await pool.raw.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'agenda' 
      AND column_name IN ('asistencia', 'observaciones')
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    logger.info("📋 Columnas existentes:", existingColumns);
    
    // Agregar columna asistencia si no existe
    if (!existingColumns.includes('asistencia')) {
      await pool.raw.query(`
        ALTER TABLE agenda ADD COLUMN asistencia VARCHAR(50) DEFAULT 'Pendiente'
      `);
      logger.info("✅ Columna 'asistencia' agregada");
    } else {
      logger.info("ℹ️ Columna 'asistencia' ya existe");
    }
    
    // Agregar columna observaciones si no existe
    if (!existingColumns.includes('observaciones')) {
      await pool.raw.query(`
        ALTER TABLE agenda ADD COLUMN observaciones TEXT DEFAULT ''
      `);
      logger.info("✅ Columna 'observaciones' agregada");
    } else {
      logger.info("ℹ️ Columna 'observaciones' ya existe");
    }
    
    // Verificar la estructura final
    const finalCheck = await pool.raw.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'agenda' 
      AND column_name IN ('asistencia', 'observaciones')
      ORDER BY column_name
    `);
    
    logger.info("📋 Estructura final:", finalCheck.rows);
    
    res.json({ 
      message: "Migración completada exitosamente",
      columns_added: finalCheck.rows
    });
    
  } catch (error) {
    logger.error("❌ Error en migración:", error);
    res.status(500).json({ 
      error: "Error en migración",
      details: error.message 
    });
  }
});

module.exports = router;
