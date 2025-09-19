/**
 * Componente de tabla para mostrar movimientos de inventario.
 *
 * @param {Object} props
 * @param {Array} props.movimientos - Lista de movimientos
 * @returns {JSX.Element}
 *
 * @example
 * <MovimientoTable movimientos={[]} />
 */
// src/features/recursos/components/MovimientoTable.jsx
import { format } from "date-fns";

export default function MovimientoTable({ movimientos }) {
  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay movimientos registrados
      </div>
    );
  }

  return (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
