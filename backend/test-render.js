const https = require('https');

console.log('🧪 Probando servidor en Render...\n');

// Función para hacer requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function testRender() {
  try {
    console.log('1️⃣ Probando endpoint de salud...');
    const healthResponse = await makeRequest('https://sigo-caupolican.onrender.com/api/health');
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.status === 200) {
      console.log('   ✅ Servidor en Render funcionando');
    } else {
      console.log('   ❌ Servidor no responde correctamente');
      return;
    }

    console.log('\n2️⃣ Probando login...');
    const loginData = JSON.stringify({
      email: 'daniel1822@gmail.com',
      password: 'fran0404'
    });
    
    const loginResponse = await makeRequest('https://sigo-caupolican.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      },
      body: loginData
    });
    
    console.log(`   Status: ${loginResponse.status}`);
    if (loginResponse.status === 200) {
      console.log('   ✅ Login exitoso en Render');
      console.log(`   👤 Usuario: ${loginResponse.data.user?.nombre || 'N/A'}`);
      console.log(`   🔑 Token recibido: ${loginResponse.data.token?.substring(0, 20)}...`);
    } else {
      console.log('   ❌ Error en login:', loginResponse.data);
    }

    console.log('\n3️⃣ Probando endpoint de promoción...');
    const cursoEncoded = encodeURIComponent('1° BÁSICO');
    const promocionResponse = await makeRequest(`https://sigo-caupolican.onrender.com/api/promocion/reporte/${cursoEncoded}/2024`);
    
    console.log(`   Status: ${promocionResponse.status}`);
    if (promocionResponse.status === 200) {
      console.log('   ✅ Endpoint de promoción funcionando');
      console.log(`   📊 Estudiantes encontrados: ${promocionResponse.data?.estudiantes?.length || 0}`);
    } else {
      console.log('   ❌ Error en promoción:', promocionResponse.data);
    }

  } catch (error) {
    console.log('💥 Error durante la prueba:', error.message);
  }
  
  console.log('\n🏁 Prueba completada');
}

testRender();
