import React from 'react';

/**
 * Componente de Carga Optimizado
 * 
 * Diferentes tipos de loading states para mejorar
 * la percepción de rendimiento del usuario.
 */

// Skeleton loader para contenido
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  );
}

// Spinner optimizado
export function OptimizedSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      />
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ isLoading, children, message = 'Cargando...' }) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <OptimizedSpinner size="lg" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

// Progressive loading
export function ProgressiveLoader({ 
  stages = [], 
  currentStage = 0, 
  className = '' 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <OptimizedSpinner size="lg" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {stages[currentStage]?.message || 'Cargando...'}
        </p>
      </div>
      
      {stages.length > 1 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStage + 1) / stages.length) * 100}%`
            }}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {currentStage + 1} de {stages.length}
      </div>
    </div>
  );
}

// Inline loading
export function InlineLoader({ message = 'Cargando...', size = 'sm' }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <OptimizedSpinner size={size} />
      <span>{message}</span>
    </div>
  );
}

// Button loading state
export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = 'Cargando...',
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      className={`relative ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <OptimizedSpinner size="sm" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
}
