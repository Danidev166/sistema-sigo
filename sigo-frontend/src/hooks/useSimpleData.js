import { useState, useEffect, useCallback } from 'react';
import estudianteService from '../features/estudiantes/services/estudianteService';

const useSimpleData = (idEstudiante, anio) => {
  const [data, setData] = useState({
    historial: [],
    seguimiento: [],
    asistencias: [],
    estadisticasSeguimiento: null,
    estadisticasAsistencia: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función simple para cargar datos
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!idEstudiante) return;

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

      setData(newData);
      return newData;
    } catch (err) {
      console.error('Error al cargar datos académicos:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [idEstudiante, anio]);

  // Función simple para refresh
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Función simple para actualizar datos
  const updateData = useCallback((type, newData) => {
    setData(prev => ({
      ...prev,
      [type]: newData
    }));
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (idEstudiante) {
      fetchData();
    }
  }, [idEstudiante, anio, fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    refresh,
    updateData
  };
};

export default useSimpleData;
