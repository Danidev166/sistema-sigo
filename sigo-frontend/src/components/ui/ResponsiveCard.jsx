/**
 * Componente de tarjeta responsive mejorado
 * 
 * Este componente proporciona una tarjeta que se adapta automáticamente
 * a diferentes tamaños de pantalla con contenido optimizado
 */

import { memo } from 'react';
import { cn } from '../../utils/cn';

/**
 * @typedef {Object} ResponsiveCardProps
 * @property {string} [variant] - Variante de la tarjeta: 'default', 'elevated', 'outlined'
 * @property {string} [size] - Tamaño de la tarjeta: 'sm', 'md', 'lg'
 * @property {boolean} [hover] - Si la tarjeta tiene efecto hover
 * @property {boolean} [clickable] - Si la tarjeta es clickeable
 * @property {string} [className] - Clases CSS adicionales
 * @property {React.ReactNode} children - Contenido de la tarjeta
 * @property {Function} [onClick] - Función que se ejecuta al hacer clic
 */

const ResponsiveCard = memo(({
  variant = 'default',
  size = 'md',
  hover = true,
  clickable = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const baseClasses = 'bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 transition-all duration-200';
  
  const variantClasses = {
    default: 'shadow-sm',
    elevated: 'shadow-lg',
    outlined: 'shadow-none border-2'
  };
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };
  
  const interactiveClasses = clickable || onClick ? 'cursor-pointer' : '';
  const hoverClasses = hover ? 'hover:shadow-md hover:scale-[1.02]' : '';
  
  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    interactiveClasses,
    hoverClasses,
    className
  );

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

ResponsiveCard.displayName = 'ResponsiveCard';

export default ResponsiveCard;
