/**
 * Configuración de rutas del sidebar
 * Centraliza la definición de menús y permisos
 */

export const sidebarRoutes = {
  main: {
    label: 'Principal',
    icon: '🏠',
    routes: [
      { to: '/dashboard', icon: 'HomeIcon', label: 'Inicio', badge: null },
      { to: '/estudiantes', icon: 'UsersIcon', label: 'Estudiantes', badge: null },
      { to: '/agenda', icon: 'CalendarCheckIcon', label: 'Agenda', badge: null },
      { to: '/reportes', icon: 'BarChart3Icon', label: 'Reportes', badge: null },
    ]
  },
  evaluations: {
    label: 'Evaluaciones',
    icon: '📝',
    routes: [
      { to: '/evaluaciones', icon: 'FileTextIcon', label: 'Test Vocacionales', badge: null },
      { to: '/seguimiento-psicosocial', icon: 'UserCogIcon', label: 'Seguimiento Psicosocial', badge: null },
    ]
  },
  resources: {
    label: 'Recursos',
    icon: '📦',
    routes: [
      { to: '/recursos', icon: 'PackageIcon', label: 'Recursos', badge: null },
      { to: '/movimientos', icon: 'ArrowRightLeftIcon', label: 'Movimientos', badge: null },
    ]
  },
  notifications: {
    label: 'Notificaciones',
    icon: '🔔',
    routes: [
      { to: '/alertas', icon: 'BellIcon', label: 'Alertas', badge: 'alertas' },
      { to: '/notificaciones', icon: 'BellIcon', label: 'Notificaciones', badge: 'notificaciones' },
    ]
  },
  admin: {
    label: 'Administración',
    icon: '⚙️',
    roles: ['Admin'],
    routes: [
      { to: '/usuarios', icon: 'UsersIcon', label: 'Usuarios', badge: null },
      { to: '/configuracion', icon: 'SettingsIcon', label: 'Configuración', badge: null },
      { to: '/logs', icon: 'FileTextIcon', label: 'Logs', badge: null },
    ]
  }
};

export const getSidebarRoutes = (userRole, notifications = {}) => {
  const routes = {};
  
  Object.entries(sidebarRoutes).forEach(([key, config]) => {
    // Verificar permisos de rol
    if (config.roles && !config.roles.includes(userRole)) {
      return;
    }
    
    // Agregar badges de notificaciones
    const routesWithBadges = config.routes.map(route => ({
      ...route,
      badge: route.badge === 'alertas' ? (notifications.alertas > 0 ? notifications.alertas.toString() : null) :
             route.badge === 'notificaciones' ? (notifications.notificaciones > 0 ? notifications.notificaciones.toString() : null) :
             route.badge
    }));
    
    routes[key] = {
      ...config,
      routes: routesWithBadges
    };
  });
  
  return routes;
};

export default sidebarRoutes;
