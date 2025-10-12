// Script para agregar datos de prueba de intervenciones
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function addIntervencionesData() {
  try {
    const pool = await getPool();
    console.log('📝 Agregando datos de intervenciones...\n');
    
    // Obtener estudiantes activos
    const estudiantesResult = await pool.request().query('SELECT id, nombre, apellido FROM estudiantes WHERE estado = \'Activo\'');
    const estudiantes = estudiantesResult.recordset;
    
    if (estudiantes.length === 0) {
      console.log('No hay estudiantes activos para agregar datos.');
      return;
    }
    
    const tiposIntervencion = ['Académica', 'Psicológica', 'Social', 'Familiar', 'Vocacional'];
    const acciones = [
      'Refuerzo académico en matemáticas',
      'Sesión de orientación vocacional',
      'Apoyo psicológico individual',
      'Reunión con apoderado',
      'Tutoría entre pares',
      'Plan de mejora académica',
      'Seguimiento de asistencia',
      'Apoyo en técnicas de estudio'
    ];
    const metas = [
      'Mejorar rendimiento académico',
      'Desarrollar habilidades sociales',
      'Fortalecer autoestima',
      'Mejorar asistencia a clases',
      'Definir proyecto de vida',
      'Desarrollar hábitos de estudio',
      'Mejorar relaciones familiares',
      'Superar dificultades de aprendizaje'
    ];
    const compromisos = [
      'Asistir a todas las sesiones programadas',
      'Completar tareas asignadas',
      'Mantener comunicación con el equipo',
      'Aplicar estrategias aprendidas',
      'Participar activamente en las actividades',
      'Cumplir con los plazos establecidos',
      'Mantener una actitud positiva',
      'Colaborar con el proceso de mejora'
    ];
    const responsables = ['Orientador', 'Psicólogo', 'Profesor Jefe', 'Coordinador', 'Equipo Directivo'];
    
    for (const estudiante of estudiantes) {
      console.log(`📚 Agregando intervenciones para ${estudiante.nombre} ${estudiante.apellido}...`);
      
      // Agregar 1-3 intervenciones por estudiante
      const numIntervenciones = Math.floor(Math.random() * 3) + 1; // 1-3 intervenciones
      
      for (let i = 0; i < numIntervenciones; i++) {
        const tipo = tiposIntervencion[Math.floor(Math.random() * tiposIntervencion.length)];
        const accion = acciones[Math.floor(Math.random() * acciones.length)];
        const meta = metas[Math.floor(Math.random() * metas.length)];
        const compromiso = compromisos[Math.floor(Math.random() * compromisos.length)];
        const responsable = responsables[Math.floor(Math.random() * responsables.length)];
        const fecha = new Date(2025, 0, 5 + i * 20); // Cada 20 días
        
        await pool.request()
          .input('id_estudiante', estudiante.id)
          .input('accion', `${tipo}: ${accion}`)
          .input('meta', meta)
          .input('compromiso', compromiso)
          .input('responsable', responsable)
          .input('fecha', fecha)
          .input('completado', false)
          .query(`
            INSERT INTO intervenciones (id_estudiante, accion, meta, compromiso, responsable, fecha, completado)
            VALUES (@id_estudiante, @accion, @meta, @compromiso, @responsable, @fecha, @completado)
          `);
      }
      
      console.log(`  ✅ ${numIntervenciones} intervenciones agregadas`);
    }
    
    console.log('\n🎉 Datos de intervenciones agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addIntervencionesData();
