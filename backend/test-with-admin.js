// Script para probar con usuario admin
const https = require('https');

async function testWithAdmin() {
  try {
    console.log('🔍 Probando con usuario admin...\n');
    
    // 1. Hacer login con admin
    console.log('1️⃣ Haciendo login con admin...');
    const loginData = await makeRequest('POST', '/api/auth/login', {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    if (!loginData.token) {
      console.error('❌ Error en login:', loginData);
      return;
    }
    
    console.log('✅ Login exitoso');
    const token = loginData.token;
    
    // 2. Probar seguimiento académico con estudiante 17
    console.log('\n2️⃣ Probando seguimiento académico con estudiante 17...');
    const seguimiento = await makeRequest('GET', '/api/seguimiento-academico/estudiante/17?anio=2025', null, token);
    console.log('📊 Seguimiento académico:', JSON.stringify(seguimiento, null, 2));
    
    // 3. Probar estadísticas de seguimiento
    console.log('\n3️⃣ Probando estadísticas de seguimiento...');
    const statsSeguimiento = await makeRequest('GET', '/api/seguimiento-academico/estadisticas/17?anio=2025', null, token);
    console.log('📈 Estadísticas seguimiento:', JSON.stringify(statsSeguimiento, null, 2));
    
    // 4. Probar estadísticas de asistencia
    console.log('\n4️⃣ Probando estadísticas de asistencia...');
    const statsAsistencia = await makeRequest('GET', '/api/asistencia/estadisticas/17?anio=2025', null, token);
    console.log('📊 Estadísticas asistencia:', JSON.stringify(statsAsistencia, null, 2));
    
    // 5. Probar asistencia del estudiante
    console.log('\n5️⃣ Probando asistencia del estudiante...');
    const asistencia = await makeRequest('GET', '/api/asistencia/estudiante/17?anio=2025', null, token);
    console.log('📅 Asistencia:', JSON.stringify(asistencia, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sistema-sigo.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (e) {
          resolve(responseData);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

testWithAdmin();
