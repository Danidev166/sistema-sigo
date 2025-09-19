import { memo } from 'react';

/**
 * Componente de carga optimizado con diferentes variantes
 * 
 * @param {Object} props
 * @param {string} [props.size='md'] - Tamaño del spinner ('sm', 'md', 'lg')
 * @param {string} [props.variant='default'] - Variante del spinner ('default', 'dots', 'pulse')
 * @param {string} [props.text] - Texto de carga opcional
 * @param {boolean} [props.fullScreen=false] - Si debe ocupar toda la pantalla
 * @returns {JSX.Element}
 */
const LoadingSpinner = memo(({ 
  size = 'md', 
  variant = 'default', 
  text, 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-900 z-50'
    : 'flex items-center justify-center';

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 dark:border-slate-600 dark:border-t-blue-400`}></div>
        );
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-3">
        {renderSpinner()}
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
