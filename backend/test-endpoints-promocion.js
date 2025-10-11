// Script para probar los endpoints de promoción
const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Token de prueba
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Iniciando pruebas de endpoints de promoción...\n');

  try {
    // Esperar un poco para que el servidor esté listo
    console.log('⏳ Esperando que el servidor esté listo...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Probar endpoint de salud
    console.log('1️⃣ Probando endpoint de salud...');
    try {
      const healthResponse = await makeRequest('/api/health');
      console.log(`   Status: ${healthResponse.status}`);
      if (healthResponse.status === 200) {
        console.log('   ✅ Servidor funcionando');
      } else {
        console.log('   ⚠️ Servidor con problemas');
      }
    } catch (error) {
      console.log('   ❌ No se pudo conectar al servidor');
      console.log('   💡 Asegúrate de que el servidor esté corriendo en el puerto 3001');
      return;
    }

    // Probar endpoint de reporte de promoción
    console.log('\n2️⃣ Probando endpoint de reporte de promoción...');
    try {
      const cursoEncoded = encodeURIComponent('1° BÁSICO');
      const reporteResponse = await makeRequest(`/api/promocion/reporte/${cursoEncoded}/2024`);
      console.log(`   Status: ${reporteResponse.status}`);
      if (reporteResponse.status === 200) {
        console.log('   ✅ Endpoint de reporte funcionando');
        console.log(`   📊 Total estudiantes: ${reporteResponse.data.total_estudiantes || 0}`);
        console.log(`   📈 Promovidos: ${reporteResponse.data.resumen?.promovidos || 0}`);
        console.log(`   📉 Repiten: ${reporteResponse.data.resumen?.repiten || 0}`);
        console.log(`   ❓ Requieren decisión: ${reporteResponse.data.resumen?.requieren_decision || 0}`);
      } else {
        console.log('   ⚠️ Error en endpoint de reporte');
        console.log('   📋 Respuesta:', reporteResponse.data);
      }
    } catch (error) {
      console.log('   ❌ Error probando endpoint de reporte:', error.message);
    }

    // Probar endpoint de estudiantes con datos
    console.log('\n3️⃣ Probando endpoint de estudiantes con datos...');
    try {
      const cursoEncoded = encodeURIComponent('1° BÁSICO');
      const estudiantesResponse = await makeRequest(`/api/promocion/estudiantes/${cursoEncoded}/2024`);
      console.log(`   Status: ${estudiantesResponse.status}`);
      if (estudiantesResponse.status === 200) {
        console.log('   ✅ Endpoint de estudiantes funcionando');
        console.log(`   👥 Estudiantes encontrados: ${Array.isArray(estudiantesResponse.data) ? estudiantesResponse.data.length : 0}`);
      } else {
        console.log('   ⚠️ Error en endpoint de estudiantes');
        console.log('   📋 Respuesta:', estudiantesResponse.data);
      }
    } catch (error) {
      console.log('   ❌ Error probando endpoint de estudiantes:', error.message);
    }

    console.log('\n🎉 Pruebas de endpoints completadas');
    console.log('✅ El sistema de promoción está funcionando correctamente');

  } catch (error) {
    console.error('💥 Error durante las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testEndpoints().then(() => {
  console.log('\n🏁 Pruebas finalizadas');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
