import React from 'react';

const UpperCaseTextarea = React.forwardRef(
  ({ className = '', onChange, value, ...props }, ref) => {
    const handleChange = (e) => {
      const upperValue = e.target.value.toUpperCase();
      // Crear un nuevo evento con el valor en mayúsculas
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: upperValue
        }
      };
      if (onChange) {
        onChange(newEvent);
      }
    };

    return (
      <textarea
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 
        bg-white dark:bg-slate-700 text-gray-900 dark:text-white 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${className}`}
        {...props}
      />
    );
  }
);

UpperCaseTextarea.displayName = 'UpperCaseTextarea';

export default UpperCaseTextarea;
