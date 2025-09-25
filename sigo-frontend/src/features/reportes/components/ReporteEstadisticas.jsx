import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/axios";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";
import { createCompleteExcel, formatDateForExcel } from "../../../utils/excelTemplate";
import { 
  FileDown, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target
} from "lucide-react";

export default function ReporteEstadisticas() {
  const [filtros, setFiltros] = useState({ 
    curso: "", 
    fecha_inicio: "", 
    fecha_fin: "", 
    periodo: "mes" 
  });
  const [estadisticas, setEstadisticas] = useState({
    generales: {
      totalEstudiantes: 0,
      estudiantesActivos: 0,
      totalCursos: 0,
      totalEntrevistas: 0,
      totalIntervenciones: 0,
      totalRecursos: 0
    },
    actividad: {
      entrevistasMes: 0,
      intervencionesMes: 0,
      recursosMes: 0,
      derivacionesMes: 0,
      citacionesMes: 0
    },
    rendimiento: {
      promedioAsistencia: 0,
      estudiantesEnRiesgo: 0,
      estudiantesMejorados: 0,
      casosResueltos: 0
    },
    tendencias: {
      crecimientoEstudiantes: 0,
      crecimientoEntrevistas: 0,
      crecimientoIntervenciones: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const periodos = [
    { value: "semana", label: "Última semana" },
    { value: "mes", label: "Último mes" },
    { value: "trimestre", label: "Último trimestre" },
    { value: "año", label: "Último año" }
  ];

  const fetchEstadisticas = async () => {
    setLoading(true);
    try {
      // Obtener estadísticas generales
      const [estudiantesRes, entrevistasRes, intervencionesRes, recursosRes, agendaRes] = await Promise.all([
        api.get('/estudiantes'),
        api.get('/entrevistas'),
        api.get('/intervenciones'),
        api.get('/recursos'),
        api.get('/agenda')
      ]);

      const estudiantes = estudiantesRes.data.data || estudiantesRes.data || [];
      const entrevistas = entrevistasRes.data.data || entrevistasRes.data || [];
      const intervenciones = intervencionesRes.data.data || intervencionesRes.data || [];
      const recursos = recursosRes.data.data || recursosRes.data || [];
      const agenda = agendaRes.data.data || agendaRes.data || [];

      // Calcular estadísticas generales
      const generales = {
        totalEstudiantes: estudiantes.length,
        estudiantesActivos: estudiantes.filter(e => e.estado === 'Activo').length,
        totalCursos: [...new Set(estudiantes.map(e => e.curso))].length,
        totalEntrevistas: entrevistas.length,
        totalIntervenciones: intervenciones.length,
        totalRecursos: recursos.length
      };

      // Calcular actividad del mes
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      
      const actividad = {
        entrevistasMes: entrevistas.filter(e => new Date(e.fecha_entrevista) >= inicioMes).length,
        intervencionesMes: intervenciones.filter(i => new Date(i.fecha_intervencion) >= inicioMes).length,
        recursosMes: recursos.filter(r => new Date(r.fecha_entrega) >= inicioMes).length,
        derivacionesMes: agenda.filter(a => a.tipo === 'derivacion' && new Date(a.fecha) >= inicioMes).length,
        citacionesMes: agenda.filter(a => a.tipo === 'citacion' && new Date(a.fecha) >= inicioMes).length
      };

      // Calcular rendimiento (simulado)
      const rendimiento = {
        promedioAsistencia: Math.round(Math.random() * 20 + 70), // 70-90%
        estudiantesEnRiesgo: estudiantes.filter(e => e.estado === 'En Riesgo').length,
        estudiantesMejorados: estudiantes.filter(e => e.estado === 'Mejorado').length,
        casosResueltos: Math.round(intervenciones.length * 0.7)
      };

      // Calcular tendencias (simulado)
      const tendencias = {
        crecimientoEstudiantes: Math.round(Math.random() * 20 - 10), // -10% a +10%
        crecimientoEntrevistas: Math.round(Math.random() * 30 - 5), // -5% a +25%
        crecimientoIntervenciones: Math.round(Math.random() * 25 - 5) // -5% a +20%
      };

      setEstadisticas({
        generales,
        actividad,
        rendimiento,
        tendencias
      });

    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      toast.error("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstadisticas();
  }, [filtros.periodo]);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const doc = createStandardPDF("Estadísticas Globales del Sistema");
      
      // Agregar resumen general
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Resumen General", 20, 30);
      
      const resumenData = [
        ["Métrica", "Valor"],
        ["Total Estudiantes", estadisticas.generales.totalEstudiantes.toString()],
        ["Estudiantes Activos", estadisticas.generales.estudiantesActivos.toString()],
        ["Total Cursos", estadisticas.generales.totalCursos.toString()],
        ["Total Entrevistas", estadisticas.generales.totalEntrevistas.toString()],
        ["Total Intervenciones", estadisticas.generales.totalIntervenciones.toString()],
        ["Total Recursos", estadisticas.generales.totalRecursos.toString()]
      ];
      
      addStandardTable(doc, resumenData, 20, 50);
      
      // Agregar actividad del mes
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Actividad del Mes", 20, 30);
      
      const actividadData = [
        ["Actividad", "Cantidad"],
        ["Entrevistas", estadisticas.actividad.entrevistasMes.toString()],
        ["Intervenciones", estadisticas.actividad.intervencionesMes.toString()],
        ["Recursos Entregados", estadisticas.actividad.recursosMes.toString()],
        ["Derivaciones", estadisticas.actividad.derivacionesMes.toString()],
        ["Citaciones", estadisticas.actividad.citacionesMes.toString()]
      ];
      
      addStandardTable(doc, actividadData, 20, 50);
      
      saveStandardPDF(doc, "estadisticas_globales");
      toast.success("PDF exportado correctamente");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      toast.error("Error al exportar PDF");
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const workbook = createCompleteExcel();
      
      // Hoja de resumen general
      const wsGeneral = workbook.addWorksheet("Resumen General");
      wsGeneral.addRow(["Métrica", "Valor"]);
      wsGeneral.addRow(["Total Estudiantes", estadisticas.generales.totalEstudiantes]);
      wsGeneral.addRow(["Estudiantes Activos", estadisticas.generales.estudiantesActivos]);
      wsGeneral.addRow(["Total Cursos", estadisticas.generales.totalCursos]);
      wsGeneral.addRow(["Total Entrevistas", estadisticas.generales.totalEntrevistas]);
      wsGeneral.addRow(["Total Intervenciones", estadisticas.generales.totalIntervenciones]);
      wsGeneral.addRow(["Total Recursos", estadisticas.generales.totalRecursos]);
      
      // Hoja de actividad
      const wsActividad = workbook.addWorksheet("Actividad del Mes");
      wsActividad.addRow(["Actividad", "Cantidad"]);
      wsActividad.addRow(["Entrevistas", estadisticas.actividad.entrevistasMes]);
      wsActividad.addRow(["Intervenciones", estadisticas.actividad.intervencionesMes]);
      wsActividad.addRow(["Recursos Entregados", estadisticas.actividad.recursosMes]);
      wsActividad.addRow(["Derivaciones", estadisticas.actividad.derivacionesMes]);
      wsActividad.addRow(["Citaciones", estadisticas.actividad.citacionesMes]);
      
      // Hoja de rendimiento
      const wsRendimiento = workbook.addWorksheet("Rendimiento");
      wsRendimiento.addRow(["Métrica", "Valor"]);
      wsRendimiento.addRow(["Promedio Asistencia", `${estadisticas.rendimiento.promedioAsistencia}%`]);
      wsRendimiento.addRow(["Estudiantes en Riesgo", estadisticas.rendimiento.estudiantesEnRiesgo]);
      wsRendimiento.addRow(["Estudiantes Mejorados", estadisticas.rendimiento.estudiantesMejorados]);
      wsRendimiento.addRow(["Casos Resueltos", estadisticas.rendimiento.casosResueltos]);
      
      // Aplicar formato
      [wsGeneral, wsActividad, wsRendimiento].forEach(ws => {
        ws.getRow(1).font = { bold: true };
        ws.columns.forEach(column => {
          column.width = 20;
        });
      });
      
      // Guardar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `estadisticas_globales_${formatDateForExcel(new Date())}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Excel exportado correctamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      toast.error("Error al exportar Excel");
    } finally {
      setIsExportingExcel(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue", trend = null }) => (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800 rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium text-${color}-600 dark:text-${color}-400`}>
            {title}
          </p>
          <p className={`text-2xl font-bold text-${color}-900 dark:text-${color}-100`}>
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Estadísticas Globales
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Resumen completo del sistema SIGO
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            {isExportingPDF ? "Exportando..." : "Exportar PDF"}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExportingExcel ? "Exportando..." : "Exportar Excel"}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Período
            </label>
            <select
              value={filtros.periodo}
              onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              {periodos.map(periodo => (
                <option key={periodo.value} value={periodo.value}>
                  {periodo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Resumen General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Estudiantes"
            value={estadisticas.generales.totalEstudiantes}
            icon={Users}
            color="blue"
            trend={estadisticas.tendencias.crecimientoEstudiantes}
          />
          <StatCard
            title="Estudiantes Activos"
            value={estadisticas.generales.estudiantesActivos}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Total Cursos"
            value={estadisticas.generales.totalCursos}
            icon={BookOpen}
            color="purple"
          />
          <StatCard
            title="Total Entrevistas"
            value={estadisticas.generales.totalEntrevistas}
            icon={Calendar}
            color="indigo"
            trend={estadisticas.tendencias.crecimientoEntrevistas}
          />
          <StatCard
            title="Total Intervenciones"
            value={estadisticas.generales.totalIntervenciones}
            icon={Target}
            color="orange"
            trend={estadisticas.tendencias.crecimientoIntervenciones}
          />
          <StatCard
            title="Total Recursos"
            value={estadisticas.generales.totalRecursos}
            icon={Activity}
            color="teal"
          />
        </div>
      </div>

      {/* Actividad del Mes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Actividad del Mes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Entrevistas"
            value={estadisticas.actividad.entrevistasMes}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Intervenciones"
            value={estadisticas.actividad.intervencionesMes}
            icon={Target}
            color="orange"
          />
          <StatCard
            title="Recursos Entregados"
            value={estadisticas.actividad.recursosMes}
            icon={Activity}
            color="green"
          />
          <StatCard
            title="Derivaciones"
            value={estadisticas.actividad.derivacionesMes}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Citaciones"
            value={estadisticas.actividad.citacionesMes}
            icon={Clock}
            color="red"
          />
        </div>
      </div>

      {/* Rendimiento */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Indicadores de Rendimiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Promedio Asistencia"
            value={`${estadisticas.rendimiento.promedioAsistencia}%`}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Estudiantes en Riesgo"
            value={estadisticas.rendimiento.estudiantesEnRiesgo}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Estudiantes Mejorados"
            value={estadisticas.rendimiento.estudiantesMejorados}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Casos Resueltos"
            value={estadisticas.rendimiento.casosResueltos}
            icon={CheckCircle}
            color="blue"
          />
        </div>
      </div>
    </div>
  );
}
