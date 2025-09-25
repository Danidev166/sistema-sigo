import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/axios";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";
import { createCompleteExcel, formatDateForExcel } from "../../../utils/excelTemplate";
import { FileDown, FileSpreadsheet, AlertTriangle, Shield, Users, Clock } from "lucide-react";

export default function ReporteRiesgo() {
  const [filtros, setFiltros] = useState({ 
    curso: "", 
    fecha_inicio: "", 
    fecha_fin: "", 
    nivel_riesgo: "", 
    estado: "" 
  });
  const [data, setData] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    activas: 0,
    resueltas: 0,
    criticas: 0
  });
  const [loading, setLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const nivelesRiesgo = ["Bajo", "Medio", "Alto", "Crítico"];
  const estados = ["Activa", "En Seguimiento", "Resuelta", "Cerrada"];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Intentar obtener datos de alertas o intervenciones
      const response = await api.get('/alertas', { params: filtros });
      const alertas = response.data.data || response.data || [];
      
      setData(alertas);
      
      // Calcular estadísticas
      const stats = {
        total: alertas.length,
        activas: alertas.filter(a => a.estado === 'Activa').length,
        resueltas: alertas.filter(a => a.estado === 'Resuelta').length,
        criticas: alertas.filter(a => a.nivel_riesgo === 'Crítico').length
      };
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos de riesgo:', error);
      // Si no hay endpoint de alertas, usar datos de intervenciones
      try {
        const response = await api.get('/intervenciones', { params: filtros });
        const intervenciones = response.data.data || response.data || [];
        
        setData(intervenciones);
        
        const stats = {
          total: intervenciones.length,
          activas: intervenciones.filter(i => i.estado === 'Activa').length,
          resueltas: intervenciones.filter(i => i.estado === 'Resuelta').length,
          criticas: intervenciones.filter(i => i.tipo === 'Crítico').length
        };
        setEstadisticas(stats);
      } catch (error2) {
        console.error('Error al cargar intervenciones:', error2);
        toast.error("Error al cargar el reporte de situaciones de riesgo");
      }
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

  const limpiarFiltros = () => {
    setFiltros({ curso: "", fecha_inicio: "", fecha_fin: "", nivel_riesgo: "", estado: "" });
    fetchData();
  };

  const exportarPDF = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    setIsExportingPDF(true);
    try {
      const doc = await createStandardPDF("Reporte de Situaciones de Riesgo", "Registro de Alertas e Intervenciones");
      
      const headers = ["#", "Estudiante", "Curso", "Tipo", "Nivel", "Fecha", "Estado", "Descripción"];
      const bodyData = data.map((item, i) => [
        i + 1,
        `${item.nombre_estudiante || item.estudiante_nombre || "-"} ${item.apellido_estudiante || item.estudiante_apellido || ""}`,
        item.curso || "-",
        item.tipo || item.categoria || "-",
        item.nivel_riesgo || item.nivel || "-",
        item.fecha ? new Date(item.fecha).toLocaleDateString() : "-",
        item.estado || "-",
        item.descripcion || item.observaciones || "-"
      ]);

      addStandardTable(doc, headers, bodyData, {
        styles: { fontSize: 9 }
      });

      saveStandardPDF(doc, "situaciones_riesgo");
      toast.success("PDF exportado correctamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      toast.error("Error al exportar PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const exportarExcel = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    setIsExportingExcel(true);
    try {
      const headers = ["Estudiante", "Curso", "Tipo", "Nivel", "Fecha", "Estado", "Descripción"];
      const bodyData = data.map((item) => [
        `${item.nombre_estudiante || item.estudiante_nombre || "-"} ${item.apellido_estudiante || item.estudiante_apellido || ""}`,
        item.curso || "-",
        item.tipo || item.categoria || "-",
        item.nivel_riesgo || item.nivel || "-",
        formatDateForExcel(item.fecha),
        item.estado || "-",
        item.descripcion || item.observaciones || "-"
      ]);

      createCompleteExcel(
        "Reporte de Situaciones de Riesgo",
        "Registro de Alertas e Intervenciones",
        headers,
        bodyData,
        "situaciones_riesgo",
        "Situaciones de Riesgo"
      );

      toast.success("Excel exportado correctamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      toast.error("Error al exportar Excel");
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Total Alertas</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">{estadisticas.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Activas</p>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{estadisticas.activas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Resueltas</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{estadisticas.resueltas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Críticas</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{estadisticas.criticas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <form onSubmit={handleFiltrar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nivel de Riesgo</label>
              <select 
                name="nivel_riesgo" 
                value={filtros.nivel_riesgo} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                {nivelesRiesgo.map((nivel) => <option key={nivel} value={nivel}>{nivel}</option>)}
              </select>
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
                {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button 
              type="button" 
              onClick={limpiarFiltros}
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
      <div className="flex justify-end gap-2">
        <button
          onClick={exportarPDF}
          disabled={isExportingPDF || !data || data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExportingPDF ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exportando...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" /> Exportar PDF
            </>
          )}
        </button>
        
        <button
          onClick={exportarExcel}
          disabled={isExportingExcel || !data || data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExportingExcel ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exportando...
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Exportar Excel
            </>
          )}
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">#</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estudiante</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Curso</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nivel</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descripción</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron situaciones de riesgo
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{i + 1}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {row.nombre_estudiante || row.estudiante_nombre || "-"} {row.apellido_estudiante || row.estudiante_apellido || ""}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.curso || "-"}</td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.tipo || row.categoria || "-"}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.nivel_riesgo === 'Crítico' || row.nivel === 'Crítico' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        row.nivel_riesgo === 'Alto' || row.nivel === 'Alto' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' :
                        row.nivel_riesgo === 'Medio' || row.nivel === 'Medio' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      }`}>
                        {row.nivel_riesgo || row.nivel || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">
                      {row.fecha ? new Date(row.fecha).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.estado === 'Activa' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                        row.estado === 'En Seguimiento' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        row.estado === 'Resuelta' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                      }`}>
                        {row.estado || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.descripcion || row.observaciones || "-"}</td>
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
