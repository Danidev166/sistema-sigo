// Script para probar el login con CORS corregido
const http = require('http');

function testLogin() {
  const loginData = JSON.stringify({
    email: 'daniel1822@gmail.com',
    password: 'fran0404'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData),
      'Origin': 'http://localhost:5174' // Simular el origen del frontend
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Response:', body);
      if (res.statusCode === 200) {
        console.log('✅ Login exitoso!');
      } else {
        console.log('❌ Error en login');
      }
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });

  req.write(loginData);
  req.end();
}

console.log('🧪 Probando login con CORS corregido...');
console.log('📡 Origen: http://localhost:5174');
testLogin();
