// src/features/dashboard/services/dashboardService.js
import api from "../../../services/axios";
import estudianteService from "../../estudiantes/services/estudianteService";

const dashboardService = {
  getResumen: async () => {
    try {
      // 🚀 Obtener estudiantes
      const est = await estudianteService.getEstudiantes();
      // Debug log removido para producción

      // 🚀 Filtrar "activos"
      const estudiantesActivos = est.data.filter(
        (e) => e.estado && e.estado.toLowerCase() === "activo"
      );
      // Debug log removido para producción

      // 🚀 Obtener entrevistas (SIN CACHE)
      const ent = await api.get("/entrevistas", {
        headers: { "Cache-Control": "no-cache" },
      });
      // Debug log removido para producción

      // 🚀 Obtener alertas
      const alertasRes = await api.get("/alertas", {
        headers: { "Cache-Control": "no-cache" },
      });
      const totalAlertas = alertasRes.data.filter((a) => a.estado === "Nueva").length;
      // Debug log removido para producción

      // 🚀 Obtener entrevistas por mes
      const entrevistasPorMesResp = await api.get("/entrevistas/por-mes");
      const entrevistasPorMes = entrevistasPorMesResp.data;
      // Debug log removido para producción

      // 🚀 Obtener tests por especialidad
      const testPorEspecialidadResp = await api.get("/evaluaciones/por-especialidad");
      const testPorEspecialidadRaw = testPorEspecialidadResp.data;

      // 🚀 Formatear como lo espera TestBarChart
      const especialidades = {};
      testPorEspecialidadRaw.forEach((row) => {
        if (!especialidades[row.especialidad]) {
          especialidades[row.especialidad] = {
            especialidad: row.especialidad,
            Kuder: 0,
            Holland: 0,
            Aptitudes: 0,
          };
        }
        if (row.tipo_evaluacion === "Kuder") {
          especialidades[row.especialidad].Kuder += row.total;
        } else if (row.tipo_evaluacion === "Holland") {
          especialidades[row.especialidad].Holland += row.total;
        } else if (row.tipo_evaluacion === "Aptitudes") {
          especialidades[row.especialidad].Aptitudes += row.total;
        }
      });

      const testPorEspecialidad = Object.values(especialidades);
      // Debug log removido para producción

      // 🚀 Devolver datos al Dashboard
      return {
        estudiantes: estudiantesActivos.length,
        entrevistas: ent.data.length,
        alertas: totalAlertas, // ✅ AHORA ES REAL
        entrevistasPorMes,
        testPorEspecialidad,
      };
    } catch (error) {
      console.error("Error en dashboardService.getResumen:", error);
      return {
        estudiantes: 0,
        entrevistas: 0,
        alertas: 0,
        entrevistasPorMes: [],
        testPorEspecialidad: [],
      };
    }
  },

  // 🚀 Método para generar reporte PDF
  generarReportePDF: async () => {
    return await api.get("/reportes/generar-pdf", {
      responseType: "blob",
    });
  },
};

export default dashboardService;
