import { Pencil, Trash2 } from "lucide-react";

/**
 * Componente de tabla para mostrar recursos del sistema.
 *
 * @param {Object} props
 * @param {Array} props.recursos - Lista de recursos
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <RecursoTable recursos={[]} onEdit={fn} onDelete={fn} />
 */

export default function RecursoTable({ recursos, onEdit, onDelete }) {
  if (!recursos.length) {
    return (
      <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No hay recursos registrados.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Vista escritorio */}
      <div className="hidden md:block overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Disponible
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {recursos.map((recurso) => (
              <tr key={recurso.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">
                  {recurso.tipo_recurso}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {recurso.nombre}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {recurso.descripcion || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {recurso.cantidad_disponible ?? 0}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(recurso)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(recurso)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
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
        {recursos.map((recurso) => (
          <div
            key={recurso.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{recurso.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {recurso.tipo_recurso}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(recurso)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => onDelete(recurso)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Disponible:</span>
                <p className="text-gray-900 dark:text-white">{recurso.cantidad_disponible ?? 0}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">Descripción:</span>
                <p className="text-gray-900 dark:text-white">
                  {recurso.descripcion || "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
