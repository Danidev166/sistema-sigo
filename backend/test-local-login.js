// Script para probar el login en el servidor local
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
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

async function testLocalLogin() {
  console.log('🧪 Probando login en servidor local...\n');

  try {
    // Esperar un poco para que el servidor esté listo
    console.log('⏳ Esperando que el servidor esté listo...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Probar endpoint de salud
    console.log('1️⃣ Probando endpoint de salud...');
    const healthResponse = await makeRequest('/api/health');
    console.log(`   Status: ${healthResponse.status}`);
    
    if (healthResponse.status !== 200) {
      console.log('   ❌ Servidor no está respondiendo correctamente');
      console.log('   📋 Respuesta:', healthResponse.data);
      return;
    }
    
    console.log('   ✅ Servidor funcionando');

    // Probar login
    console.log('\n2️⃣ Probando login...');
    const loginData = {
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    };

    const loginResponse = await makeRequest('/api/auth/login', 'POST', loginData);
    console.log(`   Status: ${loginResponse.status}`);
    
    if (loginResponse.status === 200 && loginResponse.data.token) {
      console.log('   ✅ Login exitoso en servidor local');
      console.log(`   👤 Usuario: ${loginResponse.data.user?.nombre || 'Daniel'}`);
      console.log(`   🔑 Token recibido: ${loginResponse.data.token.substring(0, 20)}...`);
      
      // Probar endpoint de promoción con el token
      console.log('\n3️⃣ Probando endpoint de promoción...');
      const promocionResponse = await makeRequest('/api/promocion/reporte?curso=1° BÁSICO&anio=2024', 'GET', null, true);
      console.log(`   Status: ${promocionResponse.status}`);
      
      if (promocionResponse.status === 200) {
        console.log('   ✅ Endpoint de promoción funcionando');
        console.log(`   📊 Total estudiantes: ${promocionResponse.data.total_estudiantes || 0}`);
      } else {
        console.log('   ⚠️ Error en endpoint de promoción:', promocionResponse.data);
      }
      
    } else {
      console.log('   ❌ Error en login:', loginResponse.data);
    }

    console.log('\n🎉 Prueba completada');

  } catch (error) {
    console.error('💥 Error durante la prueba:', error.message);
  }
}

// Ejecutar la prueba
testLocalLogin().then(() => {
  console.log('\n🏁 Prueba finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
