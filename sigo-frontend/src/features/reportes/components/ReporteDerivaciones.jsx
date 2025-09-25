import { useEffect, useState } from "react";
import reporteService from "../services/ReporteService";
import { toast } from "react-hot-toast";
import ExportarDerivacionesPDF from "./ExportarDerivacionesPDF";
import ExportarDerivacionesExcel from "./ExportarDerivacionesExcel";

const estados = ["Pendiente", "En curso", "Finalizada"];

export default function ReporteDerivaciones() {
  const [filtros, setFiltros] = useState({ curso: "", fecha_inicio: "", fecha_fin: "", motivo: "", profesional: "", estado: "" });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await reporteService.getDerivaciones(filtros);
      setData(res.data);
    } catch {
      toast.error("Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltrar = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-4">
      {/* Filtros responsivos */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <form onSubmit={handleFiltrar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Curso</label>
              <input 
                name="curso" 
                value={filtros.curso} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ej: 1° Medio A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha inicio</label>
              <input 
                type="date" 
                name="fecha_inicio" 
                value={filtros.fecha_inicio} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha fin</label>
              <input 
                type="date" 
                name="fecha_fin" 
                value={filtros.fecha_fin} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Motivo</label>
              <input 
                name="motivo" 
                value={filtros.motivo} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Motivo de derivación"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profesional</label>
              <input 
                name="profesional" 
                value={filtros.profesional} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Nombre profesional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
              <select 
                name="estado" 
                value={filtros.estado} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {estados.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button 
              type="button" 
              onClick={() => setFiltros({ curso: "", fecha_inicio: "", fecha_fin: "", motivo: "", profesional: "", estado: "" })}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-md transition-colors"
            >
              Limpiar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Filtrar
            </button>
          </div>
        </form>
      </div>

      {/* Botones de exportar */}
      <div className="flex justify-end gap-2 mb-2">
        <ExportarDerivacionesPDF data={data} />
        <ExportarDerivacionesExcel data={data} />
      </div>

      {/* Tabla responsiva */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nombre</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Apellido</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Curso</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Motivo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Profesional</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id + row.fecha_entrevista} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.nombre}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.apellido}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.curso}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.motivo}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {row.fecha_entrevista ? new Date(row.fecha_entrevista).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {row.profesional_nombre} {row.profesional_apellido}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.estado_entrevista === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        row.estado_entrevista === 'Completada' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {row.estado_entrevista}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 