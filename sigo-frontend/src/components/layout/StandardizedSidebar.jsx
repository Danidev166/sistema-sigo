import { memo, useState, useMemo, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CalendarCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  SettingsIcon,
  UserCogIcon,
  LogOutIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  BellIcon,
  ChevronDownIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import useNotifications from '../../hooks/useNotifications';
import SigoLogo from '../ui/SigoLogo';
import '../../styles/sidebar-scroll.css';

/**
 * Sidebar estandarizado con comportamiento consistente
 * Soluciona problemas de comportamiento extraño en diferentes vistas
 */
const StandardizedSidebar = memo(({ isAdmin, handleLogout, isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { notifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    main: true,
    evaluations: true,
    resources: true,
    notifications: true,
    admin: isAdmin,
  });

  // Agrupar elementos del menú
  const menuGroups = useMemo(() => ({
    main: [
      { to: '/dashboard', icon: HomeIcon, label: 'Inicio', badge: null },
      { to: '/estudiantes', icon: UsersIcon, label: 'Estudiantes', badge: null },
      { to: '/agenda', icon: CalendarCheckIcon, label: 'Agenda', badge: null },
      { to: '/reportes', icon: BarChart3Icon, label: 'Reportes', badge: null },
    ],
    evaluations: [
      { to: '/evaluaciones', icon: FileTextIcon, label: 'Test Vocacionales', badge: null },
      { to: '/seguimiento-psicosocial', icon: UserCogIcon, label: 'Seguimiento Psicosocial', badge: null },
    ],
    resources: [
      { to: '/recursos', icon: PackageIcon, label: 'Recursos', badge: null },
      { to: '/movimientos', icon: ArrowRightLeftIcon, label: 'Movimientos', badge: null },
    ],
    notifications: [
      { to: '/alertas', icon: BellIcon, label: 'Alertas', badge: notifications.alertas > 0 ? notifications.alertas.toString() : null },
      { to: '/notificaciones', icon: BellIcon, label: 'Notificaciones', badge: notifications.notificaciones > 0 ? notifications.notificaciones.toString() : null },
    ],
    admin: isAdmin ? [
      { to: '/usuarios', icon: UsersIcon, label: 'Usuarios', badge: null },
      { to: '/configuracion', icon: SettingsIcon, label: 'Configuración', badge: null },
      { to: '/logs', icon: FileTextIcon, label: 'Logs', badge: null },
    ] : [],
  }), [isAdmin, notifications]);

  // Filtrar elementos según búsqueda
  const filteredGroups = useMemo(() => {
    if (!searchTerm) return menuGroups;
    
    const filtered = {};
    Object.entries(menuGroups).forEach(([groupKey, items]) => {
      const filteredItems = items.filter(item => 
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[groupKey] = filteredItems;
      }
    });
    return filtered;
  }, [menuGroups, searchTerm]);

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Cerrar sidebar en móvil al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [location.pathname, onClose]);

  // Clases estandarizadas para el sidebar
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 sm:w-72
    bg-gray-900 text-white
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
    flex flex-col shadow-2xl border-r border-gray-700/50
  `;

  return (
    <aside className={`${sidebarClasses} sidebar-container`} data-sidebar>
      {/* Header con búsqueda */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <SigoLogo 
            size={32} 
            variant="default" 
            className="flex-shrink-0"
          />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Cerrar menú"
          >
            <XIcon size={20} />
          </button>
        </div>
        
        {/* Búsqueda */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar en el menú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-form-input focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1 transition-all duration-200"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 sidebar-nav">
        <div className="px-4 space-y-6">
          {Object.entries(filteredGroups).map(([groupKey, items]) => {
            const groupLabels = {
              main: 'Principal',
              evaluations: 'Evaluaciones',
              resources: 'Recursos',
              notifications: 'Notificaciones',
              admin: 'Administración'
            };

            return (
              <div key={groupKey}>
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className="flex items-center justify-between w-full px-3 py-2 text-left text-nav-item text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span>{groupLabels[groupKey]}</span>
                  <ChevronDownIcon 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedGroups[groupKey] ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedGroups[groupKey] && (
                  <div className="mt-2 space-y-1">
                    {items.map((item) => (
                      <NavItem
                        key={item.to}
                        to={item.to}
                        icon={item.icon}
                        badge={item.badge}
                      >
                        {item.label}
                      </NavItem>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.nombre?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-institutional-sm font-medium text-white truncate">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-institutional-xs text-gray-400 truncate">{user?.rol}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-nav-item text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOutIcon size={16} />
          Cerrar Sesión
        </button>
        
        <div className="flex items-center justify-center gap-2 mt-4">
          <SigoLogo 
            size={16} 
            variant="icon-only" 
            className="text-gray-500"
          />
          <p className="text-institutional-xs text-gray-500">
            v1.0 · SIGO © 2025
          </p>
        </div>
      </div>
    </aside>
  );
});

const NavItem = memo(({ to, icon: Icon, children, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-nav-item
        transition-all duration-200 ease-in-out group relative
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-300 hover:bg-blue-600/20 hover:text-white hover:shadow-md'
        }
        hover:scale-105 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
    >
      <Icon 
        size={18} 
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          {badge}
        </span>
      )}
      {({ isActive }) => isActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
      )}
    </NavLink>
  );
});

StandardizedSidebar.displayName = 'StandardizedSidebar';
NavItem.displayName = 'NavItem';

export default StandardizedSidebar;
