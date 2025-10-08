/**
 * Componente de tabla para mostrar seguimientos psicosociales.
 *
 * @param {Object} props
 * @param {Array} props.seguimientos - Lista de seguimientos
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <SeguimientoTable seguimientos={[]} onEdit={fn} onDelete={fn} />
 */
// src/features/seguimiento/components/SeguimientoTable.jsx
import { format, parseISO } from "date-fns";

export default function SeguimientoTable({ seguimientos = [], onEdit, onDelete }) {
  console.log("🔍 Debug SeguimientoTable - seguimientos:", seguimientos);
  console.log("🔍 Debug SeguimientoTable - length:", seguimientos?.length);
  console.log("🔍 Debug SeguimientoTable - tipo:", typeof seguimientos);
  
  if (!seguimientos || seguimientos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay registros.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vista escritorio */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-slate-700 text-xs uppercase text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estudiante</th>
              <th className="px-4 py-3">Motivo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Profesional</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
            {seguimientos.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                <td className="px-4 py-3">
                  {s.fecha_seguimiento ? format(parseISO(s.fecha_seguimiento), "dd/MM/yyyy") : "-"}
                </td>
                <td className="px-4 py-3">
                  {s.nombre} {s.apellido}
                </td>
                <td className="px-4 py-3">{s.motivo}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      s.estado === "Activo"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : s.estado === "Cerrado"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {s.estado}
                  </span>
                </td>
                <td className="px-4 py-3">{s.profesional_asignado}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(s)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-4 mt-4">
        {seguimientos.map((s) => (
          <div
            key={s.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {s.nombre} {s.apellido}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.fecha_seguimiento ? format(parseISO(s.fecha_seguimiento), "dd/MM/yyyy") : "-"}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  s.estado === "Activo"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : s.estado === "Cerrado"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                }`}
              >
                {s.estado}
              </span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-200">
              <p><strong>Motivo:</strong> {s.motivo}</p>
              <p><strong>Profesional:</strong> {s.profesional_asignado}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => onEdit(s)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md text-sm font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600"
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => onDelete(s)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
