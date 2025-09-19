/**
 * Botón reutilizable para acciones en la UI de estudiantes.
 *
 * @param {Object} props
 * @param {string} [props.type] - Tipo de botón
 * @param {Function} [props.onClick] - Callback al hacer clic
 * @param {string} [props.className] - Clases CSS adicionales
 * @param {React.ReactNode} props.children - Contenido del botón
 * @returns {JSX.Element}
 *
 * @example
 * <Button onClick={fn}>Guardar</Button>
 */
// src/components/ui/Button.jsx
export function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition dark:bg-blue-500 dark:hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
