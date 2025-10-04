import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import estudianteService from '../features/estudiantes/services/estudianteService';

const useOptimizedData = (idEstudiante, anio) => {
  const [data, setData] = useState({
    historial: [],
    seguimiento: [],
    asistencias: [],
    estadisticasSeguimiento: null,
    estadisticasAsistencia: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache para evitar consultas duplicadas
  const [cache, setCache] = useState(new Map());

  // Función para generar clave de cache
  const getCacheKey = useCallback((endpoint, params = {}) => {
    return `${endpoint}_${JSON.stringify(params)}`;
  }, []);

  // Función para verificar si los datos están frescos (menos de 5 minutos)
  const isDataFresh = useCallback((timestamp) => {
    if (!timestamp) return false;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - timestamp) < fiveMinutes;
  }, []);

  // Función optimizada para fetch de datos
  const fetchData = useCallback(async (forceRefresh = false) => {
    const cacheKey = getCacheKey('academic_data', { idEstudiante, anio });
    
    // Verificar cache si no es refresh forzado
    if (!forceRefresh && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (isDataFresh(cachedData.timestamp)) {
        setData(cachedData.data);
        setLoading(false);
        return cachedData.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const [h, s, a, statsSeguimiento, statsAsistencia] = await Promise.all([
        estudianteService.getHistorialAcademico(idEstudiante, anio).catch(() => ({ data: [] })),
        estudianteService.getSeguimientoAcademico(idEstudiante, anio).catch(() => ({ data: [] })),
        estudianteService.getAsistencia(idEstudiante).catch(() => ({ data: [] })),
        estudianteService.getEstadisticasSeguimiento(idEstudiante, anio).catch(() => ({ data: null })),
        estudianteService.getEstadisticasAsistencia(idEstudiante, anio).catch(() => ({ data: null }))
      ]);

      const newData = {
        historial: h.data || [],
        seguimiento: s.data || [],
        asistencias: a.data || [],
        estadisticasSeguimiento: statsSeguimiento.data,
        estadisticasAsistencia: statsAsistencia.data
      };

      // Actualizar cache
      setCache(prev => new Map(prev.set(cacheKey, {
        data: newData,
        timestamp: Date.now()
      })));

      setData(newData);
      setLastFetch(Date.now());
      
      return newData;
    } catch (err) {
      console.error('Error al cargar datos académicos:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [idEstudiante, anio, getCacheKey, isDataFresh]);

  // Debounced refresh para evitar múltiples llamadas
  const debouncedRefresh = useMemo(
    () => debounce(() => fetchData(true), 300),
    [fetchData]
  );

  // Función para invalidar cache
  const invalidateCache = useCallback(() => {
    setCache(new Map());
  }, []);

  // Función para actualizar datos específicos
  const updateData = useCallback((type, newData) => {
    setData(prev => ({
      ...prev,
      [type]: newData
    }));
    
    // Invalidar cache para forzar refresh en próxima consulta
    invalidateCache();
  }, [invalidateCache]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (idEstudiante) {
      fetchData();
    }
  }, [idEstudiante, anio, fetchData]);

  // Memoizar estadísticas calculadas
  const calculatedStats = useMemo(() => {
    const { seguimiento, asistencias } = data;
    
    // Calcular estadísticas de seguimiento
    const seguimientoStats = seguimiento.length > 0 ? {
      promedio: seguimiento.reduce((sum, item) => sum + parseFloat(item.nota), 0) / seguimiento.length,
      asignaturasUnicas: [...new Set(seguimiento.map(item => item.asignatura))].length,
      totalRegistros: seguimiento.length,
      tendencia: calcularTendencia(seguimiento.map(item => parseFloat(item.nota)))
    } : null;

    // Calcular estadísticas de asistencia
    const asistenciaStats = asistencias.length > 0 ? {
      totalRegistros: asistencias.length,
      presentes: asistencias.filter(a => a.tipo === 'Presente').length,
      ausentes: asistencias.filter(a => a.tipo === 'Ausente').length,
      justificadas: asistencias.filter(a => a.tipo === 'Justificada').length,
      pendientes: asistencias.filter(a => a.tipo === 'Pendiente').length,
      porcentajeAsistencia: ((asistencias.filter(a => a.tipo === 'Presente' || a.tipo === 'Justificada').length / asistencias.length) * 100).toFixed(1),
      tendencia: calcularTendenciaAsistencia(asistencias)
    } : null;

    return {
      seguimiento: seguimientoStats,
      asistencia: asistenciaStats
    };
  }, [data.seguimiento, data.asistencias]);

  // Función para calcular tendencia de notas
  const calcularTendencia = (notas) => {
    if (notas.length < 2) return 'estable';
    
    const mitad = Math.floor(notas.length / 2);
    const primeraMitad = notas.slice(0, mitad);
    const segundaMitad = notas.slice(-mitad);
    
    const promedioPrimera = primeraMitad.reduce((sum, nota) => sum + nota, 0) / primeraMitad.length;
    const promedioSegunda = segundaMitad.reduce((sum, nota) => sum + nota, 0) / segundaMitad.length;
    
    const diferencia = promedioSegunda - promedioPrimera;
    
    if (diferencia > 0.5) return 'mejorando';
    if (diferencia < -0.5) return 'empeorando';
    return 'estable';
  };

  // Función para calcular tendencia de asistencia
  const calcularTendenciaAsistencia = (asistencias) => {
    if (asistencias.length < 2) return 'estable';
    
    const mitad = Math.floor(asistencias.length / 2);
    const primeraMitad = asistencias.slice(0, mitad);
    const segundaMitad = asistencias.slice(-mitad);
    
    const porcentajePrimera = (primeraMitad.filter(a => a.tipo === 'Presente' || a.tipo === 'Justificada').length / primeraMitad.length) * 100;
    const porcentajeSegunda = (segundaMitad.filter(a => a.tipo === 'Presente' || a.tipo === 'Justificada').length / segundaMitad.length) * 100;
    
    const diferencia = porcentajeSegunda - porcentajePrimera;
    
    if (diferencia > 5) return 'mejorando';
    if (diferencia < -5) return 'empeorando';
    return 'estable';
  };

  return {
    data,
    loading,
    error,
    lastFetch,
    fetchData,
    refresh: debouncedRefresh,
    updateData,
    invalidateCache,
    calculatedStats
  };
};

export default useOptimizedData;
