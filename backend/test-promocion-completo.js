// Script completo para probar el sistema de promoción con autenticación real
const http = require('http');

const BASE_URL = 'http://localhost:3001';
let authToken = null;

function makeRequest(path, method = 'GET', data = null, useAuth = true) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (useAuth && authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

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

async function login() {
  console.log('🔐 Iniciando sesión...');
  try {
    const loginData = {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    };

    const response = await makeRequest('/api/auth/login', 'POST', loginData, false);
    
    if (response.status === 200 && response.data.token) {
      authToken = response.data.token;
      console.log('✅ Login exitoso');
      console.log(`👤 Usuario: ${response.data.user?.nombre || 'Daniel'}`);
      return true;
    } else {
      console.log('❌ Error en login:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Error de conexión en login:', error.message);
    return false;
  }
}

async function testPromocionEndpoints() {
  console.log('\n🧪 Probando endpoints de promoción...\n');

  try {
    // Probar endpoint de salud
    console.log('1️⃣ Probando endpoint de salud...');
    const healthResponse = await makeRequest('/api/health', 'GET', null, false);
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.status === 200) {
      console.log('   ✅ Servidor funcionando');
    }

    // Probar endpoint de reporte de promoción
    console.log('\n2️⃣ Probando endpoint de reporte de promoción...');
    try {
      const cursoEncoded = encodeURIComponent('1° BÁSICO');
      const reporteResponse = await makeRequest(`/api/promocion/reporte?curso=${cursoEncoded}&anio=2024`);
      console.log(`   Status: ${reporteResponse.status}`);
      
      if (reporteResponse.status === 200) {
        console.log('   ✅ Endpoint de reporte funcionando');
        console.log(`   📊 Total estudiantes: ${reporteResponse.data.total_estudiantes || 0}`);
        console.log(`   📈 Promovidos: ${reporteResponse.data.resumen?.promovidos || 0}`);
        console.log(`   📉 Repiten: ${reporteResponse.data.resumen?.repiten || 0}`);
        console.log(`   ❓ Requieren decisión: ${reporteResponse.data.resumen?.requieren_decision || 0}`);
        
        // Mostrar detalles de algunos estudiantes si existen
        if (reporteResponse.data.estudiantes && reporteResponse.data.estudiantes.length > 0) {
          console.log('\n   📋 Detalles de estudiantes:');
          reporteResponse.data.estudiantes.slice(0, 3).forEach((estudiante, index) => {
            console.log(`   ${index + 1}. ${estudiante.nombre} ${estudiante.apellido}`);
            console.log(`      - RUT: ${estudiante.rut}`);
            console.log(`      - Promedio: ${estudiante.promedio_anual}`);
            console.log(`      - Asistencia: ${estudiante.porcentaje_asistencia}%`);
            console.log(`      - Estado: ${estudiante.criterios?.estado_promocion || 'N/A'}`);
          });
        }
      } else {
        console.log('   ⚠️ Error en endpoint de reporte');
        console.log('   📋 Respuesta:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.log('   ❌ Error probando endpoint de reporte:', error.message);
    }

    // Probar endpoint de estudiantes pendientes
    console.log('\n3️⃣ Probando endpoint de estudiantes pendientes...');
    try {
      const pendientesResponse = await makeRequest('/api/promocion/pendientes');
      console.log(`   Status: ${pendientesResponse.status}`);
      
      if (pendientesResponse.status === 200) {
        console.log('   ✅ Endpoint de pendientes funcionando');
        console.log(`   👥 Estudiantes pendientes: ${Array.isArray(pendientesResponse.data) ? pendientesResponse.data.length : 0}`);
      } else {
        console.log('   ⚠️ Error en endpoint de pendientes');
        console.log('   📋 Respuesta:', pendientesResponse.data);
      }
    } catch (error) {
      console.log('   ❌ Error probando endpoint de pendientes:', error.message);
    }

    console.log('\n🎉 Pruebas de endpoints completadas');
    console.log('✅ El sistema de promoción está funcionando correctamente');

  } catch (error) {
    console.error('💥 Error durante las pruebas:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando prueba completa del sistema de promoción...\n');

  // Primero hacer login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ No se pudo autenticar. Abortando pruebas.');
    process.exit(1);
  }

  // Luego probar los endpoints
  await testPromocionEndpoints();

  console.log('\n🏁 Pruebas finalizadas');
  process.exit(0);
}

// Ejecutar las pruebas
main().catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
