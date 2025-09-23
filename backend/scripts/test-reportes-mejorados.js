// Script para probar los nuevos endpoints de reportes mejorados
const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

// Función para hacer peticiones con autenticación
async function makeRequest(endpoint, token = null) {
  try {
    const config = {
      method: 'GET',
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`❌ Error en ${endpoint}:`, error.response?.data || error.message);
    return null;
  }
}

async function testReportesMejorados() {
  console.log('🧪 Probando endpoints de reportes mejorados...\n');
  
  // Nota: En un entorno real necesitarías un token de autenticación válido
  const token = null; // Reemplaza con un token válido si tienes autenticación habilitada
  
  const endpoints = [
    '/reportes-mejorado/dashboard',
    '/reportes-mejorado/estudiantes-por-curso',
    '/reportes-mejorado/institucional',
    '/reportes-mejorado/asistencia',
    '/reportes-mejorado/graficos/asistencia-mensual',
    '/reportes-mejorado/graficos/motivos-entrevistas'
  ];
  
  for (const endpoint of endpoints) {
    console.log(`📊 Probando: ${endpoint}`);
    const data = await makeRequest(endpoint, token);
    
    if (data) {
      console.log(`✅ Éxito: ${Array.isArray(data) ? data.length : 'Objeto'} registros`);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`   Primer registro:`, JSON.stringify(data[0], null, 2));
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        console.log(`   Datos:`, JSON.stringify(data, null, 2));
      }
    } else {
      console.log(`❌ Falló`);
    }
    console.log('');
  }
  
  console.log('🏁 Pruebas completadas');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testReportesMejorados().catch(console.error);
}

module.exports = { testReportesMejorados };
