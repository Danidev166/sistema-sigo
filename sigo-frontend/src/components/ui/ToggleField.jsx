import { Switch } from '@headlessui/react';

export default function ToggleField({ 
  name, 
  label, 
  checked = false, 
  onChange, 
  disabled = false, 
  className = '',
  description = null 
}) {
  const handleToggle = (value) => {
    if (!disabled) {
      onChange(name, value);
    }
  };

  return (
    <div className={`flex items-center justify-between py-2 ${className}`}>
      <div className="flex-1">
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      <Switch
        checked={!!checked}
        onChange={handleToggle}
        name={name}
        disabled={disabled}
        aria-checked={checked}
        aria-disabled={disabled}
        className={`${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
        } ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      >
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
    </div>
  );
}
