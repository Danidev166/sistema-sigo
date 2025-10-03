import React, { memo } from 'react';
import { Loader2, BarChart3, BookOpen, Users, Calendar } from 'lucide-react';

const OptimizedLoading = memo(({ 
  type = 'default', 
  message = 'Cargando...', 
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'academic':
        return <BookOpen className={getSizeClasses()} />;
      case 'attendance':
        return <Users className={getSizeClasses()} />;
      case 'dashboard':
        return <BarChart3 className={getSizeClasses()} />;
      case 'calendar':
        return <Calendar className={getSizeClasses()} />;
      default:
        return <Loader2 className={`${getSizeClasses()} animate-spin`} />;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'flex flex-col items-center justify-center p-8';
    const sizeClasses = {
      sm: 'min-h-32',
      md: 'min-h-48',
      lg: 'min-h-64',
      xl: 'min-h-80'
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${className}`;
  };

  return (
    <div className={getContainerClasses()}>
      {showIcon && (
        <div className="mb-4 text-blue-600 dark:text-blue-400">
          {getIcon()}
        </div>
      )}
      
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {message}
        </p>
        
        {type === 'default' && (
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
        
        {type !== 'default' && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Procesando datos...
          </p>
        )}
      </div>
    </div>
  );
});

OptimizedLoading.displayName = 'OptimizedLoading';

export default OptimizedLoading;
