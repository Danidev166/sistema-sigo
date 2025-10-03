import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';

const ValidatedSelect = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder = "Seleccione una opción...",
  required = false,
  disabled = false,
  helpText,
  icon: Icon,
  className = '',
  options = [],
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const getSelectClasses = () => {
    const baseClasses = "w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 dark:text-white appearance-none cursor-pointer";
    const focusClasses = "focus:ring-2 focus:ring-blue-500 focus:border-transparent";
    const disabledClasses = disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800" : "";
    
    if (error) {
      return `${baseClasses} border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500 ${disabledClasses}`;
    }
    
    if (success && hasValue) {
      return `${baseClasses} border-green-500 bg-green-50 dark:bg-green-900/20 focus:ring-green-500 ${disabledClasses}`;
    }
    
    if (isFocused) {
      return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/20 ${focusClasses} ${disabledClasses}`;
    }
    
    return `${baseClasses} border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 ${focusClasses} ${disabledClasses}`;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {Icon && <Icon className="w-4 h-4 inline mr-1" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className={getSelectClasses()}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Iconos de estado */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <ChevronDown className="w-4 h-4 text-gray-400" />
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
          {success && hasValue && !error && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
      </div>
      
      {/* Mensajes de ayuda y error */}
      <div className="space-y-1">
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </p>
        )}
        
        {success && hasValue && !error && (
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {success}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    </div>
  );
};

export default ValidatedSelect;
