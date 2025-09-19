/**
 * Componente de filtros para evaluaciones vocacionales.
 *
 * @param {Object} props
 * @param {Function} props.onFiltroChange - Callback cuando cambian los filtros
 * @returns {JSX.Element}
 *
 * @example
 * <FiltroEvaluacion onFiltroChange={fn} />
 */
// src/features/evaluaciones/components/FiltroEvaluacion.jsx
import { useState } from "react";
import { Filter, X } from "lucide-react";

export default function FiltroEvaluacion({ filtros, onChange }) {
  const [localFiltros, setLocalFiltros] = useState(filtros);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = { ...localFiltros, [name]: value };
    setLocalFiltros(nuevosFiltros);
    onChange(nuevosFiltros);
  };

  const hasActiveFilters = Object.values(localFiltros).some((value) => value !== "");

  return (
    <div className="space-y-4">
      {/* Barra principal de filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <input
          type="text"
          name="nombre"
          value={localFiltros.nombre}
          onChange={handleChange}
          placeholder="Buscar por nombre..."
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-slate-600 text-sm dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition text-sm"
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </button>
          {hasActiveFilters && (
            <button
              onClick={() => {
                const resetFiltros = { nombre: "", tipo: "", curso: "" };
                setLocalFiltros(resetFiltros);
                onChange(resetFiltros);
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition text-sm"
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Filtros adicionales desplegables */}
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 border border-gray-200 dark:border-slate-700 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de evaluación
            </label>
            <select
              name="tipo"
              value={localFiltros.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="Kuder">Kuder</option>
              <option value="Holland">Holland</option>
              <option value="Aptitudes">Aptitudes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Curso
            </label>
            <input
              type="text"
              name="curso"
              value={localFiltros.curso}
              onChange={handleChange}
              placeholder="Ej: 3° Medio B"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
