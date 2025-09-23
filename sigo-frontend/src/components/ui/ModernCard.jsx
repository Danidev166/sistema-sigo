import React from 'react';

/**
 * Tarjeta moderna con tipografía estandarizada
 */
const ModernCard = ({ 
  children, 
  title,
  subtitle,
  actions,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = `
    bg-white dark:bg-gray-800 rounded-xl shadow-sm
    border border-gray-200 dark:border-gray-700
    transition-all duration-200 hover:shadow-md
    ${className}
  `;

  const variants = {
    default: 'p-6',
    compact: 'p-4',
    spacious: 'p-8',
    flat: 'p-6 shadow-none border-0',
    elevated: 'p-6 shadow-lg hover:shadow-xl',
  };

  const cardClasses = `${baseClasses} ${variants[variant]}`.trim();

  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="card-title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="card-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default ModernCard;
