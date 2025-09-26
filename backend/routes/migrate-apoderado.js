const express = require('express');
const router = express.Router();
const { getPool } = require('../config/db');
const logger = require('../utils/logger');

router.post('/', async (req, res) => {
  try {
    const pool = await getPool();
    const columnsAdded = [];

    // Verificar y agregar columna nombre_apoderado
    const checkNombreApoderado = await pool.raw.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'estudiantes' AND column_name = 'nombre_apoderado'
    `);
    if (checkNombreApoderado.rows.length === 0) {
      await pool.raw.query(`ALTER TABLE estudiantes ADD COLUMN nombre_apoderado VARCHAR(255) DEFAULT ''`);
      columnsAdded.push({ column_name: 'nombre_apoderado', data_type: 'VARCHAR(255)', column_default: "''" });
      logger.info('✅ Columna nombre_apoderado agregada a la tabla estudiantes.');
    } else {
      logger.info('ℹ️ Columna nombre_apoderado ya existe en la tabla estudiantes.');
    }

    // Verificar y agregar columna telefono_apoderado
    const checkTelefonoApoderado = await pool.raw.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'estudiantes' AND column_name = 'telefono_apoderado'
    `);
    if (checkTelefonoApoderado.rows.length === 0) {
      await pool.raw.query(`ALTER TABLE estudiantes ADD COLUMN telefono_apoderado VARCHAR(50) DEFAULT ''`);
      columnsAdded.push({ column_name: 'telefono_apoderado', data_type: 'VARCHAR(50)', column_default: "''" });
      logger.info('✅ Columna telefono_apoderado agregada a la tabla estudiantes.');
    } else {
      logger.info('ℹ️ Columna telefono_apoderado ya existe en la tabla estudiantes.');
    }

    // Verificar y agregar columna email_apoderado
    const checkEmailApoderado = await pool.raw.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'estudiantes' AND column_name = 'email_apoderado'
    `);
    if (checkEmailApoderado.rows.length === 0) {
      await pool.raw.query(`ALTER TABLE estudiantes ADD COLUMN email_apoderado VARCHAR(255) DEFAULT ''`);
      columnsAdded.push({ column_name: 'email_apoderado', data_type: 'VARCHAR(255)', column_default: "''" });
      logger.info('✅ Columna email_apoderado agregada a la tabla estudiantes.');
    } else {
      logger.info('ℹ️ Columna email_apoderado ya existe en la tabla estudiantes.');
    }

    res.status(200).json({
      message: 'Migración de columnas de apoderado completada exitosamente',
      columns_added: columnsAdded
    });
  } catch (error) {
    logger.error('❌ Error durante la migración de apoderado:', error);
    res.status(500).json({ 
      error: 'Error durante la migración de apoderado', 
      details: error.message, 
      stack: error.stack 
    });
  }
});

module.exports = router;
