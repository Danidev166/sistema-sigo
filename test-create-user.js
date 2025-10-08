// Script para crear usuario de prueba
const axios = require('axios');

const BASE_URL = 'https://sistema-sigo.onrender.com/api';

async function createTestUser() {
  console.log('👤 CREANDO USUARIO DE PRUEBA\n');
  console.log('=' .repeat(50));

  try {
    // 1. Intentar crear usuario de prueba
    console.log('1. 🔨 Creando usuario de prueba...');
    
    const userData = {
      nombre: 'Admin',
      apellido: 'Test',
      email: 'admin@sigo.com',
      password: 'admin123',
      rol: 'admin',
      estado: 'activo'
    };

    const response = await axios.post(`${BASE_URL}/usuarios`, userData);
    
    if (response.data) {
      console.log('✅ Usuario creado exitosamente');
      console.log(`   - ID: ${response.data.id || 'N/A'}`);
      console.log(`   - Email: ${response.data.email || 'N/A'}`);
      console.log(`   - Rol: ${response.data.rol || 'N/A'}`);
    }

  } catch (error) {
    if (error.response?.status === 409) {
      console.log('⚠️ Usuario ya existe (409 Conflict)');
      console.log('   - Esto significa que el usuario admin@sigo.com ya está registrado');
    } else {
      console.log(`❌ Error al crear usuario: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    }
  }

  // 2. Intentar login con el usuario
  console.log('\n2. 🔑 Intentando login...');
  
  try {
    const loginData = {
      email: 'admin@sigo.com',
      password: 'admin123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    if (loginResponse.data.token) {
      console.log('✅ Login exitoso');
      console.log(`   - Token: ${loginResponse.data.token.substring(0, 20)}...`);
      
      // 3. Probar dashboard con token
      console.log('\n3. 📊 Probando dashboard...');
      
      const headers = {
        'Authorization': `Bearer ${loginResponse.data.token}`,
        'Content-Type': 'application/json'
      };

      try {
        const estudiantesResponse = await axios.get(`${BASE_URL}/estudiantes`, { headers });
        console.log(`✅ Estudiantes: ${Array.isArray(estudiantesResponse.data) ? estudiantesResponse.data.length : 'OK'} registros`);
      } catch (error) {
        console.log(`❌ Error en estudiantes: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      }

    } else {
      console.log('❌ No se obtuvo token del login');
    }

  } catch (error) {
    console.log(`❌ Error en login: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('🏁 PRUEBA COMPLETADA');
}

createTestUser();
