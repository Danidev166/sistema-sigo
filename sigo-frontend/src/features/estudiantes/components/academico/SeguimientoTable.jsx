/**
 * Componente de tabla para mostrar seguimientos académicos del estudiante.
 *
 * @param {Object} props
 * @param {Array} props.seguimientos - Lista de seguimientos académicos
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <SeguimientoTable seguimientos={[]} onEdit={fn} onDelete={fn} />
 */
// src/features/estudiantes/components/academico/SeguimientoTable.jsx
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function SeguimientoTable({ registros, onEdit, onDelete }) {
  return (
    <table className="w-full border text-sm rounded shadow overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-3 py-2 text-left">Asignatura</th>
          <th className="px-3 py-2 text-left">Nota</th>
          <th className="px-3 py-2 text-left">Promedio Curso</th>
          <th className="px-3 py-2 text-left">Fecha de Registro</th>
          <th className="px-3 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {registros.map((item) => (
          <tr key={item.id} className="border-t">
            <td className="px-3 py-2">{item.asignatura}</td>
            <td className="px-3 py-2">{item.nota}</td>
            <td className="px-3 py-2">{item.promedio_curso}</td>
            <td className="px-3 py-2">{format(new Date(item.fecha), "dd/MM/yyyy")}</td>
            <td className="px-3 py-2 flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="text-yellow-600 hover:text-yellow-800"
                title="Editar"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(item)}
                className="text-red-600 hover:text-red-800"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
