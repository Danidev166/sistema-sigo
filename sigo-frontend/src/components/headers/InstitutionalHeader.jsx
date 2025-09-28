import React from 'react';
import { Plus, Download, Filter, Search } from 'lucide-react';

/**
 * Header Institucional Principal
 * Header elegante y profesional para páginas principales
 */
export const InstitutionalHeader = ({ 
  title, 
  subtitle, 
  actions = [], 
  icon: Icon,
  variant = 'primary' 
}) => {
  const getHeaderClass = () => {
    switch (variant) {
      case 'primary':
        return 'header-institutional';
      case 'secondary':
        return 'header-secondary';
      case 'minimal':
        return 'header-minimal';
      case 'with-icon':
        return 'header-with-icon';
      default:
        return 'header-institutional';
    }
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="header-actions">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`header-action-btn ${
              action.variant === 'secondary' 
                ? 'header-action-btn-secondary' 
                : 'header-action-btn-primary'
            }`}
            disabled={action.disabled}
          >
            {action.icon && <action.icon size={16} />}
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  if (variant === 'with-icon' && Icon) {
    return (
      <div className={getHeaderClass()}>
        <div className="header-icon">
          <Icon size={24} />
        </div>
        <div className="header-content">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        {renderActions()}
      </div>
    );
  }

  return (
    <div className={getHeaderClass()}>
      <h1 className="header-title">{title}</h1>
      {subtitle && <p className="header-subtitle">{subtitle}</p>}
      {renderActions()}
    </div>
  );
};

/**
 * Header de Sección
 * Header más pequeño para secciones específicas
 */
export const SectionHeader = ({ 
  title, 
  badge, 
  actions = [],
  className = '' 
}) => {
  return (
    <div className={`header-section ${className}`}>
      <h2 className="header-title">{title}</h2>
      <div className="flex items-center gap-3">
        {badge && <span className="header-badge">{badge}</span>}
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="header-action-btn header-action-btn-secondary"
            disabled={action.disabled}
          >
            {action.icon && <action.icon size={14} />}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Header con Búsqueda y Filtros
 * Header especializado para páginas con funcionalidad de búsqueda
 */
export const SearchHeader = ({ 
  title, 
  subtitle,
  searchValue,
  onSearchChange,
  filters = [],
  onFilterClick,
  actions = []
}) => {
  return (
    <div className="header-institutional">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            />
          </div>
          
          {/* Filtros */}
          {filters.length > 0 && (
            <button
              onClick={onFilterClick}
              className="header-action-btn header-action-btn-primary"
            >
              <Filter size={16} />
              Filtros
            </button>
          )}
          
          {/* Acciones */}
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="header-action-btn header-action-btn-primary"
              disabled={action.disabled}
            >
              {action.icon && <action.icon size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Header de Tabla
 * Header especializado para páginas con tablas de datos
 */
export const TableHeader = ({ 
  title, 
  subtitle,
  totalItems,
  actions = [],
  filters = []
}) => {
  return (
    <div className="header-minimal">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
          {totalItems && (
            <p className="text-sm text-gray-500 mt-1">
              {totalItems} {totalItems === 1 ? 'elemento' : 'elementos'}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={filter.onClick}
              className="header-action-btn header-action-btn-secondary"
            >
              {filter.icon && <filter.icon size={14} />}
              {filter.label}
            </button>
          ))}
          
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="header-action-btn header-action-btn-primary"
              disabled={action.disabled}
            >
              {action.icon && <action.icon size={16} />}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Iconos predefinidos para acciones comunes
export const HeaderIcons = {
  Add: Plus,
  Download: Download,
  Filter: Filter,
  Search: Search,
};

export default InstitutionalHeader;
