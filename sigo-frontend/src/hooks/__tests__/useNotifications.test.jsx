import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import useNotifications from '../useNotifications';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadNotifications).toEqual([]);
  });

  it('should generate notifications for low performance', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [
      { nota: 3.5, asignatura: 'Matemáticas' },
      { nota: 3.0, asignatura: 'Lenguaje' }
    ];
    
    const estadisticasSeguimiento = {
      promedio_general: 3.25,
      total_notas: 2
    };

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('warning');
    expect(result.current.notifications[0].title).toContain('Rendimiento Bajo');
  });

  it('should generate notifications for excellent performance', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [
      { nota: 6.5, asignatura: 'Matemáticas' },
      { nota: 6.0, asignatura: 'Lenguaje' }
    ];
    
    const estadisticasSeguimiento = {
      promedio_general: 6.25,
      total_notas: 2
    };

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[0].title).toContain('Excelente Rendimiento');
  });

  it('should generate notifications for low attendance', () => {
    const { result } = renderHook(() => useNotifications());
    
    const asistenciaData = [
      { tipo: 'Presente', fecha: '2024-01-01' },
      { tipo: 'Ausente', fecha: '2024-01-02' },
      { tipo: 'Ausente', fecha: '2024-01-03' }
    ];
    
    const estadisticasAsistencia = {
      porcentaje_asistencia: 33.3,
      presentes: 1,
      ausentes: 2
    };

    act(() => {
      result.current.processData([], asistenciaData, null, estadisticasAsistencia);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('warning');
    expect(result.current.notifications[0].title).toContain('Asistencia Baja');
  });

  it('should generate notifications for missing data', () => {
    const { result } = renderHook(() => useNotifications());

    act(() => {
      result.current.processData([], [], null, null);
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].title).toContain('Sin Datos Académicos');
    expect(result.current.notifications[1].title).toContain('Sin Datos de Asistencia');
  });

  it('should not generate duplicate notifications', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [{ nota: 3.5, asignatura: 'Matemáticas' }];
    const estadisticasSeguimiento = { promedio_general: 3.5, total_notas: 1 };

    // Process data twice
    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    // Should only have one notification
    expect(result.current.notifications).toHaveLength(1);
  });

  it('should clear notifications', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [{ nota: 3.5, asignatura: 'Matemáticas' }];
    const estadisticasSeguimiento = { promedio_general: 3.5, total_notas: 1 };

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should mark notification as read', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [{ nota: 3.5, asignatura: 'Matemáticas' }];
    const estadisticasSeguimiento = { promedio_general: 3.5, total_notas: 1 };

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    const notificationId = result.current.notifications[0].id;

    act(() => {
      result.current.markAsRead(notificationId);
    });

    expect(result.current.notifications[0].read).toBe(true);
    expect(result.current.unreadNotifications).toHaveLength(0);
  });

  it('should filter notifications by priority', () => {
    const { result } = renderHook(() => useNotifications());
    
    const seguimientoData = [{ nota: 3.5, asignatura: 'Matemáticas' }];
    const estadisticasSeguimiento = { promedio_general: 3.5, total_notas: 1 };

    act(() => {
      result.current.processData(seguimientoData, [], estadisticasSeguimiento, null);
    });

    const highPriorityNotifications = result.current.getNotificationsByPriority('high');
    expect(highPriorityNotifications).toHaveLength(1);
    expect(highPriorityNotifications[0].priority).toBe('high');
  });
});
