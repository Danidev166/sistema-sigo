// Script para agregar datos de prueba de comunicación familia
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function addFamiliaData() {
  try {
    const pool = await getPool();
    console.log('📝 Agregando datos de comunicación familia...\n');
    
    // Obtener estudiantes activos
    const estudiantesResult = await pool.request().query('SELECT id, nombre, apellido FROM estudiantes WHERE estado = \'Activo\'');
    const estudiantes = estudiantesResult.recordset;
    
    if (estudiantes.length === 0) {
      console.log('No hay estudiantes activos para agregar datos.');
      return;
    }
    
    const tiposComunicacion = ['Email', 'Llamada telefónica', 'Reunión presencial', 'WhatsApp', 'Carta'];
    const asuntos = [
      'Rendimiento académico del estudiante',
      'Asistencia a clases',
      'Comportamiento en el aula',
      'Orientación vocacional',
      'Apoyo en tareas escolares',
      'Reunión de apoderados',
      'Información sobre actividades',
      'Seguimiento de intervenciones'
    ];
    const detalles = [
      'Se informa sobre el progreso académico del estudiante',
      'Se solicita apoyo en el seguimiento de tareas',
      'Se coordina reunión para evaluar situación',
      'Se proporciona información sobre orientación vocacional',
      'Se comunica sobre actividades escolares programadas',
      'Se informa sobre el comportamiento en clases',
      'Se solicita colaboración en el proceso educativo',
      'Se coordina seguimiento de intervenciones aplicadas'
    ];
    
    for (const estudiante of estudiantes) {
      console.log(`📚 Agregando comunicación familia para ${estudiante.nombre} ${estudiante.apellido}...`);
      
      // Agregar 1-2 comunicaciones por estudiante
      const numComunicaciones = Math.floor(Math.random() * 2) + 1; // 1-2 comunicaciones
      
      for (let i = 0; i < numComunicaciones; i++) {
        const tipo = tiposComunicacion[Math.floor(Math.random() * tiposComunicacion.length)];
        const asunto = asuntos[Math.floor(Math.random() * asuntos.length)];
        const detalle = detalles[Math.floor(Math.random() * detalles.length)];
        const fecha = new Date(2025, 0, 12 + i * 30); // Cada 30 días
        
        await pool.request()
          .input('id_estudiante', estudiante.id)
          .input('tipo_comunicacion', tipo)
          .input('asunto', asunto)
          .input('detalle', detalle)
          .input('fecha_comunicacion', fecha)
          .query(`
            INSERT INTO comunicacion_familia (id_estudiante, tipo_comunicacion, asunto, detalle, fecha_comunicacion)
            VALUES (@id_estudiante, @tipo_comunicacion, @asunto, @detalle, @fecha_comunicacion)
          `);
      }
      
      console.log(`  ✅ ${numComunicaciones} comunicaciones agregadas`);
    }
    
    console.log('\n🎉 Datos de comunicación familia agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addFamiliaData();


