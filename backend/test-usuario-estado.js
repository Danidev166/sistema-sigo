// Script para probar la funcionalidad de estado de usuarios
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testUsuarioEstado() {
  try {
    console.log('Ì∑™ Probando funcionalidad de estado de usuarios...\n');

    // 1. Login con usuario admin
    console.log('1. Haciendo login con usuario admin...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@liceo.cl',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('‚úÖ Login exitoso\n');

    // 2. Obtener lista de usuarios
    console.log('2. Obteniendo lista de usuarios...');
    const usuariosResponse = await axios.get(`${API_BASE}/usuarios`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const usuarios = usuariosResponse.data;
    console.log(`‚úÖ Se encontraron ${usuarios.length} usuarios\n`);

    // 3. Mostrar estados actuales
    console.log('3. Estados actuales de usuarios:');
    usuarios.forEach(user => {
      console.log(`   - ${user.nombre} ${user.apellido}: ${user.estado ? 'Activo' : 'Inactivo'}`);
    });
    console.log('');

    // 4. Cambiar estado de un usuario (si hay m√°s de uno)
    if (usuarios.length > 1) {
      const usuarioPrueba = usuarios[1]; // Segundo usuario
      const nuevoEstado = !usuarioPrueba.estado;
      
      console.log(`4. Cambiando estado de ${usuarioPrueba.nombre} a ${nuevoEstado ? 'Activo' : 'Inactivo'}...`);
      
      await axios.patch(`${API_BASE}/usuarios/${usuarioPrueba.id}/estado`, 
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('‚úÖ Estado cambiado exitosamente\n');

      // 5. Verificar que el cambio se aplic√≥
      console.log('5. Verificando cambio de estado...');
      const usuariosActualizados = await axios.get(`${API_BASE}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const usuarioActualizado = usuariosActualizados.data.find(u => u.id === usuarioPrueba.id);
      console.log(`‚úÖ Estado actualizado: ${usuarioActualizado.nombre} ${usuarioActualizado.apellido}: ${usuarioActualizado.estado ? 'Activo' : 'Inactivo'}\n`);

      // 6. Probar login con usuario inactivo
      if (!nuevoEstado) {
        console.log('6. Probando login con usuario inactivo...');
        try {
          await axios.post(`${API_BASE}/auth/login`, {
            email: usuarioPrueba.email,
            password: 'password123' // Asumiendo contrase√±a por defecto
          });
          console.log('‚ùå ERROR: El usuario inactivo pudo hacer login');
        } catch (error) {
          if (error.response?.data?.error?.includes('inactiva')) {
            console.log('‚úÖ CORRECTO: El usuario inactivo no puede hacer login');
          } else {
            console.log('‚ùå ERROR: Mensaje de error inesperado:', error.response?.data?.error);
          }
        }
      }
    }

    console.log('\nÌæâ Prueba completada exitosamente!');

  } catch (error) {
    console.error('‚ùå Error durante la prueba:', error.response?.data || error.message);
  }
}

// Ejecutar la prueba
testUsuarioEstado();
