// Script simple para probar la conexión
const http = require('http');

function testConnection() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log('Response:', body);
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });

  req.end();
}

console.log('Probando conexión al servidor...');
testConnection();
