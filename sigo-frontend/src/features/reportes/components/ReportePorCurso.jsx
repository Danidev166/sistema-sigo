import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/axios";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";
import { createCompleteExcel, formatDateForExcel } from "../../../utils/excelTemplate";
import { FileDown, FileSpreadsheet, Users, GraduationCap, BookOpen, TrendingUp } from "lucide-react";

export default function ReportePorCurso() {
  const [filtros, setFiltros] = useState({ 
    curso: "", 
    especialidad: "", 
    año: new Date().getFullYear().toString()
  });
  const [data, setData] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total_estudiantes: 0,
    cursos_activos: 0,
    promedio_por_curso: 0,
    total_especialidades: 0
  });
  const [loading, setLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const especialidades = ["Técnico en Administración", "Técnico en Contabilidad", "Técnico en Enfermería", "Técnico en Electricidad", "Técnico en Mecánica", "Técnico en Construcción", "Técnico en Informática", "Otra"];

  const fetchData = async () => {
    setLoading(true);
    try {
      // Obtener datos de estudiantes agrupados por curso
      const response = await api.get('/estudiantes', { params: filtros });
      const estudiantes = response.data.data || response.data || [];
      
      // Agrupar por curso y especialidad
      const agrupados = estudiantes.reduce((acc, estudiante) => {
        const curso = estudiante.curso || 'Sin Curso';
        const especialidad = estudiante.especialidad || 'Sin Especialidad';
        
        if (!acc[curso]) {
          acc[curso] = {
            curso,
            especialidad,
            total: 0,
            activos: 0,
            inactivos: 0,
            estudiantes: []
          };
        }
        
        acc[curso].total += 1;
        if (estudiante.estado === 'Activo') {
          acc[curso].activos += 1;
        } else {
          acc[curso].inactivos += 1;
        }
        acc[curso].estudiantes.push(estudiante);
        
        return acc;
      }, {});
      
      const datosAgrupados = Object.values(agrupados);
      setData(datosAgrupados);
      
      // Calcular estadísticas
      const stats = {
        total_estudiantes: estudiantes.length,
        cursos_activos: datosAgrupados.length,
        promedio_por_curso: datosAgrupados.length > 0 ? Math.round(estudiantes.length / datosAgrupados.length) : 0,
        total_especialidades: [...new Set(estudiantes.map(e => e.especialidad).filter(Boolean))].length
      };
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos por curso:', error);
      toast.error("Error al cargar el reporte por curso");
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
    setFiltros({ curso: "", especialidad: "", año: new Date().getFullYear().toString() });
    fetchData();
  };

  const exportarPDF = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    setIsExportingPDF(true);
    try {
      const doc = await createStandardPDF("Reporte General por Curso", "Estadísticas por Curso y Especialidad");
      
      const headers = ["#", "Curso", "Especialidad", "Total Estudiantes", "Activos", "Inactivos", "% Activos"];
      const bodyData = data.map((item, i) => [
        i + 1,
        item.curso,
        item.especialidad,
        item.total,
        item.activos,
        item.inactivos,
        item.total > 0 ? Math.round((item.activos / item.total) * 100) + '%' : '0%'
      ]);

      addStandardTable(doc, headers, bodyData, {
        styles: { fontSize: 9 }
      });

      saveStandardPDF(doc, "reporte_por_curso");
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
      const headers = ["Curso", "Especialidad", "Total Estudiantes", "Activos", "Inactivos", "% Activos"];
      const bodyData = data.map((item) => [
        item.curso,
        item.especialidad,
        item.total,
        item.activos,
        item.inactivos,
        item.total > 0 ? Math.round((item.activos / item.total) * 100) + '%' : '0%'
      ]);

      createCompleteExcel(
        "Reporte General por Curso",
        "Estadísticas por Curso y Especialidad",
        headers,
        bodyData,
        "reporte_por_curso",
        "Por Curso"
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Estudiantes</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{estadisticas.total_estudiantes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Cursos Activos</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{estadisticas.cursos_activos}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Promedio por Curso</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{estadisticas.promedio_por_curso}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-orange-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Especialidades</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{estadisticas.total_especialidades}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <form onSubmit={handleFiltrar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
              <select 
                name="especialidad" 
                value={filtros.especialidad} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {especialidades.map((esp) => <option key={esp} value={esp}>{esp}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Año</label>
              <input 
                type="number" 
                name="año" 
                value={filtros.año} 
                onChange={handleChange} 
                min="2020" 
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
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
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Curso</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Especialidad</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Estudiantes</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activos</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Inactivos</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">% Activos</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Estado</th>
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
                    No se encontraron datos por curso
                  </td>
                </tr>
              ) : (
                data.map((row, i) => {
                  const porcentajeActivos = row.total > 0 ? Math.round((row.activos / row.total) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{i + 1}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white font-medium">{row.curso}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.especialidad}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.total}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.activos}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{row.inactivos}</td>
                      <td className="px-3 py-4 text-sm text-gray-900 dark:text-white">{porcentajeActivos}%</td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          porcentajeActivos >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                          porcentajeActivos >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                        }`}>
                          {porcentajeActivos >= 80 ? 'Excelente' : porcentajeActivos >= 60 ? 'Bueno' : 'Requiere Atención'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
