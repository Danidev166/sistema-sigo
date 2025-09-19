// src/components/ui/Button.jsx
import React from 'react';

/**
 * @typedef {Object} ButtonProps
 * @property {string} [variant='primary'] - Variante del botón: 'primary', 'secondary', 'danger', 'ghost'
 * @property {string} [size='md'] - Tamaño del botón: 'sm', 'md', 'lg'
 * @property {boolean} [disabled=false] - Si el botón está deshabilitado
 * @property {boolean} [loading=false] - Si el botón está en estado de carga
 * @property {string} [type='button'] - Tipo del botón: 'button', 'submit', 'reset'
 * @property {Function} [onClick] - Función que se ejecuta al hacer clic
 * @property {string} [className] - Clases CSS adicionales
 * @property {React.ReactNode} children - Contenido del botón
 */

/**
 * Componente Button reutilizable con múltiples variantes y estados
 * 
 * @component
 * @param {ButtonProps} props - Propiedades del componente
 * @returns {JSX.Element} Botón renderizado
 * 
 * @example
 * ```jsx
 * // Botón primario básico
 * <Button onClick={handleClick}>
 *   Hacer clic
 * </Button>
 * 
 * // Botón secundario con estado de carga
 * <Button variant="secondary" loading={true}>
 *   Guardando...
 * </Button>
 * 
 * // Botón de peligro deshabilitado
 * <Button variant="danger" disabled={true}>
 *   Eliminar
 * </Button>
 * ```
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  children,
  ...props
}) => {
  // Clases base del botón
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Clases por variante
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  // Clases por tamaño
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  // Clases para estados
  const stateClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // Clases finales
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    stateClasses,
    className
  ].join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
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
      )}
      {children}
    </button>
  );
};

export default Button;
