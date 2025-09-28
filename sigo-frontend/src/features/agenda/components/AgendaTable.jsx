import { CheckCircle, Edit, Trash2 } from "lucide-react";

/**
 * Componente de tabla para mostrar la agenda de entrevistas.
 *
 * @param {Object} props
 * @param {Array} props.agendaItems - Lista de entrevistas agendadas
 * @param {Function} props.onEdit - Callback para editar
 * @param {Function} props.onDelete - Callback para eliminar
 * @param {Function} props.onRegistrarEntrevista - Callback para registrar entrevista
 * @returns {JSX.Element}
 *
 * @example
 * <AgendaTable agendaItems={items} onEdit={fn} onDelete={fn} onRegistrarEntrevista={fn} />
 */
export default function AgendaTable({ agendaItems, onEdit, onDelete, onRegistrarEntrevista }) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px] table-auto text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-700">
              <th className="px-2 py-1 border-b">Estudiante</th>
              <th className="px-2 py-1 border-b">Fecha</th>
              <th className="px-2 py-1 border-b">Hora</th>
              <th className="px-2 py-1 border-b">Motivo</th>
              <th className="px-2 py-1 border-b">Profesional</th>
              <th className="px-2 py-1 border-b">Estado</th>
              <th className="px-2 py-1 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {agendaItems.map((item) => {
              const isRealizada = item.motivo.includes("(Registrada)");
              return (
                <tr key={item.id} className="border-b dark:border-slate-600">
                  <td className="px-2 py-1">{item.nombre_estudiante}</td>
                  <td className="px-2 py-1">{item.fecha}</td>
                  <td className="px-2 py-1">{item.hora}</td>
                  <td className="px-2 py-1">
                    {item.motivo.replace(" (Registrada)", "")}
                  </td>
                  <td className="px-2 py-1">{item.profesional}</td>
                  <td className="px-2 py-1">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        isRealizada
                          ? "bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-900"
                          : "bg-yellow-200 text-yellow-900 dark:bg-yellow-300 dark:text-yellow-900"
                      }`}
                    >
                      {isRealizada ? "Realizada" : "Pendiente"}
                    </span>
                  </td>
                  <td className="px-2 py-1">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
                        title="Editar entrevista"
                      >
                        <Edit size={12} />
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="inline-flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
                        title="Eliminar entrevista"
                      >
                        <Trash2 size={12} />
                        Eliminar
                      </button>
                      {!isRealizada && (
                        <button
                          onClick={() => onRegistrarEntrevista(item)}
                          className="inline-flex items-center gap-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200"
                          title="Registrar como realizada"
                        >
                          <CheckCircle size={12} />
                          Registrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {agendaItems.map((item) => {
          const isRealizada = item.motivo.includes("(Registrada)");
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.nombre_estudiante}
                </h3>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    isRealizada
                      ? "bg-green-200 text-green-900 dark:bg-green-300 dark:text-green-900"
                      : "bg-yellow-200 text-yellow-900 dark:bg-yellow-300 dark:text-yellow-900"
                  }`}
                >
                  {isRealizada ? "Realizada" : "Pendiente"}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-medium">Fecha:</span> {item.fecha}
                </p>
                <p>
                  <span className="font-medium">Hora:</span> {item.hora}
                </p>
                <p>
                  <span className="font-medium">Motivo:</span>{" "}
                  {item.motivo.replace(" (Registrada)", "")}
                </p>
                <p>
                  <span className="font-medium">Profesional:</span>{" "}
                  {item.profesional}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => onEdit(item)}
                  className="inline-flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1"
                  title="Editar entrevista"
                >
                  <Edit size={14} />
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="inline-flex items-center justify-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1"
                  title="Eliminar entrevista"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
                {!isRealizada && (
                  <button
                    onClick={() => onRegistrarEntrevista(item)}
                    className="inline-flex items-center justify-center gap-1.5 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1"
                    title="Registrar como realizada"
                  >
                    <CheckCircle size={14} />
                    Registrar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
