import { parseISO, format } from "date-fns";

/**
 * Componente de tabla para mostrar las alertas del sistema.
 *
 * @param {Object} props
 * @param {Array} props.alertas - Lista de alertas
 * @param {Function} props.onMarcarResuelta - Callback para marcar como resuelta
 * @returns {JSX.Element}
 *
 * @example
 * <AlertaTable alertas={[]} onMarcarResuelta={fn} />
 */
export default function AlertaTable({ alertas = [], onMarcarResuelta }) {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm text-left text-gray-500 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-slate-700 text-xs uppercase text-gray-700 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estudiante</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alertas.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No hay alertas registradas.
                </td>
              </tr>
            ) : (
              alertas.map((alerta) => (
                <tr
                  key={alerta.id}
                  className="border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-4 py-3">
                    {alerta.fecha_alerta
                      ? format(parseISO(alerta.fecha_alerta), "dd/MM/yyyy")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {alerta.nombre} {alerta.apellido}
                  </td>
                  <td className="px-4 py-3">{alerta.tipo_alerta}</td>
                  <td className="px-4 py-3">{alerta.descripcion}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        alerta.estado === "Activa"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                          : alerta.estado === "Resuelta"
                          ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-300 dark:text-gray-900"
                      }`}
                    >
                      {alerta.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {alerta.estado !== "Resuelta" ? (
                      <button
                        onClick={() => onMarcarResuelta(alerta)}
                        className="text-green-600 hover:underline text-xs"
                      >
                        Marcar como Resuelta
                      </button>
                    ) : (
                      <span className="text-purple-500 text-xs">✔️ Sin acciones</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {alertas.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No hay alertas registradas.
          </div>
        ) : (
          alertas.map((alerta) => (
            <div
              key={alerta.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {alerta.nombre} {alerta.apellido}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {alerta.fecha_alerta
                      ? format(parseISO(alerta.fecha_alerta), "dd/MM/yyyy")
                      : "-"}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    alerta.estado === "Activa"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900"
                      : alerta.estado === "Resuelta"
                      ? "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-300 dark:text-gray-900"
                  }`}
                >
                  {alerta.estado}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tipo:</span>
                  <p className="text-gray-900 dark:text-white">{alerta.tipo_alerta}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Descripción:</span>
                  <p className="text-gray-900 dark:text-white">{alerta.descripcion}</p>
                </div>
              </div>

              <div className="pt-2">
                {alerta.estado !== "Resuelta" ? (
                  <button
                    onClick={() => onMarcarResuelta(alerta)}
                    className="w-full bg-green-50 dark:bg-green-200 text-green-700 hover:bg-green-100 px-3 py-2 rounded text-sm font-medium transition"
                  >
                    Marcar como Resuelta
                  </button>
                ) : (
                  <span className="block text-center text-purple-500 text-sm">
                    ✔️ Sin acciones
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
