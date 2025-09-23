import { memo } from 'react';

/**
 * Componente Skeleton Loading para estados de carga
 * 
 * @param {Object} props
 * @param {string} props.variant - Tipo de skeleton (card, text, circle, etc.)
 * @param {number} props.lines - Número de líneas para variant="text"
 * @param {string} props.className - Clases adicionales
 * @param {boolean} props.animated - Si debe tener animación shimmer
 * @returns {JSX.Element}
 * 
 * @example
 * <SkeletonLoader variant="card" />
 * <SkeletonLoader variant="text" lines={3} />
 */
const SkeletonLoader = memo(({ 
  variant = 'text', 
  lines = 1, 
  className = '', 
  animated = true 
}) => {
  const baseClasses = `
    bg-gray-200 dark:bg-gray-700 rounded-md
    ${animated ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  const shimmerClasses = animated ? `
    relative overflow-hidden
    before:absolute before:inset-0
    before:-translate-x-full before:animate-shimmer
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  ` : '';

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${shimmerClasses} h-32 w-full`} />
    );
  }

  if (variant === 'circle') {
    return (
      <div className={`${baseClasses} ${shimmerClasses} rounded-full h-12 w-12`} />
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${shimmerClasses} h-4 ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`${baseClasses} ${shimmerClasses} h-10 w-24`} />
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`${baseClasses} ${shimmerClasses} rounded-full h-10 w-10`} />
    );
  }

  // Default text variant
  return (
    <div className={`${baseClasses} ${shimmerClasses} h-4 w-full`} />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
