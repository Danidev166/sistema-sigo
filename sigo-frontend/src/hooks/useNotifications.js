import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Generar notificaciones basadas en datos académicos
  const generateAcademicNotifications = useCallback((seguimientoData, asistenciaData, estadisticasSeguimiento, estadisticasAsistencia) => {
    const newNotifications = [];

    // Notificaciones de rendimiento académico
    if (estadisticasSeguimiento) {
      const promedio = estadisticasSeguimiento.promedio_general;
      
      if (promedio < 4.0) {
        newNotifications.push({
          id: 'low-performance',
          type: 'warning',
          title: '⚠️ Rendimiento Bajo',
          message: `El promedio general (${promedio}) está por debajo del mínimo esperado. Se recomienda revisar el plan de estudios.`,
          priority: 'high',
          timestamp: new Date()
        });
      } else if (promedio >= 6.0) {
        newNotifications.push({
          id: 'excellent-performance',
          type: 'success',
          title: '🎉 Excelente Rendimiento',
          message: `¡Felicitaciones! El promedio general (${promedio}) es excelente.`,
          priority: 'low',
          timestamp: new Date()
        });
      }

      // Notificación de tendencia
      if (estadisticasSeguimiento.tendencia === 'empeorando') {
        newNotifications.push({
          id: 'declining-trend',
          type: 'warning',
          title: '📉 Tendencia Descendente',
          message: 'El rendimiento académico muestra una tendencia descendente. Se recomienda intervención temprana.',
          priority: 'high',
          timestamp: new Date()
        });
      } else if (estadisticasSeguimiento.tendencia === 'mejorando') {
        newNotifications.push({
          id: 'improving-trend',
          type: 'info',
          title: '📈 Tendencia Ascendente',
          message: '¡Excelente! El rendimiento académico muestra una tendencia positiva.',
          priority: 'low',
          timestamp: new Date()
        });
      }
    }

    // Notificaciones de asistencia
    if (estadisticasAsistencia) {
      const porcentajeAsistencia = estadisticasAsistencia.porcentaje_asistencia;
      
      if (porcentajeAsistencia < 80) {
        newNotifications.push({
          id: 'low-attendance',
          type: 'warning',
          title: '⚠️ Asistencia Baja',
          message: `El porcentaje de asistencia (${porcentajeAsistencia}%) está por debajo del 80% recomendado.`,
          priority: 'high',
          timestamp: new Date()
        });
      } else if (porcentajeAsistencia >= 95) {
        newNotifications.push({
          id: 'excellent-attendance',
          type: 'success',
          title: '🎯 Asistencia Excelente',
          message: `¡Excelente asistencia! ${porcentajeAsistencia}% de asistencia registrada.`,
          priority: 'low',
          timestamp: new Date()
        });
      }

      // Notificación de tendencia de asistencia
      if (estadisticasAsistencia.tendencia === 'empeorando') {
        newNotifications.push({
          id: 'declining-attendance',
          type: 'warning',
          title: '📉 Asistencia en Declive',
          message: 'La asistencia muestra una tendencia descendente. Se recomienda revisar las causas.',
          priority: 'high',
          timestamp: new Date()
        });
      }
    }

    // Notificaciones de datos faltantes
    if (seguimientoData.length === 0) {
      newNotifications.push({
        id: 'no-academic-data',
        type: 'info',
        title: '📝 Sin Datos Académicos',
        message: 'No hay registros de seguimiento académico. Se recomienda agregar evaluaciones.',
        priority: 'medium',
        timestamp: new Date()
      });
    }

    if (asistenciaData.length === 0) {
      newNotifications.push({
        id: 'no-attendance-data',
        type: 'info',
        title: '📅 Sin Datos de Asistencia',
        message: 'No hay registros de asistencia. Se recomienda registrar la asistencia diaria.',
        priority: 'medium',
        timestamp: new Date()
      });
    }

    // Notificaciones de fechas recientes
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSeguimiento = seguimientoData.filter(item => 
      new Date(item.fecha) >= lastWeek
    );

    if (recentSeguimiento.length === 0 && seguimientoData.length > 0) {
      newNotifications.push({
        id: 'no-recent-academic-data',
        type: 'info',
        title: '📚 Sin Evaluaciones Recientes',
        message: 'No hay evaluaciones registradas en la última semana. Se recomienda actualizar el seguimiento.',
        priority: 'medium',
        timestamp: new Date()
      });
    }

    const recentAsistencia = asistenciaData.filter(item => 
      new Date(item.fecha) >= lastWeek
    );

    if (recentAsistencia.length === 0 && asistenciaData.length > 0) {
      newNotifications.push({
        id: 'no-recent-attendance',
        type: 'info',
        title: '📅 Sin Asistencia Reciente',
        message: 'No hay registros de asistencia en la última semana. Se recomienda actualizar la asistencia.',
        priority: 'medium',
        timestamp: new Date()
      });
    }

    return newNotifications;
  }, []);

  // Mostrar notificaciones como toasts
  const showNotifications = useCallback((notifications) => {
    notifications.forEach(notification => {
      const toastOptions = {
        duration: notification.priority === 'high' ? 8000 : 4000,
        position: 'top-right',
        style: {
          background: notification.type === 'success' ? '#10B981' : 
                     notification.type === 'warning' ? '#F59E0B' : 
                     notification.type === 'error' ? '#EF4444' : '#3B82F6',
          color: 'white',
          fontWeight: '500'
        }
      };

      switch (notification.type) {
        case 'success':
          toast.success(notification.message, toastOptions);
          break;
        case 'warning':
          toast.error(notification.message, toastOptions);
          break;
        case 'error':
          toast.error(notification.message, toastOptions);
          break;
        default:
          toast(notification.message, toastOptions);
      }
    });
  }, []);

  // Procesar datos y generar notificaciones
  const processData = useCallback((seguimientoData, asistenciaData, estadisticasSeguimiento, estadisticasAsistencia) => {
    const newNotifications = generateAcademicNotifications(
      seguimientoData, 
      asistenciaData, 
      estadisticasSeguimiento, 
      estadisticasAsistencia
    );

    setNotifications(prev => {
      // Filtrar notificaciones duplicadas
      const existingIds = prev.map(n => n.id);
      const uniqueNotifications = newNotifications.filter(n => !existingIds.includes(n.id));
      
      return [...prev, ...uniqueNotifications];
    });

    // Mostrar notificaciones nuevas
    showNotifications(newNotifications);
  }, [generateAcademicNotifications, showNotifications]);

  // Limpiar notificaciones
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Marcar notificación como leída
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  // Obtener notificaciones no leídas
  const unreadNotifications = notifications.filter(n => !n.read);

  // Obtener notificaciones por prioridad
  const getNotificationsByPriority = useCallback((priority) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  return {
    notifications,
    unreadNotifications,
    processData,
    clearNotifications,
    markAsRead,
    getNotificationsByPriority
  };
};

export default useNotifications;