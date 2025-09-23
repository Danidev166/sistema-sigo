import { useState, useEffect } from 'react';
import api from '../services/axios';

/**
 * Hook para manejar notificaciones en tiempo real
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState({
    alertas: 0,
    notificaciones: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const [alertasRes, notificacionesRes] = await Promise.all([
        api.get('/alertas').catch(() => ({ data: [] })),
        api.get('/notificaciones').catch(() => ({ data: [] }))
      ]);

      // Manejar diferentes estructuras de respuesta
      const alertasData = Array.isArray(alertasRes.data) ? alertasRes.data : [];
      const notificacionesData = Array.isArray(notificacionesRes.data) ? notificacionesRes.data : [];

      const alertas = alertasData.filter(a => a.estado === 'Nueva' || a.estado === 'nueva').length;
      const notificaciones = notificacionesData.filter(n => !n.leida || n.leida === false).length;

      setNotifications({
        alertas,
        notificaciones,
        total: alertas + notificaciones
      });
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      // En caso de error, mantener valores por defecto
      setNotifications({
        alertas: 0,
        notificaciones: 0,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications
  };
};

export default useNotifications;
