import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";

/**
 * Componente de tabla para mostrar entregas de recursos.
 *
 * @param {Object} props
 * @param {Array} props.entregas - Lista de entregas
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <EntregaTable entregas={[]} onEdit={fn} onDelete={fn} />
 */
export default function EntregaTable({ entregas, onEdit, onDelete }) {
  if (!entregas || entregas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay entregas registradas
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vista escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow bg-white dark:bg-slate-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              {["Estudiante", "RUT", "Curso", "Recurso", "Cantidad", "Fecha", "Obs.", "Acciones"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {entregas.map((entrega) => (
              <tr key={entrega.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{entrega.nombre_estudiante}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{entrega.rut}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{entrega.curso}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{entrega.recurso}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{entrega.cantidad}</td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {format(new Date(entrega.fecha_entrega), "dd/MM/yyyy")}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                  {entrega.observaciones || "—"}
                </td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit?.(entrega)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(entrega)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="sm:hidden space-y-4 mt-4">
        {entregas.map((entrega) => (
          <div
            key={entrega.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-2"
          >
            <div className="text-sm text-gray-900 dark:text-white font-semibold">
              {entrega.nombre_estudiante}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {entrega.rut} · {entrega.curso}
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              Recurso: <strong>{entrega.recurso}</strong> ({entrega.cantidad})
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Fecha: {format(new Date(entrega.fecha_entrega), "dd/MM/yyyy")}
            </div>
            {entrega.observaciones && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Obs.: {entrega.observaciones}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-slate-700 mt-2">
              <button
                onClick={() => onEdit?.(entrega)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600"
              >
                <Edit className="w-4 h-4 inline mr-1" /> Editar
              </button>
              <button
                onClick={() => onDelete?.(entrega)}
                className="px-3 py-1 text-sm border border-transparent rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
