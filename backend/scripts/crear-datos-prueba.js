// Script para crear datos de prueba en PostgreSQL
const { Pool } = require('pg');

// Cargar configuración de producción
require('dotenv').config({ path: '.env.production' });

async function crearDatosPrueba() {
  let pool;
  
  try {
    console.log('🔧 Creando datos de prueba...');
    
    // Crear pool de conexión
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    
    const client = await pool.connect();
    
    // 1. Crear datos de asistencia para el estudiante existente
    console.log('📅 Creando datos de asistencia...');
    
    // Obtener el ID del estudiante existente
    const estudianteResult = await client.query('SELECT id, nombre, apellido FROM estudiantes LIMIT 1');
    if (estudianteResult.rows.length === 0) {
      console.log('❌ No hay estudiantes en la base de datos');
      return;
    }
    
    const estudiante = estudianteResult.rows[0];
    console.log(`👤 Estudiante encontrado: ${estudiante.nombre} ${estudiante.apellido} (ID: ${estudiante.id})`);
    
    // Crear datos de asistencia para los últimos 30 días
    const hoy = new Date();
    const datosAsistencia = [];
    
    for (let i = 0; i < 30; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      
      // Simular asistencia (80% de probabilidad de estar presente)
      const tipo = Math.random() < 0.8 ? 'Presente' : (Math.random() < 0.5 ? 'Ausente' : 'Justificada');
      
      datosAsistencia.push({
        id_estudiante: estudiante.id,
        fecha: fecha.toISOString().split('T')[0],
        tipo: tipo,
        justificacion: tipo === 'Justificada' ? 'Cita médica' : ''
      });
    }
    
    // Insertar datos de asistencia
    for (const dato of datosAsistencia) {
      await client.query(
        'INSERT INTO asistencia (id_estudiante, fecha, tipo, justificacion) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [dato.id_estudiante, dato.fecha, dato.tipo, dato.justificacion]
      );
    }
    
    console.log(`✅ Creados ${datosAsistencia.length} registros de asistencia`);
    
    // 2. Crear datos de historial académico
    console.log('📚 Creando datos de historial académico...');
    
    await client.query(
      'INSERT INTO historial_academico (id_estudiante, promedio_general, asistencia, observaciones_academicas, fecha_actualizacion) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
      [
        estudiante.id,
        5.2, // Promedio general
        85,  // Porcentaje de asistencia
        'Estudiante con buen rendimiento académico',
        new Date()
      ]
    );
    
    console.log('✅ Creado historial académico');
    
    // 3. Crear más estudiantes de prueba
    console.log('👥 Creando más estudiantes de prueba...');
    
    const estudiantesPrueba = [
      { nombre: 'María', apellido: 'González', curso: '1° Medio A', rut: '12345678-9' },
      { nombre: 'Carlos', apellido: 'López', curso: '1° Medio B', rut: '23456789-0' },
      { nombre: 'Ana', apellido: 'Martínez', curso: '2° Medio A', rut: '34567890-1' },
      { nombre: 'Luis', apellido: 'Rodríguez', curso: '2° Medio B', rut: '45678901-2' },
      { nombre: 'Sofia', apellido: 'Hernández', curso: '3° Medio A', rut: '56789012-3' }
    ];
    
    for (const est of estudiantesPrueba) {
      const result = await client.query(
        'INSERT INTO estudiantes (nombre, apellido, curso, rut, estado, especialidad, situacion_economica, fecha_registro) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (rut) DO NOTHING RETURNING id',
        [est.nombre, est.apellido, est.curso, est.rut, 'activo', 'Técnico', 'media', new Date()]
      );
      
      if (result.rows.length > 0) {
        const nuevoEstudianteId = result.rows[0].id;
        console.log(`✅ Creado estudiante: ${est.nombre} ${est.apellido} (ID: ${nuevoEstudianteId})`);
        
        // Crear datos de asistencia para el nuevo estudiante
        for (let i = 0; i < 20; i++) {
          const fecha = new Date(hoy);
          fecha.setDate(fecha.getDate() - i);
          const tipo = Math.random() < 0.75 ? 'Presente' : (Math.random() < 0.5 ? 'Ausente' : 'Justificada');
          
          await client.query(
            'INSERT INTO asistencia (id_estudiante, fecha, tipo, justificacion) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
            [nuevoEstudianteId, fecha.toISOString().split('T')[0], tipo, tipo === 'Justificada' ? 'Cita médica' : '']
          );
        }
      }
    }
    
    // 4. Crear más entrevistas
    console.log('💬 Creando más entrevistas...');
    
    const entrevistasPrueba = [
      { motivo: 'Académico', observaciones: 'Revisión de rendimiento' },
      { motivo: 'Conductual', observaciones: 'Seguimiento de comportamiento' },
      { motivo: 'Familiar', observaciones: 'Apoyo familiar' },
      { motivo: 'Emocional', observaciones: 'Apoyo emocional' }
    ];
    
    for (const entrevista of entrevistasPrueba) {
      await client.query(
        'INSERT INTO entrevistas (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, estado) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        [estudiante.id, 1, new Date(), entrevista.motivo, entrevista.observaciones, 'Realizada']
      );
    }
    
    console.log('✅ Creadas entrevistas adicionales');
    
    // 5. Verificar datos creados
    console.log('\n📊 Verificando datos creados...');
    
    const conteos = {
      estudiantes: await client.query('SELECT COUNT(*) as total FROM estudiantes'),
      asistencia: await client.query('SELECT COUNT(*) as total FROM asistencia'),
      entrevistas: await client.query('SELECT COUNT(*) as total FROM entrevistas'),
      historial: await client.query('SELECT COUNT(*) as total FROM historial_academico')
    };
    
    console.log('📈 Conteos finales:');
    Object.entries(conteos).forEach(([tabla, result]) => {
      console.log(`   - ${tabla}: ${result.rows[0].total} registros`);
    });
    
    client.release();
    console.log('\n🎉 Datos de prueba creados exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

crearDatosPrueba();
