const { sql } = require('../config/db');

class QueryOptimizer {
  constructor() {
    this.queryCache = new Map();
    this.slowQueryThreshold = 1000; // 1 segundo
  }

  // Ejecutar consulta con optimizaciones
  async executeQuery(query, params = {}, options = {}) {
    const startTime = Date.now();
    
    try {
      // Validar parámetros
      this.validateParams(params);
      
      // Construir consulta optimizada
      const optimizedQuery = this.optimizeQuery(query, params);
      
      // Ejecutar consulta
      const result = await sql.query(optimizedQuery);
      
      const executionTime = Date.now() - startTime;
      
      // Log de consultas lentas
      if (executionTime > this.slowQueryThreshold) {
        console.warn(`🐌 Consulta lenta detectada: ${executionTime}ms`);
        console.warn(`Query: ${query.substring(0, 100)}...`);
      }
      
      return {
        recordsets: result.recordsets,
        recordset: result.recordset,
        rowsAffected: result.rowsAffected,
        executionTime
      };
      
    } catch (error) {
      console.error('❌ Error en consulta SQL:', error.message);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  // Optimizar consulta SQL
  optimizeQuery(query, params) {
    let optimizedQuery = query;
    
    // Agregar hints de optimización
    if (query.toLowerCase().includes('select')) {
      // Agregar NOLOCK para lecturas (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        optimizedQuery = optimizedQuery.replace(
          /FROM\s+(\w+)/gi, 
          'FROM $1 WITH (NOLOCK)'
        );
      }
      
      // Agregar TOP si no existe y es una consulta de lista
      if (!query.toLowerCase().includes('top') && 
          !query.toLowerCase().includes('count') &&
          !query.toLowerCase().includes('group by')) {
        optimizedQuery = optimizedQuery.replace(
          /SELECT\s+/i, 
          'SELECT TOP 1000 '
        );
      }
    }
    
    return optimizedQuery;
  }

  // Validar parámetros de entrada
  validateParams(params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        throw new Error(`Parámetro requerido faltante: ${key}`);
      }
      
      // Validar tipos básicos
      if (typeof value === 'string' && value.length > 1000) {
        throw new Error(`Parámetro ${key} excede longitud máxima`);
      }
    }
  }

  // Ejecutar consulta con paginación optimizada
  async executePaginatedQuery(query, params = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const paginatedQuery = `
      ${query}
      ORDER BY (SELECT NULL)
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;
    
    return this.executeQuery(paginatedQuery, params);
  }

  // Ejecutar consulta con conteo total
  async executeWithCount(query, params = {}) {
    const countQuery = query.replace(
      /SELECT.*?FROM/i,
      'SELECT COUNT(*) as total FROM'
    );
    
    const [dataResult, countResult] = await Promise.all([
      this.executeQuery(query, params),
      this.executeQuery(countQuery, params)
    ]);
    
    return {
      data: dataResult.recordset,
      total: countResult.recordset[0]?.total || 0,
      executionTime: Math.max(dataResult.executionTime, countResult.executionTime)
    };
  }

  // Limpiar cache de consultas
  clearCache() {
    this.queryCache.clear();
  }
}

module.exports = new QueryOptimizer();
