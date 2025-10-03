import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ValidatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  success,
  placeholder,
  required = false,
  min,
  max,
  step,
  disabled = false,
  showPasswordToggle = false,
  helpText,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const getInputClasses = () => {
    const baseClasses = "w-full px-3 py-2 rounded-lg border text-sm transition-all duration-200 dark:text-white";
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

  const getIconClasses = () => {
    if (error) return "text-red-500";
    if (success && hasValue) return "text-green-500";
    if (isFocused) return "text-blue-500";
    return "text-gray-400 dark:text-gray-500";
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
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={getInputClasses()}
          {...props}
        />
        
        {/* Iconos de estado */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
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

export default ValidatedInput;
