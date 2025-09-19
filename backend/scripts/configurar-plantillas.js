const axios = require('axios');

// Configuración de la API
const API_BASE_URL = 'http://localhost:3001/api';
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
  try {
    console.log('🔍 Obteniendo plantillas existentes...');
    
    // Obtener todas las plantillas
    const response = await axios.get(`${API_BASE_URL}/plantillas-reportes`);
    const plantillas = response.data;
    
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
      
      const datosActualizacion = {
        nombre: plantilla.nombre,
        descripcion: config.descripcion,
        tipo_reporte: plantilla.tipo_reporte,
        columnas: config.columnas,
        activa: true
      };
      
      try {
        await axios.put(`${API_BASE_URL}/plantillas-reportes/${plantilla.id}`, datosActualizacion);
        console.log(`✅ "${nombrePlantilla}" configurada exitosamente`);
        console.log(`   Columnas: ${config.columnas.join(', ')}`);
      } catch (error) {
        console.error(`❌ Error al configurar "${nombrePlantilla}":`, error.response?.data || error.message);
      }
    }
    
    console.log('\n🎉 Configuración de plantillas completada');
    
    // Verificar configuración final
    console.log('\n🔍 Verificando configuración final...');
    const responseFinal = await axios.get(`${API_BASE_URL}/plantillas-reportes`);
    const plantillasFinales = responseFinal.data;
    
    plantillasFinales.forEach(plantilla => {
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
    console.error('❌ Error general:', error.response?.data || error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  configurarPlantillas();
}

module.exports = { configurarPlantillas, PLANTILLAS_CONFIG };
