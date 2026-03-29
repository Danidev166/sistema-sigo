const https = require('https');

console.log('🌐 Probando frontend en Render...\n');

const options = {
  hostname: 'sigo-caupolican.onrender.com',
  port: 443,
  path: '/',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
};

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📄 Contenido (primeros 500 caracteres):');
    console.log(data.substring(0, 500));
    
    // Buscar si contiene "Promoción" en el HTML
    if (data.includes('Promoción') || data.includes('promocion')) {
      console.log('\n✅ ¡Enlace de Promoción encontrado en el HTML!');
    } else {
      console.log('\n❌ Enlace de Promoción NO encontrado en el HTML');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.end();


