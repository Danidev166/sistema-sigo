const { getPool, selftest } = require('../config/db');

async function test() {
  try {
    console.log('--- Iniciando Selftest de DB ---');
    await selftest();

    console.log('\n--- Probando obtención de usuarios (nuevo modelo) ---');
    const UsuarioModel = require('../models/usuarioModel');
    const usuarios = await UsuarioModel.obtenerUsuarios();
    console.log(`✅ Usuarios obtenidos: ${usuarios.length}`);
    if (usuarios.length > 0) {
      console.log('Ejemplo usuario:', {
        id: usuarios[0].id,
        nombre: usuarios[0].nombre,
        email: usuarios[0].email
      });
    }

    console.log('\n--- Probando búsqueda por email ---');
    if (usuarios.length > 0) {
      const emailToSearch = usuarios[0].email;
      const u = await UsuarioModel.obtenerUsuarioPorEmail(emailToSearch);
      if (u && u.email === emailToSearch) {
        console.log(`✅ Búsqueda por email exitosa para: ${emailToSearch}`);
      } else {
        console.log(`❌ Error en búsqueda por email`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR DURANTE EL TEST:', error);
    process.exit(1);
  }
}

test();
