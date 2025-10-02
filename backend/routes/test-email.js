const express = require('express');
const router = express.Router();
const { enviarCitacionReunion } = require('../utils/emailService');

// Endpoint para probar configuración de email
router.get('/', async (req, res) => {
  try {
    console.log('🔧 Verificando configuración de email en Render...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_PASS:', process.env.MAIL_PASS ? 'Configurado' : 'No configurado');
    console.log('MAIL_HOST:', process.env.MAIL_HOST);
    console.log('MAIL_PORT:', process.env.MAIL_PORT);
    console.log('MAIL_SECURE:', process.env.MAIL_SECURE);

    // Verificar si las variables están configuradas
    const emailConfig = {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS ? 'Configurado' : 'No configurado',
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === 'true'
    };

    const requiredVars = ['MAIL_USER', 'MAIL_PASS', 'MAIL_HOST', 'MAIL_PORT'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      return res.status(500).json({
        error: 'Variables de email faltantes',
        missing: missingVars,
        config: emailConfig
      });
    }

    // Probar envío de email
    await enviarCitacionReunion({
      to: 'pamefern5@gmail.com',
      apoderado: 'Test Render',
      estudiante: 'Estudiante Test',
      fecha: new Date().toISOString().split('T')[0],
      hora: '15:30',
      lugar: 'Liceo Técnico SIGO',
      motivo: 'Test de configuración desde Render',
      profesional: 'Sistema'
    });

    res.json({
      success: true,
      message: 'Email enviado exitosamente desde Render',
      config: emailConfig,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en test de email:', error);
    res.status(500).json({
      error: 'Error enviando email',
      message: error.message,
      config: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS ? 'Configurado' : 'No configurado',
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE === 'true'
      }
    });
  }
});

module.exports = router;
