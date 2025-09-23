/**
 * Componente de filtros para los movimientos de inventario.
 *
 * @param {Object} props
 * @param {Object} props.filtros - Estado actual de los filtros
 * @param {Function} props.setFiltros - Callback para actualizar filtros
 * @returns {JSX.Element}
 *
 * @example
 * <FiltroMovimientos filtros={filtros} setFiltros={setFiltros} />
 */
// src/features/recursos/components/FiltroMovimientos.jsx
import { useState, useEffect } from "react";
import { X, Search, Filter } from "lucide-react";
import recursoService from "../services/recursoService";
import estudianteService from "../../estudiantes/services/estudianteService";

export default function FiltroMovimientos({ filtros, setFiltros }) {
  const [recursos, setRecursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resRecursos, resEstudiantes] = await Promise.all([
          recursoService.getRecursos(),
          estudianteService.getAll()
        ]);
        setRecursos(resRecursos.data || []);
        setEstudiantes(resEstudiantes.data || []);
      } catch (error) {
        console.error("Error al cargar datos para filtros:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: "",
      fechaInicio: "",
      fechaFin: "",
      recurso: "",
      estudiante: "",
      curso: "",
      responsable: "",
      busqueda: ""
    });
  };

  const tieneFiltrosActivos = Object.values(filtros).some(valor => valor !== "");

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 space-y-4">
      {/* Filtros básicos */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filtros:</span>
        </div>

        {/* Tipo de movimiento */}
        <select
          name="tipo"
          value={filtros.tipo}
          onChange={handleChange}
          className="border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white min-w-[120px]"
        >
          <option value="">Todos los tipos</option>
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
        </select>

        {/* Fechas */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            name="fechaInicio"
            value={filtros.fechaInicio}
            onChange={handleChange}
            className="border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
            placeholder="Desde"
          />
          <span className="text-gray-500">-</span>
          <input
            type="date"
            name="fechaFin"
            value={filtros.fechaFin}
            onChange={handleChange}
            className="border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
            placeholder="Hasta"
          />
        </div>

        {/* Botón filtros avanzados */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-500 transition"
        >
          {showAdvanced ? "Ocultar" : "Avanzados"}
        </button>

        {/* Botón limpiar */}
        {tieneFiltrosActivos && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/30 transition flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="border-t dark:border-slate-600 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Recurso */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Recurso
              </label>
              <select
                name="recurso"
                value={filtros.recurso}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Todos los recursos</option>
                {recursos.map((r) => (
                  <option key={r.id} value={r.nombre}>
                    {r.nombre} ({r.tipo_recurso})
                  </option>
                ))}
              </select>
            </div>

            {/* Estudiante */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Estudiante
              </label>
              <select
                name="estudiante"
                value={filtros.estudiante}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Todos los estudiantes</option>
                {estudiantes.map((e) => (
                  <option key={e.id} value={`${e.nombre} ${e.apellido}`}>
                    {e.nombre} {e.apellido} ({e.rut})
                  </option>
                ))}
              </select>
            </div>

            {/* Curso */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Curso
              </label>
              <select
                name="curso"
                value={filtros.curso}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
              >
                <option value="">Todos los cursos</option>
                {[...new Set(estudiantes.map(e => e.curso))].map((curso) => (
                  <option key={curso} value={curso}>
                    {curso}
                  </option>
                ))}
              </select>
            </div>

            {/* Responsable */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Responsable
              </label>
              <input
                type="text"
                name="responsable"
                value={filtros.responsable}
                onChange={handleChange}
                placeholder="Buscar por responsable..."
                className="w-full border px-3 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            {/* Búsqueda general */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Búsqueda general
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="busqueda"
                  value={filtros.busqueda}
                  onChange={handleChange}
                  placeholder="Buscar en observaciones, responsable..."
                  className="w-full border px-10 py-2 rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
