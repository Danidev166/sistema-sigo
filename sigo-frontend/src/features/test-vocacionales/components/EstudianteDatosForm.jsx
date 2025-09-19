/**
 * Formulario de datos del estudiante para evaluaciones vocacionales.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback para guardar datos
 * @returns {JSX.Element}
 *
 * @example
 * <EstudianteDatosForm onSubmit={fn} />
 */
// src/features/evaluaciones/components/EstudianteDatosForm.jsx
export default function EstudianteDatosForm({ estudiante, onChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md max-w-3xl mx-auto mb-6 border border-gray-200 dark:border-slate-700">
      <h4 className="text-center text-lg sm:text-xl font-bold mb-4 text-gray-800 dark:text-white">
        🧑 Datos del estudiante
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["nombre", "apellido", "rut", "curso"].map((campo) => (
          <div key={campo} className="space-y-1">
            <label
              htmlFor={campo}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {campo.charAt(0).toUpperCase() + campo.slice(1)}
            </label>
            <input
              id={campo}
              name={campo}
              placeholder={`Ingrese ${campo}`}
              value={estudiante[campo]}
              onChange={onChange}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
