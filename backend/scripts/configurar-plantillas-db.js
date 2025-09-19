const sql = require('mssql');
const path = require('path');

// Configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'Sigo2024!',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'SIGO_DB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

const PLANTILLAS_CONFIG = {
  'Reporte Mensual General': {
    descripcion: 'Reporte general mensual con datos básicos de estudiantes para análisis institucional',
    columnas: [
      'nombre', 'rut', 'curso', 'email', 'estado',
      'especialidad', 'situacion_economica', 'fecha_nacimiento', 'fecha_ingreso'
    ]
  },
  'Reporte Individual Estudiante': {
    descripcion: 'Reporte detallado de un estudiante específico con expediente completo',
    columnas: [
      'nombre', 'rut', 'email', 'telefono', 'direccion',
      'curso', 'especialidad', 'situacion_economica',
      'nombre_apoderado', 'telefono_apoderado', 'email_apoderado',
      'fecha_nacimiento', 'fecha_ingreso', 'estado'
    ]
  },
  'Reporte de Asistencia': {
    descripcion: 'Reporte de asistencia de estudiantes por período con indicadores de rendimiento',
    columnas: [
      'nombre', 'rut', 'curso', 'estado',
      'asistencia_porcentaje', 'conducta_promedio',
      'especialidad', 'situacion_economica'
    ]
  }
};

async function configurarPlantillas() {
  let pool;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    pool = await sql.connect(dbConfig);
    console.log('✅ Conectado a la base de datos');
    
    // Obtener plantillas existentes
    console.log('🔍 Obteniendo plantillas existentes...');
    const result = await pool.request().query(`
      SELECT id, nombre, tipo_reporte, configuracion 
      FROM Plantillas_Reportes 
      WHERE nombre IN ('Reporte Mensual General', 'Reporte Individual Estudiante', 'Reporte de Asistencia')
    `);
    
    const plantillas = result.recordset;
    console.log(`📋 Encontradas ${plantillas.length} plantillas:`);
    plantillas.forEach(p => {
      console.log(`  - ${p.nombre} (ID: ${p.id}) - Tipo: ${p.tipo_reporte}`);
    });
    
    // Configurar cada plantilla
    for (const [nombrePlantilla, config] of Object.entries(PLANTILLAS_CONFIG)) {
      const plantilla = plantillas.find(p => p.nombre === nombrePlantilla);
      
      if (!plantilla) {
        console.log(`⚠️  Plantilla "${nombrePlantilla}" no encontrada`);
        continue;
      }
      
      console.log(`\n🔧 Configurando "${nombrePlantilla}" (ID: ${plantilla.id})...`);
      
      // Crear configuración JSON
      const configuracion = JSON.stringify({
        columnas: config.columnas,
        orden: config.columnas,
        filtros: [],
        agrupaciones: []
      });
      
      // Actualizar plantilla
      await pool.request()
        .input('id', sql.Int, plantilla.id)
        .input('descripcion', sql.Text, config.descripcion)
        .input('configuracion', sql.NVarChar(sql.MAX), configuracion)
        .query(`
          UPDATE Plantillas_Reportes 
          SET descripcion = @descripcion, 
              configuracion = @configuracion, 
              fecha_modificacion = GETDATE() 
          WHERE id = @id
        `);
      
      console.log(`✅ "${nombrePlantilla}" configurada exitosamente`);
      console.log(`   Columnas: ${config.columnas.join(', ')}`);
    }
    
    console.log('\n🎉 Configuración de plantillas completada');
    
    // Verificar configuración final
    console.log('\n🔍 Verificando configuración final...');
    const resultFinal = await pool.request().query(`
      SELECT nombre, configuracion 
      FROM Plantillas_Reportes 
      WHERE nombre IN ('Reporte Mensual General', 'Reporte Individual Estudiante', 'Reporte de Asistencia')
    `);
    
    resultFinal.recordset.forEach(plantilla => {
      try {
        const config = JSON.parse(plantilla.configuracion || '{}');
        const columnas = config.columnas || [];
        console.log(`📄 ${plantilla.nombre}: ${columnas.length} columnas configuradas`);
        if (columnas.length > 0) {
          console.log(`   Columnas: ${columnas.join(', ')}`);
        }
      } catch (e) {
        console.log(`📄 ${plantilla.nombre}: Sin configuración`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  configurarPlantillas();
}

module.exports = { configurarPlantillas, PLANTILLAS_CONFIG };
