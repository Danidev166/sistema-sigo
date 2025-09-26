// Script para probar la sincronización entre Agenda y Asistencia
const axios = require('axios');

const API_BASE = 'https://sistema-sigo.onrender.com/api';

async function testAgendaAsistenciaSync() {
  console.log('🧪 Probando sincronización Agenda ↔ Asistencia\n');

  try {
    // 1. Login
    console.log('1️⃣ Iniciando sesión...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    console.log('✅ Login exitoso\n');

    // 2. Obtener estudiantes
    console.log('2️⃣ Obteniendo estudiantes...');
    const estudiantesResponse = await axios.get(`${API_BASE}/estudiantes`, { headers });
    const estudiantes = estudiantesResponse.data;
    
    if (estudiantes.length === 0) {
      console.log('❌ No hay estudiantes disponibles');
      return;
    }
    
    const estudiante = estudiantes[0];
    console.log(`✅ Estudiante seleccionado: ${estudiante.nombre} ${estudiante.apellido}\n`);

    // 3. Crear agenda
    console.log('3️⃣ Creando agenda...');
    const agendaData = {
      id_estudiante: estudiante.id,
      fecha: '2025-01-15',
      hora: '10:00',
      motivo: 'Test de sincronización',
      profesional: 'Orientador Test',
      email_orientador: 'test@test.com'
    };
    
    const agendaResponse = await axios.post(`${API_BASE}/agenda`, agendaData, { headers });
    console.log('✅ Agenda creada:', agendaResponse.data.message);
    const agendaId = agendaResponse.data.agenda.id;
    console.log(`   ID Agenda: ${agendaId}\n`);

    // 4. Verificar que se creó asistencia automáticamente
    console.log('4️⃣ Verificando asistencia automática...');
    const asistenciaResponse = await axios.get(`${API_BASE}/asistencia`, { headers });
    const asistencias = asistenciaResponse.data;
    
    const asistenciaCreada = asistencias.find(a => 
      a.id_estudiante === estudiante.id && 
      a.fecha === agendaData.fecha &&
      a.justificacion.includes('Cita agendada')
    );
    
    if (asistenciaCreada) {
      console.log('✅ Asistencia creada automáticamente:');
      console.log(`   ID: ${asistenciaCreada.id}`);
      console.log(`   Tipo: ${asistenciaCreada.tipo}`);
      console.log(`   Justificación: ${asistenciaCreada.justificacion}\n`);
    } else {
      console.log('❌ No se encontró asistencia automática\n');
    }

    // 5. Registrar entrevista desde agenda
    console.log('5️⃣ Registrando entrevista desde agenda...');
    const entrevistaData = {
      observaciones: 'Estudiante mostró buena disposición',
      conclusiones: 'Se acordó seguimiento mensual',
      acciones_acordadas: 'Programar próxima cita en 30 días'
    };
    
    const entrevistaResponse = await axios.post(
      `${API_BASE}/entrevistas/registrar-desde-agenda/${agendaId}`,
      entrevistaData,
      { headers }
    );
    console.log('✅ Entrevista registrada:', entrevistaResponse.data.message);
    console.log(`   ID Entrevista: ${entrevistaResponse.data.entrevista.id}\n`);

    // 6. Verificar que se actualizó la asistencia
    console.log('6️⃣ Verificando actualización de asistencia...');
    const asistenciaActualizadaResponse = await axios.get(`${API_BASE}/asistencia`, { headers });
    const asistenciasActualizadas = asistenciaActualizadaResponse.data;
    
    const asistenciaActualizada = asistenciasActualizadas.find(a => 
      a.id_estudiante === estudiante.id && 
      a.fecha === agendaData.fecha &&
      a.tipo === 'Presente'
    );
    
    if (asistenciaActualizada) {
      console.log('✅ Asistencia actualizada correctamente:');
      console.log(`   ID: ${asistenciaActualizada.id}`);
      console.log(`   Tipo: ${asistenciaActualizada.tipo}`);
      console.log(`   Justificación: ${asistenciaActualizada.justificacion}\n`);
    } else {
      console.log('❌ No se encontró asistencia actualizada\n');
    }

    // 7. Verificar entrevistas del estudiante
    console.log('7️⃣ Verificando entrevistas del estudiante...');
    const entrevistasResponse = await axios.get(`${API_BASE}/entrevistas/estudiante/${estudiante.id}`, { headers });
    const entrevistas = entrevistasResponse.data;
    
    const entrevistaRealizada = entrevistas.find(e => 
      e.id_estudiante === estudiante.id && 
      e.estado === 'realizada'
    );
    
    if (entrevistaRealizada) {
      console.log('✅ Entrevista encontrada en historial:');
      console.log(`   ID: ${entrevistaRealizada.id}`);
      console.log(`   Estado: ${entrevistaRealizada.estado}`);
      console.log(`   Motivo: ${entrevistaRealizada.motivo}`);
      console.log(`   Observaciones: ${entrevistaRealizada.observaciones}\n`);
    } else {
      console.log('❌ No se encontró entrevista realizada\n');
    }

    console.log('🎉 Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.response?.data || error.message);
  }
}

// Ejecutar prueba
testAgendaAsistenciaSync();
