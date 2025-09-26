// src/components/ui/ModernButton.jsx
import React from 'react';
import { cn } from '../../utils/cn';

/**
 * @typedef {Object} ModernButtonProps
 * @property {string} [variant='primary'] - Variante del botón: 'primary', 'secondary', 'success', 'warning', 'danger', 'info', 'ghost'
 * @property {string} [size='md'] - Tamaño del botón: 'xs', 'sm', 'md', 'lg', 'xl'
 * @property {boolean} [disabled=false] - Si el botón está deshabilitado
 * @property {boolean} [loading=false] - Si el botón está en estado de carga
 * @property {string} [type='button'] - Tipo del botón: 'button', 'submit', 'reset'
 * @property {Function} [onClick] - Función que se ejecuta al hacer clic
 * @property {string} [className] - Clases CSS adicionales
 * @property {React.ReactNode} [icon] - Icono del botón
 * @property {'left'|'right'} [iconPosition='left'] - Posición del icono
 * @property {React.ReactNode} children - Contenido del botón
 */

/**
 * Componente Button moderno con diseño inspirado en botones de marcas populares
 * 
 * @component
 * @param {ModernButtonProps} props - Propiedades del componente
 * @returns {JSX.Element} Botón renderizado
 * 
 * @example
 * ```jsx
 * // Botón primario con icono a la izquierda
 * <ModernButton icon={<PlusIcon />} onClick={handleClick}>
 *   Agregar Estudiante
 * </ModernButton>
 * 
 * // Botón de éxito con icono a la derecha
 * <ModernButton variant="success" icon={<CheckIcon />} iconPosition="right">
 *   Guardar
 * </ModernButton>
 * 
 * // Botón de carga
 * <ModernButton loading={true}>
 *   Procesando...
 * </ModernButton>
 * ```
 */
const ModernButton = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon,
  iconPosition = 'left',
  children,
  ...props
}) => {
  // Clases base del botón
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
  
  // Clases por variante con colores modernos
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-yellow-500 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl',
    info: 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white hover:from-cyan-700 hover:to-cyan-800 focus:ring-cyan-500 shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 border border-gray-300 dark:border-gray-600'
  };
  
  // Clases por tamaño
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3'
  };
  
  // Clases para estados
  const stateClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' 
    : 'cursor-pointer';
  
  // Clases finales
  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    className
  );
  
  // Renderizar icono de carga
  const LoadingIcon = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingIcon />}
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default ModernButton;