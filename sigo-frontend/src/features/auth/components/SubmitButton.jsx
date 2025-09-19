/**
 * Botón de envío para formularios.
 *
 * @param {Object} props
 * @param {string} props.text - Texto del botón
 * @param {boolean} [props.disabled] - Si el botón está deshabilitado
 * @param {string} [props.className] - Clases CSS adicionales
 * @returns {JSX.Element}
 *
 * @example
 * <SubmitButton text="Enviar" disabled={false} />
 */
export default function SubmitButton({ text, disabled = false, className = '' }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full bg-blue-600 hover:bg-blue-700 
        dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold 
        py-2 sm:py-2.5 px-4 sm:px-6 rounded-md transition-colors duration-200 ease-in-out 
        disabled:opacity-50 disabled:cursor-not-allowed 
        text-sm sm:text-base ${className}`}
    >
      {text}
    </button>
  );
}
