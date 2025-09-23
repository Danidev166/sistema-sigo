import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText, 
  Download, 
  Filter,
  Calendar,
  BookOpen,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import reporteMejoradoService from "../services/ReporteMejoradoService";

export default function ReportesMejorados() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [filtros, setFiltros] = useState({
    curso: "",
    estado: "",
    fecha_desde: "",
    fecha_hasta: ""
  });

  // 📊 Dashboard KPIs
  const [kpis, setKpis] = useState({
    totalEstudiantes: 0,
    estudiantesActivos: 0,
    entrevistasMes: 0,
    intervencionesMes: 0,
    recursosEntregados: 0,
    promedioAsistencia: 0
  });

  // Cargar KPIs del dashboard
  useEffect(() => {
    cargarKPIs();
  }, []);

  const cargarKPIs = async () => {
    setLoading(true);
    try {
      const response = await reporteMejoradoService.getDashboardKPIs();
      setKpis(response.data);
    } catch (error) {
      console.error("Error al cargar KPIs:", error);
      toast.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const cargarDatos = async (tipo) => {
    setLoading(true);
    try {
      let response;
      switch (tipo) {
        case "estudiantes":
          response = await reporteMejoradoService.getEstudiantesPorCurso(filtros);
          break;
        case "institucional":
          response = await reporteMejoradoService.getReporteInstitucional();
          break;
        case "asistencia":
          response = await reporteMejoradoService.getReporteAsistencia(filtros);
          break;
        default:
          return;
      }
      setData({ ...data, [tipo]: response.data });
      toast.success(`${response.data.length} registros cargados`);
    } catch (error) {
      console.error(`Error al cargar ${tipo}:`, error);
      toast.error(`Error al cargar datos de ${tipo}`);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    cargarDatos(activeTab);
  };

  const limpiarFiltros = () => {
    setFiltros({
      curso: "",
      estado: "",
      fecha_desde: "",
      fecha_hasta: ""
    });
    setData({});
  };

  const exportarPDF = () => {
    // Implementar exportación PDF
    toast.info("Función de exportación en desarrollo");
  };

  const exportarExcel = () => {
    // Implementar exportación Excel
    toast.info("Función de exportación en desarrollo");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reportes del Sistema
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análisis y estadísticas de estudiantes y actividades
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button
            onClick={exportarExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="flex gap-2 overflow-x-auto">
          {[
            { key: "dashboard", label: "Dashboard", icon: BarChart3 },
            { key: "estudiantes", label: "Estudiantes", icon: Users },
            { key: "institucional", label: "Institucional", icon: BookOpen },
            { key: "asistencia", label: "Asistencia", icon: Calendar },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filtros
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Curso
            </label>
            <select
              value={filtros.curso}
              onChange={(e) => setFiltros(prev => ({ ...prev, curso: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value="">Todos los cursos</option>
              <option value="1° Medio A">1° Medio A</option>
              <option value="1° Medio B">1° Medio B</option>
              <option value="2° Medio A">2° Medio A</option>
              <option value="2° Medio B">2° Medio B</option>
              <option value="3° Medio A">3° Medio A</option>
              <option value="3° Medio B">3° Medio B</option>
              <option value="4° Medio A">4° Medio A</option>
              <option value="4° Medio B">4° Medio B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="egresado">Egresado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_desde: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => setFiltros(prev => ({ ...prev, fecha_hasta: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={aplicarFiltros}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltros}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Contenido de las Pestañas */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Dashboard Principal
            </h2>
            
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Estudiantes</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {loading ? "..." : kpis.totalEstudiantes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Estudiantes Activos</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {loading ? "..." : kpis.estudiantesActivos}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Entrevistas del Mes</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {loading ? "..." : kpis.entrevistasMes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Intervenciones del Mes</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {loading ? "..." : kpis.intervencionesMes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Promedio Asistencia</p>
                    <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                      {loading ? "..." : `${kpis.promedioAsistencia}%`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-teal-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-teal-600 dark:text-teal-400">Recursos Entregados</p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {loading ? "..." : kpis.recursosEntregados}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "estudiantes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reporte de Estudiantes
              </h2>
              <button
                onClick={() => cargarDatos("estudiantes")}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Cargar Datos"}
              </button>
            </div>

            {data.estudiantes && data.estudiantes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">RUT</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Curso</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Promedio</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Asistencia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entrevistas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {data.estudiantes.map((estudiante, index) => (
                      <tr key={estudiante.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {estudiante.nombre} {estudiante.apellido}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{estudiante.rut}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{estudiante.curso}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            estudiante.estado === 'activo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : estudiante.estado === 'inactivo'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {estudiante.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {estudiante.promedio_general || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {estudiante.asistencia_porcentaje ? `${estudiante.asistencia_porcentaje}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {estudiante.entrevistas_count || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {loading ? "Cargando datos..." : "No hay datos disponibles. Aplica filtros y carga los datos."}
              </div>
            )}
          </div>
        )}

        {activeTab === "institucional" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reporte Institucional por Curso
              </h2>
              <button
                onClick={() => cargarDatos("institucional")}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Cargar Datos"}
              </button>
            </div>

            {data.institucional && data.institucional.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Curso</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Activos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Inactivos</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Prom. Asistencia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Entrevistas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Intervenciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {data.institucional.map((curso, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{curso.curso}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{curso.total_estudiantes}</td>
                        <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">{curso.estudiantes_activos}</td>
                        <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{curso.estudiantes_inactivos}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {curso.promedio_asistencia ? `${curso.promedio_asistencia}%` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{curso.entrevistas_realizadas}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{curso.intervenciones_activas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {loading ? "Cargando datos..." : "No hay datos disponibles. Carga los datos para ver el reporte institucional."}
              </div>
            )}
          </div>
        )}

        {activeTab === "asistencia" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Reporte de Asistencia
              </h2>
              <button
                onClick={() => cargarDatos("asistencia")}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Cargando..." : "Cargar Datos"}
              </button>
            </div>

            {data.asistencia && data.asistencia.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Curso</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">% Asistencia</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Días Presentes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Días Ausentes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {data.asistencia.map((estudiante, index) => (
                      <tr key={estudiante.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {estudiante.nombre} {estudiante.apellido}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{estudiante.curso}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            estudiante.estado === 'activo' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {estudiante.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${
                            estudiante.asistencia_porcentaje >= 90 
                              ? 'text-green-600 dark:text-green-400'
                              : estudiante.asistencia_porcentaje >= 80
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {estudiante.asistencia_porcentaje}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{estudiante.dias_presentes}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{estudiante.dias_ausentes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {loading ? "Cargando datos..." : "No hay datos disponibles. Aplica filtros y carga los datos."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
