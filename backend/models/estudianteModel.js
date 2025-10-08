// backend/models/estudianteModel.js
const { sql, getPool } = require('../config/db');

// Fecha "YYYY-MM-DD" -> Date (evita desfases por zona horaria)
function toSqlDate(input) {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const [y, m, d] = input.split('-').map(Number);
    return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  }
  return new Date(input);
}

const EstudianteModel = {
  async crear(estudiante) {
    const pool = await getPool();
    const r = await pool.request()
      .input('nombre',             sql.NVarChar, estudiante.nombre)
      .input('apellido',           sql.NVarChar, estudiante.apellido)
      .input('rut',                sql.NVarChar, estudiante.rut)
      .input('email',              sql.NVarChar, estudiante.email)
      .input('telefono',           sql.NVarChar, estudiante.telefono)
      .input('direccion',          sql.NVarChar, estudiante.direccion)
      .input('fecha_nacimiento',   sql.DateTime, toSqlDate(estudiante.fechaNacimiento))
      .input('curso',              sql.NVarChar, estudiante.curso)
      .input('especialidad',       sql.NVarChar, estudiante.especialidad)
      .input('situacion_economica',sql.NVarChar, estudiante.situacion_economica)
      .input('nombreApoderado',    sql.NVarChar, estudiante.nombreApoderado || '')
      .input('telefonoApoderado',  sql.NVarChar, estudiante.telefonoApoderado || '')
      .input('emailApoderado',     sql.NVarChar, estudiante.emailApoderado || '')
      .input('fecha_registro',     sql.DateTime, new Date())
      .input('estado',             sql.VarChar,  estudiante.estado || 'Activo')
      .query(`
        INSERT INTO estudiantes (
          nombre, apellido, rut, email, telefono, direccion,
          fecha_nacimiento, curso, especialidad, situacion_economica,
          nombre_apoderado, telefono_apoderado, email_apoderado,
          fecha_registro, estado
        )
        VALUES (
          @nombre, @apellido, @rut, @email, @telefono, @direccion,
          @fecha_nacimiento, @curso, @especialidad, @situacion_economica,
          @nombreApoderado, @telefonoApoderado, @emailApoderado,
          @fecha_registro, @estado
        )
        RETURNING *
      `);
    return r.recordset[0];
  },

  async crearMasivo(estudiantes) {
    const pool = await getPool();
    const results = await Promise.allSettled(
      estudiantes.map(async (est) => {
        try {
          await pool.request()
            .input('nombre',             sql.NVarChar, est.nombre)
            .input('apellido',           sql.NVarChar, est.apellido)
            .input('rut',                sql.NVarChar, est.rut)
            .input('email',              sql.NVarChar, est.email)
            .input('telefono',           sql.NVarChar, est.telefono)
            .input('direccion',          sql.NVarChar, est.direccion)
            .input('fecha_nacimiento',   sql.DateTime, toSqlDate(est.fechaNacimiento))
            .input('curso',              sql.NVarChar, est.curso)
            .input('especialidad',       sql.NVarChar, est.especialidad)
            .input('situacion_economica',sql.NVarChar, est.situacion_economica)
            .input('nombreApoderado',    sql.NVarChar, est.nombreApoderado || '')
            .input('telefonoApoderado',  sql.NVarChar, est.telefonoApoderado || '')
            .input('emailApoderado',     sql.NVarChar, est.emailApoderado || '')
            .input('fecha_registro',     sql.DateTime, new Date())
            .input('estado',             sql.VarChar,  est.estado || 'Activo')
            .query(`
              INSERT INTO estudiantes (
                nombre, apellido, rut, email, telefono, direccion,
                fecha_nacimiento, curso, especialidad, situacion_economica,
                nombre_apoderado, telefono_apoderado, email_apoderado,
                fecha_registro, estado
              )
              VALUES (
                @nombre, @apellido, @rut, @email, @telefono, @direccion,
                @fecha_nacimiento, @curso, @especialidad, @situacion_economica,
                @nombreApoderado, @telefonoApoderado, @emailApoderado,
                @fecha_registro, @estado
              )
            `);
          return { status: 'fulfilled', rut: est.rut };
        } catch (err) {
          return { status: 'rejected', rut: est.rut, error: err.message };
        }
      })
    );
    return results;
  },

  async listar() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT * FROM estudiantes
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async listarPaginado({ page = 1, limit = 10, search = '' }) {
    const pool = await getPool();
    const offset = (page - 1) * limit;
    
    // Construir condición de búsqueda
    let whereClause = '';
    let searchParams = {};
    
    if (search && search.trim()) {
      whereClause = `WHERE (
        nombre ILIKE @search OR 
        apellido ILIKE @search OR 
        rut ILIKE @search OR 
        email ILIKE @search OR
        curso ILIKE @search
      )`;
      searchParams.search = `%${search.trim()}%`;
    }
    
    // Obtener total de registros
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM estudiantes 
      ${whereClause}
    `;
    
    const countRequest = pool.request();
    if (searchParams.search) {
      countRequest.input('search', sql.NVarChar, searchParams.search);
    }
    const countResult = await countRequest.query(countQuery);
    const total = parseInt(countResult.recordset[0].total);
    
    // Obtener registros paginados
    const dataQuery = `
      SELECT * FROM estudiantes
      ${whereClause}
      ORDER BY id DESC
      LIMIT @limit OFFSET @offset
    `;
    
    const dataRequest = pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);
    
    if (searchParams.search) {
      dataRequest.input('search', sql.NVarChar, searchParams.search);
    }
    
    const dataResult = await dataRequest.query(dataQuery);
    
    return {
      data: dataResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  },

  async obtenerPorId(id) {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM estudiantes WHERE id = @id');
    return r.recordset[0] || null;
  },

  async actualizar(id, datos) {
    const pool = await getPool();
    await pool.request()
      .input('id',                  sql.Int,     id)
      .input('nombre',              sql.NVarChar,datos.nombre)
      .input('apellido',            sql.NVarChar,datos.apellido)
      .input('rut',                 sql.NVarChar,datos.rut)
      .input('email',               sql.NVarChar,datos.email)
      .input('telefono',            sql.NVarChar,datos.telefono)
      .input('direccion',           sql.NVarChar,datos.direccion)
      .input('fecha_nacimiento',    sql.DateTime,toSqlDate(datos.fechaNacimiento))
      .input('curso',               sql.NVarChar,datos.curso)
      .input('especialidad',        sql.NVarChar,datos.especialidad)
      .input('situacion_economica', sql.NVarChar,datos.situacion_economica)
      .input('nombreApoderado',     sql.NVarChar,datos.nombreApoderado || '')
      .input('telefonoApoderado',   sql.NVarChar,datos.telefonoApoderado || '')
      .input('emailApoderado',      sql.NVarChar,datos.emailApoderado || '')
      .input('estado',              sql.VarChar, datos.estado)
      .query(`
        UPDATE estudiantes
           SET nombre = @nombre,
               apellido = @apellido,
               rut = @rut,
               email = @email,
               telefono = @telefono,
               direccion = @direccion,
               fecha_nacimiento = @fecha_nacimiento,
               curso = @curso,
               especialidad = @especialidad,
               situacion_economica = @situacion_economica,
               nombre_apoderado = @nombreApoderado,
               telefono_apoderado = @telefonoApoderado,
               email_apoderado = @emailApoderado,
               estado = @estado
         WHERE id = @id
      `);
  },

  async eliminar(id) {
    const pool = await getPool();
    
    try {
      console.log(`🗑️ INICIANDO ELIMINACIÓN EN CASCADA - ID: ${id}`);
      
      // Lista de tablas a limpiar (en orden de dependencias)
      const tablasParaLimpiar = [
        { nombre: 'agenda', query: 'DELETE FROM agenda WHERE id_estudiante = @id' },
        { nombre: 'asistencia', query: 'DELETE FROM asistencia WHERE id_estudiante = @id' },
        { nombre: 'entrevistas', query: 'DELETE FROM entrevistas WHERE id_estudiante = @id' },
        { nombre: 'evaluaciones_vocacionales', query: 'DELETE FROM evaluaciones_vocacionales WHERE id_estudiante = @id' },
        { nombre: 'seguimiento_academico', query: 'DELETE FROM seguimiento_academico WHERE id_estudiante = @id' },
        { nombre: 'seguimiento', query: 'DELETE FROM seguimiento WHERE id_estudiante = @id' },
        { nombre: 'seguimiento_cronologico', query: 'DELETE FROM seguimiento_cronologico WHERE id_estudiante = @id' },
        { nombre: 'historial_academico', query: 'DELETE FROM historial_academico WHERE id_estudiante = @id' },
        { nombre: 'conducta', query: 'DELETE FROM conducta WHERE id_estudiante = @id' },
        { nombre: 'movimiento_recursos', query: 'DELETE FROM movimiento_recursos WHERE id_estudiante = @id' },
        { nombre: 'alertas', query: 'DELETE FROM alertas WHERE id_estudiante = @id' },
        { nombre: 'notificaciones', query: 'DELETE FROM notificaciones WHERE id_estudiante = @id' },
        { nombre: 'seguimiento_psicosocial', query: 'DELETE FROM seguimiento_psicosocial WHERE id_estudiante = @id' },
        { nombre: 'entrega_recursos', query: 'DELETE FROM entrega_recursos WHERE id_estudiante = @id' },
        { nombre: 'intervenciones', query: 'DELETE FROM intervenciones WHERE id_estudiante = @id' },
        { nombre: 'comunicacion_familia', query: 'DELETE FROM comunicacion_familia WHERE id_estudiante = @id' }
      ];
      
      let eliminacionesExitosas = 0;
      let eliminacionesFallidas = 0;
      
      // Eliminar registros relacionados (sin transacción para evitar abortos)
      for (const tabla of tablasParaLimpiar) {
        try {
          console.log(`🔍 Eliminando registros de ${tabla.nombre}...`);
          const result = await pool.request()
            .input('id', sql.Int, id)
            .query(tabla.query);
          
          console.log(`✅ ${tabla.nombre}: ${result.rowsAffected[0]} registros eliminados`);
          eliminacionesExitosas++;
        } catch (error) {
          if (error.code === '42501') {
            console.log(`⚠️ ADVERTENCIA: Sin permisos para eliminar ${tabla.nombre}, continuando...`);
            eliminacionesFallidas++;
          } else {
            console.log(`❌ ERROR en ${tabla.nombre}:`, error.message);
            eliminacionesFallidas++;
          }
        }
      }
      
      // Finalmente, eliminar el estudiante
      console.log(`🔍 Eliminando estudiante...`);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM estudiantes WHERE id = @id');
      
      console.log(`📊 Resultado eliminación:`, {
        rowsAffected: result.rowsAffected[0],
        id: id,
        eliminacionesExitosas,
        eliminacionesFallidas
      });
      
      if (result.rowsAffected[0] > 0) {
        console.log(`✅ ÉXITO: Estudiante ${id} eliminado`);
        console.log(`📈 Resumen: ${eliminacionesExitosas} tablas limpiadas exitosamente, ${eliminacionesFallidas} con problemas de permisos`);
        return true;
      } else {
        console.log(`⚠️ ADVERTENCIA: No se encontró estudiante ${id}`);
        return false;
      }
      
    } catch (error) {
      console.error('❌ ERROR CRÍTICO:', error);
      console.error('❌ Detalles completos:', {
        message: error.message,
        code: error.code,
        number: error.number,
        state: error.state,
        severity: error.severity,
        lineNumber: error.lineNumber,
        serverName: error.serverName,
        procName: error.procName
      });
      
      throw error;
    }
  },

  async listarActivos() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT * FROM estudiantes
      WHERE LOWER(TRIM(estado)) = 'activo'
      ORDER BY id DESC
    `);
    return r.recordset;
  },

  async contar() {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT COUNT(*)::int AS total FROM estudiantes
    `);
    return r.recordset[0]?.total || 0;
  }
  
};



module.exports = EstudianteModel;
