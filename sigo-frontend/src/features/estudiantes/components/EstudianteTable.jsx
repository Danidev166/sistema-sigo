// src/features/estudiantes/components/EstudianteTable.jsx
import { memo, useCallback } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatearCurso, getCursoColor } from "../constants/cursos";

const EstudianteTable = memo(({ estudiantes, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Memoizar handlers para evitar re-renders innecesarios
  const handleEdit = useCallback((est) => {
    onEdit(est);
  }, [onEdit]);

  const handleDelete = useCallback((est) => {
    onDelete(est);
  }, [onDelete]);

  const handleView = useCallback((id) => {
    navigate(`/estudiantes/${id}`);
  }, [navigate]);


  if (!estudiantes.length) {
    return <p className="text-center text-gray-500 py-4">No hay estudiantes registrados.</p>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                RUT
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
            {estudiantes.map((est) => (
              <tr key={est.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white uppercase">
                    {est.nombre} {est.apellido}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-mono">
                    {est.rut}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {est.email || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCursoColor(est.curso)}`}>
                    {formatearCurso(est.curso)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleView(est.id)}
                      className="p-2 text-green-600 hover:text-green-800 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-150"
                      title="Ver detalle"
                    >
                      <EyeIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(est)}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-150"
                      title="Editar"
                    >
                      <PencilIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(est)}
                      className="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
                      title="Eliminar"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {estudiantes.map((est) => (
          <div
            key={est.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate uppercase">
                  {est.nombre} {est.apellido}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-300 font-mono">{est.rut}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => handleView(est.id)}
                  className="p-2 text-green-600 hover:text-green-800 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-150"
                  title="Ver detalle"
                >
                  <EyeIcon size={16} />
                </button>
                <button
                  onClick={() => handleEdit(est)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-150"
                  title="Editar"
                >
                  <PencilIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(est)}
                  className="p-2 text-red-600 hover:text-red-800 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-150"
                  title="Eliminar"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{est.email || "-"}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Curso</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCursoColor(est.curso)}`}>
                    {formatearCurso(est.curso)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Agregar displayName para debugging
EstudianteTable.displayName = 'EstudianteTable';

export default EstudianteTable;
