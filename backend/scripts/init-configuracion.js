// Script para inicializar configuraciones del sistema
const { getPool, query } = require('../config/db');

async function inicializarConfiguracion() {
  console.log('🔧 Inicializando configuraciones del sistema...\n');
  
  try {
    const pool = await getPool();
    
    // Configuraciones institucionales
    const configuracionesInstitucionales = [
      {
        tipo: 'institucional',
        clave: 'nombre_institucion',
        valor: 'SIGO - Sistema de Gestión de Orientación',
        descripcion: 'Nombre de la institución educativa'
      },
      {
        tipo: 'institucional',
        clave: 'direccion',
        valor: 'Dirección de la Institución',
        descripcion: 'Dirección física de la institución'
      },
      {
        tipo: 'institucional',
        clave: 'telefono',
        valor: '+56 9 1234 5678',
        descripcion: 'Teléfono de contacto'
      },
      {
        tipo: 'institucional',
        clave: 'email_contacto',
        valor: 'contacto@sigo.edu',
        descripcion: 'Email de contacto institucional'
      }
    ];

    // Configuraciones de personalización
    const configuracionesPersonalizacion = [
      {
        tipo: 'personalizacion',
        clave: 'tema_color',
        valor: 'azul',
        descripcion: 'Color principal del tema'
      },
      {
        tipo: 'personalizacion',
        clave: 'logo_url',
        valor: '/assets/logo.png',
        descripcion: 'URL del logo de la institución'
      },
      {
        tipo: 'personalizacion',
        clave: 'idioma_default',
        valor: 'es',
        descripcion: 'Idioma por defecto del sistema'
      }
    ];

    // Configuraciones de políticas
    const configuracionesPoliticas = [
      {
        tipo: 'politicas',
        clave: 'politica_privacidad',
        valor: 'Política de privacidad del sistema SIGO',
        descripcion: 'Texto de la política de privacidad'
      },
      {
        tipo: 'politicas',
        clave: 'terminos_uso',
        valor: 'Términos y condiciones de uso del sistema',
        descripcion: 'Términos y condiciones de uso'
      },
      {
        tipo: 'politicas',
        clave: 'retencion_datos',
        valor: '5',
        descripcion: 'Años de retención de datos de estudiantes'
      }
    ];

    // Configuraciones de email
    const configuracionesEmail = [
      {
        tipo: 'email',
        clave: 'smtp_host',
        valor: 'smtp.gmail.com',
        descripcion: 'Servidor SMTP para envío de emails'
      },
      {
        tipo: 'email',
        clave: 'smtp_port',
        valor: '587',
        descripcion: 'Puerto del servidor SMTP'
      },
      {
        tipo: 'email',
        clave: 'email_from',
        valor: 'noreply@sigo.edu',
        descripcion: 'Email remitente por defecto'
      },
      {
        tipo: 'email',
        clave: 'email_enabled',
        valor: 'true',
        descripcion: 'Habilitar envío de emails'
      }
    ];

    const todasLasConfiguraciones = [
      ...configuracionesInstitucionales,
      ...configuracionesPersonalizacion,
      ...configuracionesPoliticas,
      ...configuracionesEmail
    ];

    console.log('📝 Insertando configuraciones...');
    
    for (const config of todasLasConfiguraciones) {
      try {
        await pool.request()
          .input('tipo', 'VarChar', config.tipo)
          .input('clave', 'VarChar', config.clave)
          .input('valor', 'NVarChar', config.valor)
          .input('descripcion', 'NVarChar', config.descripcion)
          .query(`
            INSERT INTO configuracion (tipo, clave, valor, descripcion, usuario_modificacion, fecha_modificacion)
            VALUES (@tipo, @clave, @valor, @descripcion, 'sistema', NOW())
            ON CONFLICT (tipo, clave) DO UPDATE
              SET valor = EXCLUDED.valor,
                  descripcion = EXCLUDED.descripcion,
                  usuario_modificacion = EXCLUDED.usuario_modificacion,
                  fecha_modificacion = NOW()
          `);
        
        console.log(`✅ ${config.tipo}.${config.clave} = ${config.valor}`);
      } catch (error) {
        console.log(`❌ Error en ${config.tipo}.${config.clave}:`, error.message);
      }
    }

    // Verificar configuraciones insertadas
    console.log('\n📊 Verificando configuraciones insertadas...');
    const resultado = await pool.request().query(`
      SELECT tipo, COUNT(*) as total
      FROM configuracion
      GROUP BY tipo
      ORDER BY tipo
    `);
    
    console.log('📋 Resumen de configuraciones:');
    resultado.recordset.forEach(row => {
      console.log(`   - ${row.tipo}: ${row.total} configuraciones`);
    });

    console.log('\n🎉 Configuraciones inicializadas correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar configuraciones:', error.message);
    console.error('🔧 Stack trace:', error.stack);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  inicializarConfiguracion()
    .then(() => {
      console.log('\n✅ Script de inicialización completado');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = inicializarConfiguracion;
