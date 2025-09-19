/**
 * Componente de filtros para los movimientos de inventario.
 *
 * @param {Object} props
 * @param {Function} props.onFiltroChange - Callback cuando cambian los filtros
 * @returns {JSX.Element}
 *
 * @example
 * <FiltroMovimientos onFiltroChange={fn} />
 */
// src/features/recursos/components/FiltroMovimientos.jsx
export default function FiltroMovimientos({ filtros, setFiltros }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded shadow p-4 flex flex-wrap gap-4">
      <select
        name="tipo"
        value={filtros.tipo}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-40 text-sm bg-white dark:bg-slate-700 dark:text-white"
      >
        <option value="">Todos</option>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <input
        type="date"
        name="fechaInicio"
        value={filtros.fechaInicio}
        onChange={handleChange}
        className="border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
      />

      <input
        type="date"
        name="fechaFin"
        value={filtros.fechaFin}
        onChange={handleChange}
        className="border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
      />
    </div>
  );
}
