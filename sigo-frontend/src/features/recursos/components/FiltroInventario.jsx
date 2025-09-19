/**
 * Componente de filtros para el inventario de recursos.
 *
 * @param {Object} props
 * @param {Function} props.onFiltroChange - Callback cuando cambian los filtros
 * @returns {JSX.Element}
 *
 * @example
 * <FiltroInventario onFiltroChange={fn} />
 */
// src/features/recursos/components/FiltroInventario.jsx

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

export default function FiltroInventario({ onFilter }) {
  const [filtros, setFiltros] = useState({
    tipo: "",
    curso: "",
    busqueda: "",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filtros);
  };

  const handleClear = () => {
    const limpio = {
      tipo: "",
      curso: "",
      busqueda: "",
    };
    setFiltros(limpio);
    onFilter(limpio);
  };

  const hasActiveFilters = filtros.tipo || filtros.curso || filtros.busqueda;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="busqueda"
              value={filtros.busqueda}
              onChange={handleChange}
              placeholder="Buscar recursos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Botón de filtros */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Panel de filtros adicionales */}
      {isFilterOpen && (
        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tipo de recurso */}
            <div>
              <label
                htmlFor="tipo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tipo de recurso
              </label>
              <select
                id="tipo"
                name="tipo"
                value={filtros.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                <option value="Útiles Escolares">Útiles Escolares</option>
                <option value="Uniforme">Uniforme</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Curso */}
            <div>
              <label
                htmlFor="curso"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Curso
              </label>
              <input
                type="text"
                id="curso"
                name="curso"
                value={filtros.curso}
                onChange={handleChange}
                placeholder="Ej: 1° Medio A"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botón aplicar */}
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
