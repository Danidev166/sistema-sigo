import React from "react";

export default function PlantillaTable({ plantillas, loading, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
        <thead className="bg-gray-100 dark:bg-slate-700">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tipo</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Activa</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Creación</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">Cargando...</td>
            </tr>
          ) : plantillas.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">No hay plantillas registradas.</td>
            </tr>
          ) : (
            plantillas.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                <td className="px-4 py-2 font-medium text-gray-800 dark:text-white">{p.nombre}</td>
                <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{p.tipo_reporte}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${p.activa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.activa ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm">
                  {p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => onEdit(p)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 