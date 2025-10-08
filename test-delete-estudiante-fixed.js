/**
 * Script de prueba para verificar la eliminación de estudiantes con foreign keys
 * Este script prueba la nueva implementación que elimina en cascada
 */

const EstudianteModel = require('./backend/models/estudianteModel');
const { getPool } = require('./backend/config/db');

async function testDeleteEstudiante() {
  console.log('🧪 INICIANDO PRUEBA DE ELIMINACIÓN DE ESTUDIANTE REAL');
  console.log('=' .repeat(60));
  
  try {
    const pool = await getPool();
    
    // 1. Buscar un estudiante existente en el sistema
    console.log('🔍 Buscando estudiante existente...');
    const estudiantesExistentes = await pool.raw.query(`
      SELECT id, nombre, apellido, rut, curso, estado 
      FROM estudiantes 
      WHERE estado = 'Activo' 
      ORDER BY id DESC 
      LIMIT 5
    `);
    
    if (estudiantesExistentes.rows.length === 0) {
      console.log('❌ No se encontraron estudiantes activos en el sistema');
      return;
    }
    
    console.log('📋 Estudiantes encontrados:');
    estudiantesExistentes.rows.forEach((est, index) => {
      console.log(`   ${index + 1}. ID: ${est.id} - ${est.nombre} ${est.apellido} (${est.rut}) - ${est.curso}`);
    });
    
    // Usar el primer estudiante encontrado
    const estudianteCreado = estudiantesExistentes.rows[0];
    console.log(`✅ Usando estudiante: ${estudianteCreado.nombre} ${estudianteCreado.apellido} (ID: ${estudianteCreado.id})`);
    
    // 2. Crear algunos registros relacionados para probar la eliminación en cascada
    console.log('📝 Creando registros relacionados...');
    
    // Crear registro en agenda
    await pool.raw.query(`
      INSERT INTO agenda (id_estudiante, fecha, hora, motivo, profesional, asistencia, creado_en)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      estudianteCreado.id,
      new Date(),
      '10:00:00',
      'Prueba de eliminación',
      'Profesor Test',
      'Pendiente',
      new Date()
    ]);
    console.log('✅ Registro de agenda creado');
    
    // Crear registro en asistencia
    await pool.raw.query(`
      INSERT INTO asistencia (id_estudiante, fecha, tipo, justificacion)
      VALUES ($1, $2, $3, $4)
    `, [
      estudianteCreado.id,
      new Date(),
      'Presente',
      'Prueba de eliminación'
    ]);
    console.log('✅ Registro de asistencia creado');
    
    // Crear registro en entrevistas
    await pool.raw.query(`
      INSERT INTO entrevistas (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      estudianteCreado.id,
      1, // Asumiendo que existe un usuario con ID 1
      new Date(),
      'Prueba de eliminación',
      'Observaciones de prueba',
      'Pendiente'
    ]);
    console.log('✅ Registro de entrevista creado');
    
    // 3. Verificar que existen registros relacionados
    console.log('🔍 Verificando registros relacionados...');
    
    const agendaCount = await pool.raw.query(
      'SELECT COUNT(*) as count FROM agenda WHERE id_estudiante = $1',
      [estudianteCreado.id]
    );
    
    const asistenciaCount = await pool.raw.query(
      'SELECT COUNT(*) as count FROM asistencia WHERE id_estudiante = $1',
      [estudianteCreado.id]
    );
    
    const entrevistasCount = await pool.raw.query(
      'SELECT COUNT(*) as count FROM entrevistas WHERE id_estudiante = $1',
      [estudianteCreado.id]
    );
    
    console.log(`📊 Registros relacionados encontrados:`);
    console.log(`   - Agenda: ${agendaCount.rows[0].count}`);
    console.log(`   - Asistencia: ${asistenciaCount.rows[0].count}`);
    console.log(`   - Entrevistas: ${entrevistasCount.rows[0].count}`);
    
    // 4. Intentar eliminar el estudiante (esto debería funcionar ahora)
    console.log('🗑️ Intentando eliminar estudiante con eliminación en cascada...');
    const resultado = await EstudianteModel.eliminar(estudianteCreado.id);
    
    if (resultado) {
      console.log('✅ ¡ÉXITO! Estudiante eliminado correctamente');
      
      // 5. Verificar que todos los registros relacionados fueron eliminados
      console.log('🔍 Verificando que todos los registros fueron eliminados...');
      
      const agendaCountAfter = await pool.raw.query(
        'SELECT COUNT(*) as count FROM agenda WHERE id_estudiante = $1',
        [estudianteCreado.id]
      );
      
      const asistenciaCountAfter = await pool.raw.query(
        'SELECT COUNT(*) as count FROM asistencia WHERE id_estudiante = $1',
        [estudianteCreado.id]
      );
      
      const entrevistasCountAfter = await pool.raw.query(
        'SELECT COUNT(*) as count FROM entrevistas WHERE id_estudiante = $1',
        [estudianteCreado.id]
      );
      
      const estudianteCountAfter = await pool.raw.query(
        'SELECT COUNT(*) as count FROM estudiantes WHERE id = $1',
        [estudianteCreado.id]
      );
      
      console.log(`📊 Registros después de eliminación:`);
      console.log(`   - Agenda: ${agendaCountAfter.rows[0].count}`);
      console.log(`   - Asistencia: ${asistenciaCountAfter.rows[0].count}`);
      console.log(`   - Entrevistas: ${entrevistasCountAfter.rows[0].count}`);
      console.log(`   - Estudiante: ${estudianteCountAfter.rows[0].count}`);
      
      // Verificar que todo fue eliminado
      const totalRegistros = 
        parseInt(agendaCountAfter.rows[0].count) +
        parseInt(asistenciaCountAfter.rows[0].count) +
        parseInt(entrevistasCountAfter.rows[0].count) +
        parseInt(estudianteCountAfter.rows[0].count);
      
      if (totalRegistros === 0) {
        console.log('🎉 ¡PERFECTO! Todos los registros fueron eliminados correctamente');
        console.log('✅ La eliminación en cascada funciona correctamente');
      } else {
        console.log('⚠️ ADVERTENCIA: Algunos registros no fueron eliminados');
      }
      
    } else {
      console.log('❌ ERROR: No se pudo eliminar el estudiante');
    }
    
  } catch (error) {
    console.error('❌ ERROR EN LA PRUEBA:', error);
    console.error('Detalles del error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  } finally {
    console.log('=' .repeat(60));
    console.log('🏁 PRUEBA COMPLETADA');
    process.exit(0);
  }
}

// Ejecutar la prueba
testDeleteEstudiante();
