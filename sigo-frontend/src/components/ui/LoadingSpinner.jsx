import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Componente de loading spinner estandarizado
 * 
 * @param {Object} props
 * @param {string} props.size - Tamaño del spinner (sm, md, lg, xl)
 * @param {string} props.text - Texto a mostrar
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.centered - Si centrar el spinner
 * @param {string} props.color - Color del spinner (blue, gray, white)
 * @returns {JSX.Element}
 */
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Cargando...', 
  className = '',
  centered = false,
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const spinner = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      />
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300`}>
          {text}
        </span>
      )}
    </div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center p-4">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * Componente de loading para páginas completas
 */
export const PageLoader = ({ text = 'Cargando página...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
    <div className="text-center">
      <LoadingSpinner size="xl" text={text} centered />
    </div>
  </div>
);

/**
 * Componente de loading para cards
 */
export const CardLoader = ({ text = 'Cargando...' }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
    <LoadingSpinner size="md" text={text} centered />
  </div>
);

/**
 * Componente de loading para botones
 */
export const ButtonLoader = ({ text = 'Cargando...' }) => (
  <LoadingSpinner size="sm" text={text} color="white" />
);

/**
 * Componente de loading para tablas
 */
export const TableLoader = ({ rows = 5 }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        {/* Header */}
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Componente de loading para gráficos
 */
export const ChartLoader = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6">
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
      <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

export default LoadingSpinner;