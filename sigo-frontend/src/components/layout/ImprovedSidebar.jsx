import { memo, useState, useMemo } from 'react';
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
import tokens from '../../styles/design-tokens';

/**
 * Sidebar mejorado con design tokens y mejor UX
 */
const ImprovedSidebar = memo(({ isAdmin, handleLogout, isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { notifications } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({
    main: true,
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
  }), [isAdmin]);

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

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-gray-900/95 backdrop-blur-xl text-white
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    lg:translate-x-0 lg:static lg:inset-0
    flex flex-col shadow-2xl border-r border-gray-700/50
    hover:shadow-2xl transition-all duration-300
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Header con búsqueda */}
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <span className="text-white font-bold text-sm tracking-tight">S</span>
          </div>
          <h1 className="text-h5 font-bold tracking-tight text-gradient">SIGO</h1>
        </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-800 transition-colors"
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
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4">
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
                  className="flex items-center justify-between w-full px-2 py-2 text-label text-gray-300 hover:text-white transition-colors"
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
                        isActive={location.pathname === item.to}
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

      {/* Footer con usuario */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.nombre?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-white truncate">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-caption text-gray-400 truncate">{user?.rol}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <LogOutIcon size={16} />
          Cerrar sesión
        </button>
        
        <p className="text-caption text-center text-gray-400 mt-3">
          v1.0 · SIGO © 2025
        </p>
      </div>
    </aside>
  );
});

const NavItem = memo(({ to, icon: Icon, children, badge, isActive }) => {
  return (
    <NavLink
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm
        transition-all duration-200 ease-in-out group relative
        ${isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }
        hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
    >
      <Icon 
        size={18} 
        className={`transition-transform duration-200 ${
          isActive ? 'scale-110' : 'group-hover:scale-110'
        }`}
      />
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          {badge}
        </span>
      )}
      {isActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
      )}
    </NavLink>
  );
});

ImprovedSidebar.displayName = 'ImprovedSidebar';
NavItem.displayName = 'NavItem';

export default ImprovedSidebar;
