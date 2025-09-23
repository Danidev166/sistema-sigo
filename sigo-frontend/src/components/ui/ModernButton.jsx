import React from 'react';

/**
 * Botón moderno con tipografía estandarizada
 */
const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  icon,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white
      focus:ring-blue-500 shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
      text-gray-800 dark:text-white
      focus:ring-gray-500 shadow-sm hover:shadow-md
    `,
    outline: `
      border border-gray-300 dark:border-gray-600
      bg-white dark:bg-gray-800
      hover:bg-gray-50 dark:hover:bg-gray-700
      text-gray-700 dark:text-gray-300
      focus:ring-gray-500
    `,
    ghost: `
      text-gray-600 dark:text-gray-400
      hover:bg-gray-100 dark:hover:bg-gray-800
      hover:text-gray-900 dark:hover:text-white
      focus:ring-gray-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700 text-white
      focus:ring-red-500 shadow-sm hover:shadow-md
    `,
    success: `
      bg-green-600 hover:bg-green-700 text-white
      focus:ring-green-500 shadow-sm hover:shadow-md
    `,
  };

  const sizes = {
    xs: 'px-2 py-1 text-caption rounded-md',
    sm: 'px-3 py-1.5 text-body-sm rounded-md',
    md: 'px-4 py-2 text-button rounded-lg',
    lg: 'px-6 py-3 text-body rounded-lg',
    xl: 'px-8 py-4 text-body-lg rounded-xl',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
  `.trim();

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
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
      {icon && !loading && <span className="flex-shrink-0">{icon}</span>}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </button>
  );
};

export default ModernButton;
