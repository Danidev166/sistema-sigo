/**
 * Componente de tabla para mostrar registros de conducta del estudiante.
 *
 * @param {Object} props
 * @param {Array} props.conductas - Lista de registros de conducta
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @returns {JSX.Element}
 *
 * @example
 * <ConductaTable conductas={[]} onEdit={fn} onDelete={fn} />
 */
// src/features/estudiantes/components/ConductaTable.jsx
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function ConductaTable({ conductas = [], onEdit, onDelete }) {
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const totalPaginas = Math.ceil(conductas.length / registrosPorPagina);
  const registrosPagina = conductas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Observación</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosPagina.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No hay registros de conducta para este estudiante.
                </td>
              </tr>
            ) : (
              registrosPagina.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{format(new Date(c.fecha), "dd/MM/yyyy")}</td>
                  <td className="px-4 py-2">{c.categoria}</td>
                  <td className="px-4 py-2">{c.observacion}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => onEdit(c)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2 text-sm">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
