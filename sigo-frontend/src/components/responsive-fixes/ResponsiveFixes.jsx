/**
 * Correcciones específicas para problemas de responsive design
 * 
 * Este archivo contiene componentes y utilidades para corregir
 * problemas específicos de responsive design encontrados en SIGO
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';

/**
 * Componente para corregir problemas de grillas en reportes
 */
export const ResponsiveReportGrid = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      'gap-4 sm:gap-6',
      'p-4 sm:p-6',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de formularios en móvil
 */
export const ResponsiveFormGrid = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      'gap-4 sm:gap-6',
      'space-y-4 sm:space-y-0',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de botones en móvil
 */
export const ResponsiveButtonGroup = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row',
      'gap-2 sm:gap-3',
      'w-full sm:w-auto',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de tablas en móvil
 */
export const ResponsiveTableContainer = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'overflow-x-auto',
      'rounded-lg shadow border border-gray-200 dark:border-slate-700',
      'bg-white dark:bg-slate-800',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de modales en móvil
 */
export const ResponsiveModalContainer = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl',
      'mx-4 sm:mx-6 lg:mx-8',
      'bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl',
      'shadow-xl',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de cards en móvil
 */
export const ResponsiveCardContainer = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      'gap-4 sm:gap-6',
      'p-4 sm:p-6',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de navegación en móvil
 */
export const ResponsiveNavigation = memo(({ children, className = '' }) => {
  return (
    <nav className={cn(
      'flex flex-col sm:flex-row',
      'gap-2 sm:gap-4',
      'p-4 sm:p-6',
      'bg-white dark:bg-slate-800',
      'border-b border-gray-200 dark:border-slate-700',
      className
    )}>
      {children}
    </nav>
  );
});

/**
 * Componente para corregir problemas de contenido en móvil
 */
export const ResponsiveContent = memo(({ children, className = '' }) => {
  return (
    <div className={cn(
      'px-4 sm:px-6 lg:px-8',
      'py-4 sm:py-6 lg:py-8',
      'max-w-7xl mx-auto',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de sidebar en móvil
 */
export const ResponsiveSidebar = memo(({ children, isOpen, onClose, className = '' }) => {
  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 w-64 sm:w-72',
      'bg-gray-900 text-white',
      'transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0 lg:static lg:inset-0',
      className
    )}>
      {children}
    </div>
  );
});

/**
 * Componente para corregir problemas de overlay en móvil
 */
export const ResponsiveOverlay = memo(({ isOpen, onClose, className = '' }) => {
  if (!isOpen) return null;
  
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 bg-black bg-opacity-50',
        'lg:hidden',
        className
      )}
      onClick={onClose}
      aria-hidden="true"
    />
  );
});

/**
 * Hook para obtener clases responsive específicas
 */
export const useResponsiveClasses = () => {
  const getGridClasses = (cols = { mobile: 1, tablet: 2, desktop: 3 }) => {
    const { mobile = 1, tablet = 2, desktop = 3 } = cols;
    return `grid-cols-${mobile} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`;
  };

  const getSpacingClasses = (spacing = { mobile: 4, tablet: 6, desktop: 8 }) => {
    const { mobile = 4, tablet = 6, desktop = 8 } = spacing;
    return `gap-${mobile} sm:gap-${tablet} lg:gap-${desktop}`;
  };

  const getPaddingClasses = (padding = { mobile: 4, tablet: 6, desktop: 8 }) => {
    const { mobile = 4, tablet = 6, desktop = 8 } = padding;
    return `p-${mobile} sm:p-${tablet} lg:p-${desktop}`;
  };

  const getMarginClasses = (margin = { mobile: 4, tablet: 6, desktop: 8 }) => {
    const { mobile = 4, tablet = 6, desktop = 8 } = margin;
    return `m-${mobile} sm:m-${tablet} lg:m-${desktop}`;
  };

  const getTextClasses = (size = { mobile: 'sm', tablet: 'base', desktop: 'lg' }) => {
    const { mobile = 'sm', tablet = 'base', desktop = 'lg' } = size;
    return `text-${mobile} sm:text-${tablet} lg:text-${desktop}`;
  };

  return {
    getGridClasses,
    getSpacingClasses,
    getPaddingClasses,
    getMarginClasses,
    getTextClasses
  };
};

export default {
  ResponsiveReportGrid,
  ResponsiveFormGrid,
  ResponsiveButtonGroup,
  ResponsiveTableContainer,
  ResponsiveModalContainer,
  ResponsiveCardContainer,
  ResponsiveNavigation,
  ResponsiveContent,
  ResponsiveSidebar,
  ResponsiveOverlay,
  useResponsiveClasses
};
