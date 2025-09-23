// backend/scripts/crear-datos-dashboard.js
const { getPool } = require("../config/db");
const path = require('path');

// Cargar variables de entorno para producción
require('dotenv').config({ path: path.resolve(__dirname, '../.env.production') });

async function crearDatosDashboard() {
  console.log("🎯 Creando datos para el dashboard...");
  
  try {
    const pool = await getPool();
    
    // 1. Crear entrevistas de prueba para el gráfico de línea
    console.log("📊 Creando entrevistas de prueba...");
    
    // Obtener algunos estudiantes existentes
    const estudiantesResult = await pool.request().query("SELECT id FROM estudiantes LIMIT 5");
    const estudiantes = estudiantesResult.recordset;
    
    // Obtener un orientador existente
    const orientadoresResult = await pool.request().query("SELECT id FROM usuarios WHERE rol = 'Orientador' LIMIT 1");
    const orientador = orientadoresResult.recordset[0];
    
    if (!orientador) {
      console.log("❌ No hay orientadores en la base de datos. Creando uno...");
      await pool.request().query(`
        INSERT INTO usuarios (nombre, apellido, email, rol, estado)
        VALUES ('Orientador', 'Prueba', 'orientador@test.com', 'Orientador', 'activo')
      `);
      const nuevoOrientador = await pool.request().query("SELECT id FROM usuarios WHERE rol = 'Orientador' LIMIT 1");
      orientador.id = nuevoOrientador.recordset[0].id;
    }
    
    if (estudiantes.length === 0) {
      console.log("❌ No hay estudiantes en la base de datos. Ejecuta primero crear-datos-prueba.js");
      return;
    }
    
    // Crear entrevistas para los últimos 6 meses
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      meses.push({
        mes: fecha.getMonth() + 1,
        año: fecha.getFullYear(),
        fecha: fecha.toISOString().split('T')[0]
      });
    }
    
    for (const mes of meses) {
      const numEntrevistas = Math.floor(Math.random() * 8) + 2; // 2-10 entrevistas por mes
      
      for (let i = 0; i < numEntrevistas; i++) {
        const estudiante = estudiantes[Math.floor(Math.random() * estudiantes.length)];
        const fechaEntrevista = new Date(mes.año, mes.mes - 1, Math.floor(Math.random() * 28) + 1);
        
        const motivo = ['Académico', 'Disciplinario', 'Psicosocial', 'Orientación'][Math.floor(Math.random() * 4)];
        const observaciones = `Entrevista de prueba - ${fechaEntrevista.toLocaleDateString()}`;
        
        await pool.request().query(`
          INSERT INTO entrevistas (id_estudiante, id_orientador, fecha_entrevista, motivo, observaciones, estado)
          VALUES (${estudiante.id}, ${orientador.id}, '${fechaEntrevista.toISOString().split('T')[0]}', '${motivo}', '${observaciones}', 'Realizada')
        `);
      }
    }
    
    // 2. Crear evaluaciones de prueba para el gráfico de barras
    console.log("📈 Creando evaluaciones de prueba...");
    
    const especialidades = ['Administración', 'Contabilidad', 'Electricidad', 'Mecánica', 'Informática'];
    const tiposEvaluacion = ['Kuder', 'Holland', 'Aptitudes'];
    
    for (const especialidad of especialidades) {
      for (const tipo of tiposEvaluacion) {
        const cantidad = Math.floor(Math.random() * 15) + 5; // 5-20 evaluaciones por tipo
        
        for (let i = 0; i < cantidad; i++) {
          const estudiante = estudiantes[Math.floor(Math.random() * estudiantes.length)];
          const fechaEvaluacion = new Date();
          fechaEvaluacion.setDate(fechaEvaluacion.getDate() - Math.floor(Math.random() * 90)); // Últimos 3 meses
          
          const resultados = Math.floor(Math.random() * 100) + 1;
          const nombreCompleto = `Estudiante ${estudiante.id}`;
          
          await pool.request().query(`
            INSERT INTO evaluaciones_vocacionales (id_estudiante, tipo_evaluacion, resultados, fecha_evaluacion, nombre_completo, curso)
            VALUES (${estudiante.id}, '${tipo}', ${resultados}, '${fechaEvaluacion.toISOString().split('T')[0]}', '${nombreCompleto}', '${especialidad}')
          `);
        }
      }
    }
    
    // 3. Crear algunas alertas de prueba
    console.log("🚨 Creando alertas de prueba...");
    
    // Por ahora solo crear datos básicos sin alertas
    console.log("⚠️ Saltando alertas - estructura de tabla no disponible");
    
    console.log("✅ Datos del dashboard creados exitosamente");
    console.log("📊 Verificando datos...");
    
    // Verificar datos creados
    const entrevistasCount = await pool.request().query("SELECT COUNT(*) as total FROM entrevistas");
    const evaluacionesCount = await pool.request().query("SELECT COUNT(*) as total FROM evaluaciones_vocacionales");
    
    console.log(`📈 Entrevistas: ${entrevistasCount.recordset[0].total}`);
    console.log(`📊 Evaluaciones: ${evaluacionesCount.recordset[0].total}`);
    
  } catch (error) {
    console.error("❌ Error creando datos del dashboard:", error);
  }
}

crearDatosDashboard();
