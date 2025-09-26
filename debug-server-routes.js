// Script para diagnosticar problemas de rutas en el servidor
const axios = require('axios');

const API_BASE = 'https://sistema-sigo.onrender.com/api';

async function debugServerRoutes() {
  console.log('🔍 Diagnóstico completo del servidor SIGO\n');

  try {
    // 1. Verificar servidor principal
    console.log('1️⃣ Verificando servidor principal...');
    const rootResponse = await axios.get('https://sistema-sigo.onrender.com/');
    console.log('✅ Servidor principal:', rootResponse.data.message);
    console.log('   Versión:', rootResponse.data.version);
    console.log('   Timestamp:', rootResponse.data.timestamp);

    // 2. Verificar health check
    console.log('\n2️⃣ Verificando health check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    console.log('   Uptime:', Math.round(healthResponse.data.uptime), 'segundos');
    console.log('   Environment:', healthResponse.data.environment);

    // 3. Probar login
    console.log('\n3️⃣ Probando autenticación...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'test@test.com',
        password: 'test123'
      });
      console.log('✅ Login exitoso');
      const token = loginResponse.data.token;
      const headers = { Authorization: `Bearer ${token}` };

      // 4. Probar rutas con autenticación
      console.log('\n4️⃣ Probando rutas autenticadas...');
      const protectedRoutes = [
        { name: 'Estudiantes', path: '/estudiantes' },
        { name: 'Agenda', path: '/agenda' },
        { name: 'Asistencia', path: '/asistencia' },
        { name: 'Entrevistas', path: '/entrevistas' },
        { name: 'Reportes', path: '/reportes' }
      ];

      for (const route of protectedRoutes) {
        try {
          const response = await axios.get(`${API_BASE}${route.path}`, { headers });
          console.log(`✅ ${route.name}: ${response.status} (${response.data.length || 'N/A'} registros)`);
        } catch (error) {
          console.log(`❌ ${route.name}: ${error.response?.status || 'Error'} - ${error.response?.data?.error || error.message}`);
        }
      }

      // 5. Probar endpoint específico de entrevistas
      console.log('\n5️⃣ Probando endpoint específico de entrevistas...');
      try {
        // Primero obtener una agenda
        const agendaResponse = await axios.get(`${API_BASE}/agenda`, { headers });
        if (agendaResponse.data.length > 0) {
          const agendaId = agendaResponse.data[0].id;
          console.log(`   Usando agenda ID: ${agendaId}`);
          
          // Probar endpoint de registrar entrevista
          try {
            const entrevistaResponse = await axios.post(
              `${API_BASE}/entrevistas/registrar-desde-agenda/${agendaId}`,
              {
                observaciones: 'Test de diagnóstico',
                conclusiones: 'Test de conclusiones',
                acciones_acordadas: 'Test de acciones'
              },
              { headers }
            );
            console.log('✅ Endpoint registrar-desde-agenda funciona:', entrevistaResponse.data.message);
          } catch (error) {
            console.log('❌ Endpoint registrar-desde-agenda falló:', error.response?.status, error.response?.data?.error || error.message);
          }
        } else {
          console.log('⚠️ No hay agendas disponibles para probar');
        }
      } catch (error) {
        console.log('❌ Error al probar endpoint específico:', error.message);
      }

    } catch (loginError) {
      console.log('❌ Error en login:', loginError.response?.data || loginError.message);
    }

    // 6. Verificar rutas sin autenticación
    console.log('\n6️⃣ Probando rutas públicas...');
    const publicRoutes = [
      { name: 'Test Health', path: '/test/health' },
      { name: 'Test DB', path: '/test/db' }
    ];

    for (const route of publicRoutes) {
      try {
        const response = await axios.get(`${API_BASE}${route.path}`);
        console.log(`✅ ${route.name}: ${response.status}`);
        if (response.data) {
          console.log(`   Datos:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
        }
      } catch (error) {
        console.log(`❌ ${route.name}: ${error.response?.status || 'Error'} - ${error.response?.data?.error || error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.response?.data || error.message);
  }

  console.log('\n🏁 Diagnóstico completado');
}

debugServerRoutes();
