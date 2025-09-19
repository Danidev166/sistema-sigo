/**
 * Componente de tabla para mostrar resultados de evaluaciones vocacionales.
 *
 * @param {Object} props
 * @param {Array} props.resultados - Lista de resultados
 * @param {Function} props.onVerDetalle - Callback para ver detalle
 * @returns {JSX.Element}
 *
 * @example
 * <TablaResultadosEvaluacion resultados={[]} onVerDetalle={fn} />
 */
// src/features/evaluaciones/components/TablaResultadosEvaluacion.jsx
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { interpretarResultado } from "../utils/interpretaciones";

export default function TablaResultadosEvaluacion({ data = [] }) {
  const navigate = useNavigate();

  // Función para obtener la interpretación del resultado
  const obtenerInterpretacion = (item) => {
    try {
      const resultados = typeof item.resultados === 'string' 
        ? JSON.parse(item.resultados) 
        : item.resultados;
      return interpretarResultado(item.tipo_evaluacion, resultados);
    } catch {
      return null;
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700">
        No hay resultados para mostrar.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => {
          const interpretacion = obtenerInterpretacion(item);
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 dark:text-white">{item.nombre_completo}</h3>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {item.tipo_evaluacion}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>
                  <strong className="text-gray-700 dark:text-gray-200">Curso:</strong> {item.curso}
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-200">Fecha:</strong>{" "}
                  {item.fecha_evaluacion
                    ? format(new Date(item.fecha_evaluacion), "dd/MM/yyyy")
                    : "—"}
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-200">Perfil:</strong>{" "}
                  {interpretacion ? (
                    <span className={`${interpretacion.color} font-medium`}>
                      {interpretacion.icono} {interpretacion.tipo}
                    </span>
                  ) : (
                    <span className="text-gray-500">Sin interpretación</span>
                  )}
                </p>
                <p>
                  <strong className="text-gray-700 dark:text-gray-200">Resultado:</strong>{" "}
                  {item.resultados}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-slate-700">
        <table className="w-full text-sm bg-white dark:bg-slate-800">
          <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Curso</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Perfil</th>
              <th className="px-4 py-3 text-left">Resultado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const interpretacion = obtenerInterpretacion(item);
              return (
                <tr key={item.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition">
                  <td className="px-4 py-3 text-gray-800 dark:text-white">{item.nombre_completo}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.curso}</td>
                  <td className="px-4 py-3 text-blue-700 dark:text-blue-300 font-medium">
                    {item.tipo_evaluacion}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.fecha_evaluacion
                      ? format(new Date(item.fecha_evaluacion), "dd/MM/yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {interpretacion ? (
                      <span className={`${interpretacion.color} font-medium flex items-center gap-1`}>
                        <span>{interpretacion.icono}</span>
                        <span>{interpretacion.tipo}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">Sin interpretación</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.resultados}</td>
                  <td className="px-4 py-3">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      onClick={() => {
                        let path = "/test-vocacionales/aptitudes";
                        if (item.tipo_evaluacion === "Holland") path = "/test-vocacionales/holland";
                        if (item.tipo_evaluacion === "Kuder") path = "/test-vocacionales/kuder";
                        navigate(path, { state: { evaluacion: item } });
                      }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
