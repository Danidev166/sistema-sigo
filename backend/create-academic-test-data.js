const { getPool } = require('./config/db');

async function createAcademicTestData() {
    try {
        console.log('📚 Creando datos de prueba académicos...\n');
        
        const pool = await getPool();
        
        // Obtener estudiantes existentes
        const estudiantes = await pool.raw.query('SELECT id, nombre, apellido FROM estudiantes LIMIT 3');
        console.log(`📋 Estudiantes encontrados: ${estudiantes.rows.length}`);
        
        if (estudiantes.rows.length === 0) {
            console.log('❌ No hay estudiantes para crear datos de prueba');
            return;
        }
        
        const estudiante = estudiantes.rows[0];
        console.log(`📝 Usando estudiante: ${estudiante.nombre} ${estudiante.apellido} (ID: ${estudiante.id})\n`);
        
        // 1. Crear datos de seguimiento académico
        console.log('1️⃣ Creando seguimiento académico...');
        const seguimientoData = [
            {
                id_estudiante: estudiante.id,
                fecha_seguimiento: new Date('2025-01-15'),
                rendimiento: 'Bueno',
                asistencia_porcentaje: 85.5,
                observaciones: 'Estudiante muestra buen rendimiento en matemáticas',
                recomendaciones: 'Continuar con el apoyo en ciencias',
                responsable_id: 3,
                periodo: 'Primer Trimestre',
                asignatura: 'Matemáticas',
                nota: 6.2,
                promedio_curso: 5.8,
                fecha: new Date('2025-01-15')
            },
            {
                id_estudiante: estudiante.id,
                fecha_seguimiento: new Date('2025-01-20'),
                rendimiento: 'Excelente',
                asistencia_porcentaje: 92.0,
                observaciones: 'Excelente desempeño en lenguaje',
                recomendaciones: 'Mantener el nivel actual',
                responsable_id: 3,
                periodo: 'Primer Trimestre',
                asignatura: 'Lenguaje',
                nota: 7.1,
                promedio_curso: 6.5,
                fecha: new Date('2025-01-20')
            },
            {
                id_estudiante: estudiante.id,
                fecha_seguimiento: new Date('2025-01-25'),
                rendimiento: 'Regular',
                asistencia_porcentaje: 78.0,
                observaciones: 'Necesita mejorar en ciencias naturales',
                recomendaciones: 'Refuerzo en ciencias naturales',
                responsable_id: 3,
                periodo: 'Primer Trimestre',
                asignatura: 'Ciencias Naturales',
                nota: 4.8,
                promedio_curso: 5.2,
                fecha: new Date('2025-01-25')
            },
            {
                id_estudiante: estudiante.id,
                fecha_seguimiento: new Date('2025-02-01'),
                rendimiento: 'Bueno',
                asistencia_porcentaje: 88.0,
                observaciones: 'Mejora notable en historia',
                recomendaciones: 'Continuar con el progreso',
                responsable_id: 3,
                periodo: 'Primer Trimestre',
                asignatura: 'Historia',
                nota: 6.5,
                promedio_curso: 6.0,
                fecha: new Date('2025-02-01')
            }
        ];
        
        for (const data of seguimientoData) {
            await pool.raw.query(`
                INSERT INTO seguimiento_academico 
                (id_estudiante, fecha_seguimiento, rendimiento, asistencia_porcentaje, observaciones, 
                 recomendaciones, responsable_id, periodo, asignatura, nota, promedio_curso, fecha)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `, [
                data.id_estudiante, data.fecha_seguimiento, data.rendimiento, 
                data.asistencia_porcentaje, data.observaciones, data.recomendaciones,
                data.responsable_id, data.periodo, data.asignatura, data.nota, 
                data.promedio_curso, data.fecha
            ]);
        }
        console.log(`   ✅ Creados ${seguimientoData.length} registros de seguimiento académico`);
        
        // 2. Crear datos de asistencia
        console.log('\n2️⃣ Creando datos de asistencia...');
        const asistenciaData = [];
        const fechas = [
            '2025-01-15', '2025-01-16', '2025-01-17', '2025-01-20', '2025-01-21',
            '2025-01-22', '2025-01-23', '2025-01-24', '2025-01-27', '2025-01-28',
            '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-03', '2025-02-04',
            '2025-02-05', '2025-02-06', '2025-02-07', '2025-02-10', '2025-02-11'
        ];
        
        const tipos = ['Presente', 'Presente', 'Presente', 'Ausente', 'Presente', 'Justificada'];
        
        for (let i = 0; i < fechas.length; i++) {
            const tipo = tipos[Math.floor(Math.random() * tipos.length)];
            asistenciaData.push({
                id_estudiante: estudiante.id,
                fecha: new Date(fechas[i]),
                tipo: tipo,
                justificacion: tipo === 'Justificada' ? 'Cita médica' : null,
                responsable_id: 3,
                observaciones: tipo === 'Ausente' ? 'Falta sin justificar' : null
            });
        }
        
        for (const data of asistenciaData) {
            await pool.raw.query(`
                INSERT INTO asistencia 
                (id_estudiante, fecha, tipo, justificacion, responsable_id, observaciones)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                data.id_estudiante, data.fecha, data.tipo, 
                data.justificacion, data.responsable_id, data.observaciones
            ]);
        }
        console.log(`   ✅ Creados ${asistenciaData.length} registros de asistencia`);
        
        // 3. Crear historial académico
        console.log('\n3️⃣ Creando historial académico...');
        const historialData = {
            id_estudiante: estudiante.id,
            año_academico: '2025',
            curso: '4° Medio A',
            promedio: 6.0,
            observaciones: 'Rendimiento académico satisfactorio',
            responsable_id: 3,
            fecha_registro: new Date(),
            promedio_general: 6.0,
            asistencia: 85.0,
            observaciones_academicas: 'Estudiante con buen rendimiento general, necesita refuerzo en ciencias naturales',
            fecha_actualizacion: new Date()
        };
        
        await pool.raw.query(`
            INSERT INTO historial_academico 
            (id_estudiante, año_academico, curso, promedio, observaciones, responsable_id, 
             fecha_registro, promedio_general, asistencia, observaciones_academicas, fecha_actualizacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
            historialData.id_estudiante, historialData.año_academico, historialData.curso,
            historialData.promedio, historialData.observaciones, historialData.responsable_id,
            historialData.fecha_registro, historialData.promedio_general, historialData.asistencia,
            historialData.observaciones_academicas, historialData.fecha_actualizacion
        ]);
        console.log('   ✅ Creado 1 registro de historial académico');
        
        // 4. Verificar datos creados
        console.log('\n4️⃣ Verificando datos creados...');
        
        const seguimientoCount = await pool.raw.query('SELECT COUNT(*) FROM seguimiento_academico WHERE id_estudiante = $1', [estudiante.id]);
        const asistenciaCount = await pool.raw.query('SELECT COUNT(*) FROM asistencia WHERE id_estudiante = $1', [estudiante.id]);
        const historialCount = await pool.raw.query('SELECT COUNT(*) FROM historial_academico WHERE id_estudiante = $1', [estudiante.id]);
        
        console.log(`   📊 Seguimiento académico: ${seguimientoCount.rows[0].count} registros`);
        console.log(`   📊 Asistencia: ${asistenciaCount.rows[0].count} registros`);
        console.log(`   📊 Historial académico: ${historialCount.rows[0].count} registros`);
        
        console.log('\n✅ Datos de prueba creados exitosamente!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

createAcademicTestData();
