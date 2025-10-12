// Script para agregar datos de prueba de seguimiento académico
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function addSeguimientoData() {
  try {
    const pool = await getPool();
    console.log('📝 Agregando datos de seguimiento académico...\n');
    
    // Obtener estudiantes activos
    const estudiantesResult = await pool.request().query('SELECT id, nombre, apellido FROM estudiantes WHERE estado = \'Activo\'');
    const estudiantes = estudiantesResult.recordset;
    
    if (estudiantes.length === 0) {
      console.log('No hay estudiantes activos para agregar datos.');
      return;
    }
    
    const asignaturas = ['Matemáticas', 'Lenguaje', 'Historia', 'Ciencias', 'Educación Física'];
    
    for (const estudiante of estudiantes) {
      console.log(`📚 Agregando seguimiento para ${estudiante.nombre} ${estudiante.apellido}...`);
      
      // Agregar 3-5 registros por estudiante
      const numRegistros = Math.floor(Math.random() * 3) + 3; // 3-5 registros
      
      for (let i = 0; i < numRegistros; i++) {
        const asignatura = asignaturas[Math.floor(Math.random() * asignaturas.length)];
        const nota = (Math.random() * 3 + 3).toFixed(1); // Nota entre 3.0 y 6.0
        const promedioCurso = (Math.random() * 2 + 4).toFixed(1); // Promedio curso entre 4.0 y 6.0
        const fecha = new Date(2025, 0, 15 + i * 7); // Cada semana
        
        await pool.request()
          .input('id_estudiante', estudiante.id)
          .input('asignatura', asignatura)
          .input('nota', parseFloat(nota))
          .input('promedio_curso', parseFloat(promedioCurso))
          .input('fecha', fecha)
          .input('observaciones', `Evaluación ${i + 1} - ${asignatura}`)
          .query(`
            INSERT INTO seguimiento_academico (id_estudiante, asignatura, nota, promedio_curso, fecha, observaciones)
            VALUES (@id_estudiante, @asignatura, @nota, @promedio_curso, @fecha, @observaciones)
          `);
      }
      
      console.log(`  ✅ ${numRegistros} registros agregados`);
    }
    
    console.log('\n🎉 Datos de seguimiento académico agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addSeguimientoData();


