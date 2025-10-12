// Script para agregar datos de prueba de conducta
process.env.DATABASE_URL = 'postgresql://sitema_sigo:z5blhb00@localhost:5432/sistema-sigo';
const { getPool } = require('./config/db');

async function addConductaData() {
  try {
    const pool = await getPool();
    console.log('📝 Agregando datos de conducta...\n');
    
    // Obtener estudiantes activos
    const estudiantesResult = await pool.request().query('SELECT id, nombre, apellido FROM estudiantes WHERE estado = \'Activo\'');
    const estudiantes = estudiantesResult.recordset;
    
    if (estudiantes.length === 0) {
      console.log('No hay estudiantes activos para agregar datos.');
      return;
    }
    
    const tiposConducta = ['Positiva', 'Negativa', 'Neutra'];
    const descripcionesPositivas = [
      'Ayudó a un compañero en clase',
      'Participó activamente en la discusión',
      'Mantuvo el orden en el aula',
      'Colaboró en trabajo grupal',
      'Mostró respeto hacia el profesor'
    ];
    const descripcionesNegativas = [
      'Interrumpió la clase constantemente',
      'No respetó las normas del aula',
      'Faltó el respeto a un compañero',
      'No cumplió con las tareas asignadas',
      'Usó lenguaje inapropiado'
    ];
    const descripcionesNeutras = [
      'Observación general del comportamiento',
      'Comportamiento dentro del rango normal',
      'Sin incidentes destacados',
      'Participación regular en clase'
    ];
    
    for (const estudiante of estudiantes) {
      console.log(`📚 Agregando conducta para ${estudiante.nombre} ${estudiante.apellido}...`);
      
      // Agregar 2-4 registros por estudiante
      const numRegistros = Math.floor(Math.random() * 3) + 2; // 2-4 registros
      
      for (let i = 0; i < numRegistros; i++) {
        const tipo = tiposConducta[Math.floor(Math.random() * tiposConducta.length)];
        let descripcion;
        
        if (tipo === 'Positiva') {
          descripcion = descripcionesPositivas[Math.floor(Math.random() * descripcionesPositivas.length)];
        } else if (tipo === 'Negativa') {
          descripcion = descripcionesNegativas[Math.floor(Math.random() * descripcionesNegativas.length)];
        } else {
          descripcion = descripcionesNeutras[Math.floor(Math.random() * descripcionesNeutras.length)];
        }
        
        const fecha = new Date(2025, 0, 10 + i * 15); // Cada 15 días
        
        await pool.request()
          .input('id_estudiante', estudiante.id)
          .input('categoria', tipo)
          .input('observacion', descripcion)
          .input('fecha', fecha)
          .query(`
            INSERT INTO conducta (id_estudiante, categoria, observacion, fecha)
            VALUES (@id_estudiante, @categoria, @observacion, @fecha)
          `);
      }
      
      console.log(`  ✅ ${numRegistros} registros agregados`);
    }
    
    console.log('\n🎉 Datos de conducta agregados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addConductaData();
