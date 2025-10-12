// Script para probar datos de estudiantes en Render
const https = require('https');

async function testStudentData() {
  try {
    console.log('🔍 Probando datos de estudiantes en Render...\n');
    
    // 1. Obtener estudiantes públicos
    console.log('1️⃣ Obteniendo estudiantes públicos...');
    const estudiantes = await makeRequest('GET', '/api/estudiantes/public');
    console.log('👥 Estudiantes encontrados:', estudiantes.length);
    estudiantes.forEach(est => {
      console.log(`  - ID: ${est.id}, Nombre: ${est.nombre} ${est.apellido}, Curso: ${est.curso}`);
    });
    
    if (estudiantes.length > 0) {
      const estudianteId = estudiantes[0].id;
      console.log(`\n2️⃣ Probando con estudiante ID: ${estudianteId}`);
      
      // 2. Probar historial académico (sin autenticación)
      console.log('\n3️⃣ Probando historial académico...');
      try {
        const historial = await makeRequest('GET', `/api/historial-academico/estudiante/${estudianteId}?anio=2025`);
        console.log('📚 Historial académico:', JSON.stringify(historial, null, 2));
      } catch (e) {
        console.log('❌ Error en historial académico:', e.message);
      }
      
      // 3. Probar seguimiento académico (sin autenticación)
      console.log('\n4️⃣ Probando seguimiento académico...');
      try {
        const seguimiento = await makeRequest('GET', `/api/seguimiento-academico/estudiante/${estudianteId}?anio=2025`);
        console.log('📊 Seguimiento académico:', JSON.stringify(seguimiento, null, 2));
      } catch (e) {
        console.log('❌ Error en seguimiento académico:', e.message);
      }
      
      // 4. Probar asistencia (sin autenticación)
      console.log('\n5️⃣ Probando asistencia...');
      try {
        const asistencia = await makeRequest('GET', `/api/asistencia/estudiante/${estudianteId}?anio=2025`);
        console.log('📅 Asistencia:', JSON.stringify(asistencia, null, 2));
      } catch (e) {
        console.log('❌ Error en asistencia:', e.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function makeRequest(method, path, data = null) {
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

testStudentData();
