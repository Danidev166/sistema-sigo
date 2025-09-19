/**
 * Componente de filtros para las entregas de recursos.
 *
 * @param {Object} props
 * @param {Function} props.onFiltroChange - Callback cuando cambian los filtros
 * @returns {JSX.Element}
 *
 * @example
 * <FiltroEntregas onFiltroChange={fn} />
 */
export default function FiltroEntregas({ onFilter }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 flex flex-wrap gap-4 items-center">
      <input
        type="text"
        name="estudiante"
        onChange={handleChange}
        placeholder="Buscar por estudiante o RUT"
        className="border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-md text-sm w-full sm:w-64 bg-white dark:bg-slate-700 dark:text-white"
      />

      <input
        type="text"
        name="recurso"
        onChange={handleChange}
        placeholder="Nombre del recurso"
        className="border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-md text-sm w-full sm:w-56 bg-white dark:bg-slate-700 dark:text-white"
      />

      <input
        type="date"
        name="fecha"
        onChange={handleChange}
        className="border border-gray-300 dark:border-slate-600 px-3 py-2 rounded-md text-sm bg-white dark:bg-slate-700 dark:text-white"
      />
    </div>
  );
}
