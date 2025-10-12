// Script para agregar datos de prueba de entrevistas
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function addEntrevistasData() {
  try {
    const pool = await getPool();
    console.log('📝 Agregando datos de entrevistas...\n');
    
    // Obtener estudiantes activos
    const estudiantesResult = await pool.request().query('SELECT id, nombre, apellido FROM estudiantes WHERE estado = \'Activo\'');
    const estudiantes = estudiantesResult.recordset;
    
    if (estudiantes.length === 0) {
      console.log('No hay estudiantes activos para agregar datos.');
      return;
    }
    
    const motivos = ['Psicológico', 'Vocacional', 'Académico', 'Familiar', 'Social'];
    const orientadores = ['Dr. Juan Pérez', 'Dra. María González', 'Lic. Carlos Silva', 'Psic. Ana Martínez'];
    const observaciones = [
      'Estudiante mostró buena disposición durante la entrevista',
      'Se identificaron áreas de mejora en el rendimiento académico',
      'El estudiante expresó interés en carreras técnicas',
      'Se observó necesidad de apoyo emocional',
      'La familia está comprometida con el proceso educativo',
      'Se detectaron fortalezas en el área social',
      'El estudiante tiene claridad sobre sus objetivos',
      'Se requiere seguimiento continuo'
    ];
    const conclusiones = [
      'Se implementará plan de apoyo académico',
      'Se derivará a orientación vocacional',
      'Se coordinará reunión con la familia',
      'Se establecerá seguimiento semanal',
      'Se aplicarán estrategias de motivación',
      'Se trabajará en habilidades sociales',
      'Se mantendrá comunicación regular',
      'Se evaluará progreso mensualmente'
    ];
    const accionesAcordadas = [
      'Sesiones de refuerzo en matemáticas',
      'Orientación vocacional individual',
      'Reunión con apoderado la próxima semana',
      'Seguimiento de asistencia diaria',
      'Aplicación de técnicas de estudio',
      'Participación en actividades grupales',
      'Comunicación semanal con la familia',
      'Evaluación de progreso mensual'
    ];
    
    for (const estudiante of estudiantes) {
      console.log(`📚 Agregando entrevistas para ${estudiante.nombre} ${estudiante.apellido}...`);
      
      // Agregar 1-2 entrevistas por estudiante
      const numEntrevistas = Math.floor(Math.random() * 2) + 1; // 1-2 entrevistas
      
      for (let i = 0; i < numEntrevistas; i++) {
        const motivo = motivos[Math.floor(Math.random() * motivos.length)];
        const orientador = orientadores[Math.floor(Math.random() * orientadores.length)];
        const observacion = observaciones[Math.floor(Math.random() * observaciones.length)];
        const conclusion = conclusiones[Math.floor(Math.random() * conclusiones.length)];
        const accion = accionesAcordadas[Math.floor(Math.random() * accionesAcordadas.length)];
        const fecha = new Date(2025, 0, 8 + i * 25); // Cada 25 días
        
        await pool.request()
          .input('id_estudiante', estudiante.id)
          .input('id_orientador', 1) // ID fijo del orientador
          .input('motivo', motivo)
          .input('observaciones', `${observacion}. ${conclusion}. Acciones: ${accion}`)
          .input('fecha_entrevista', fecha)
          .input('estado', 'Realizada')
          .query(`
            INSERT INTO entrevistas (id_estudiante, id_orientador, motivo, observaciones, fecha_entrevista, estado)
            VALUES (@id_estudiante, @id_orientador, @motivo, @observaciones, @fecha_entrevista, @estado)
          `);
      }
      
      console.log(`  ✅ ${numEntrevistas} entrevistas agregadas`);
    }
    
    console.log('\n🎉 Datos de entrevistas agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addEntrevistasData();
