/**
 * Campo de entrada reutilizable para formularios.
 *
 * @param {Object} props
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.type - Tipo de input
 * @param {string} [props.placeholder] - Placeholder del campo
 * @param {string} [props.value] - Valor del campo
 * @param {Function} [props.onChange] - Callback para cambios
 * @param {boolean} [props.required] - Si el campo es requerido
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {number} [props.maxLength] - Longitud máxima
 * @returns {JSX.Element}
 *
 * @example
 * <InputField label="Email" name="email" type="email" onChange={fn} />
 */
export default function InputField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
}) {
  return (
    <div className="flex flex-col space-y-1 sm:space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={name}
          className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-md border 
          border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 
          text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${className}`}
      />
    </div>
  );
}
