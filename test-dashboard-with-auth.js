// Script para probar dashboard con autenticación real
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function testDashboardWithAuth() {
  console.log('🔐 PROBANDO DASHBOARD CON AUTENTICACIÓN\n');
  console.log('=' .repeat(50));

  try {
    // 1. Intentar login para obtener token
    console.log('1. 🔑 Intentando login...');
    
    // Usar credenciales reales
    const loginData = {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (loginResponse.data.token) {
      console.log('✅ Login exitoso, token obtenido');
      const token = loginResponse.data.token;
      
      // 2. Probar endpoints del dashboard con token
      console.log('\n2. 📊 Probando endpoints del dashboard...');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Probar cada endpoint del dashboard
      const endpoints = [
        '/estudiantes',
        '/entrevistas/por-mes',
        '/evaluaciones/por-especialidad',
        '/alertas'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await axios.get(`${BASE_URL}${endpoint}`, { headers });
          console.log(`✅ ${endpoint}: ${Array.isArray(response.data) ? response.data.length : 'OK'} registros`);
          
          // Mostrar estructura de datos
          if (Array.isArray(response.data) && response.data.length > 0) {
            console.log(`   - Estructura: ${Object.keys(response.data[0]).join(', ')}`);
          }
        } catch (error) {
          console.log(`❌ ${endpoint}: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        }
      }

      // 3. Simular llamada completa del dashboard
      console.log('\n3. 🎯 Simulando llamada completa del dashboard...');
      
      try {
        const dashboardData = await axios.get(`${BASE_URL}/estudiantes`, { headers });
        const estudiantes = dashboardData.data;
        
        console.log(`📈 Datos del dashboard:`);
        console.log(`   - Total estudiantes: ${Array.isArray(estudiantes) ? estudiantes.length : 'N/A'}`);
        
        if (Array.isArray(estudiantes) && estudiantes.length > 0) {
          console.log(`   - Primer estudiante: ${estudiantes[0].nombre || 'Sin nombre'}`);
        }
        
      } catch (error) {
        console.log(`❌ Error en dashboard: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }

    } else {
      console.log('❌ No se obtuvo token del login');
    }

  } catch (error) {
    console.log(`❌ Error en login: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    console.log('\n💡 POSIBLES CAUSAS:');
    console.log('1. Credenciales incorrectas');
    console.log('2. Usuario no existe');
    console.log('3. Problema de conectividad');
    console.log('4. El endpoint de login no funciona');
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
}

testDashboardWithAuth();
