/**
 * Componente de tabla para mostrar movimientos de inventario.
 *
 * @param {Object} props
 * @param {Array} props.movimientos - Lista de movimientos
 * @param {Function} props.onEdit - Callback para editar movimiento
 * @param {Function} props.onDelete - Callback para eliminar movimiento
 * @returns {JSX.Element}
 *
 * @example
 * <MovimientoTable movimientos={[]} onEdit={fn} onDelete={fn} />
 */
// src/features/recursos/components/MovimientoTable.jsx
import { format } from "date-fns";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function MovimientoTable({ movimientos, onEdit, onDelete }) {
  const [movimientoAEliminar, setMovimientoAEliminar] = useState(null);


  const handleEliminar = (movimiento) => {
    setMovimientoAEliminar(movimiento);
  };

  const confirmarEliminacion = () => {
    if (movimientoAEliminar && onDelete) {
      onDelete(movimientoAEliminar.id);
      setMovimientoAEliminar(null);
    }
  };

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay movimientos registrados
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Recurso
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Cantidad
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Estudiante
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Responsable
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Observaciones
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {movimientos.map((mov) => (
              <tr key={mov.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">
                  {format(new Date(mov.fecha), "dd/MM/yyyy")}
                </td>
                <td className="px-4 py-3 text-sm capitalize text-blue-600 dark:text-blue-400">
                  {mov.tipo_movimiento}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{mov.recurso}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{mov.cantidad}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">
                  {mov.estudiante || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{mov.responsable || "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{mov.observaciones || "-"}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onEdit && onEdit(mov)}
                      className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-300 hover:border-blue-600 rounded-md transition-all duration-200 hover:shadow-md"
                      title="Editar movimiento"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && handleEliminar(mov)}
                      className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-white hover:bg-red-600 border border-red-300 hover:border-red-600 rounded-md transition-all duration-200 hover:shadow-md"
                      title="Eliminar movimiento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación de eliminación */}
      {movimientoAEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                ¿Estás seguro de que quieres eliminar este movimiento?
              </p>
              <div className="bg-gray-50 dark:bg-slate-700 rounded p-3 text-sm">
                <p><strong>Fecha:</strong> {format(new Date(movimientoAEliminar.fecha), "dd/MM/yyyy")}</p>
                <p><strong>Tipo:</strong> {movimientoAEliminar.tipo_movimiento}</p>
                <p><strong>Recurso:</strong> {movimientoAEliminar.recurso}</p>
                <p><strong>Cantidad:</strong> {movimientoAEliminar.cantidad}</p>
                {movimientoAEliminar.estudiante && (
                  <p><strong>Estudiante:</strong> {movimientoAEliminar.estudiante}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setMovimientoAEliminar(null)}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
