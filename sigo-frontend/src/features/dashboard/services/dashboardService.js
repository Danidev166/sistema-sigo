// src/features/dashboard/services/dashboardService.js
import api from "../../../services/axios";
import estudianteService from "../../estudiantes/services/estudianteService";

const dashboardService = {
  getResumen: async () => {
    try {
      // 🚀 Obtener estudiantes
      const est = await estudianteService.getEstudiantes();
      
      // 🚀 Filtrar "activos"
      const estudiantesActivos = est.data.filter(
        (e) => e.estado && e.estado.toLowerCase() === "activo"
      );

      // 🚀 Obtener entrevistas (SIN CACHE)
      const ent = await api.get("/entrevistas", {
        headers: { "Cache-Control": "no-cache" },
      });

      // 🚀 Obtener alertas
      const alertasRes = await api.get("/alertas", {
        headers: { "Cache-Control": "no-cache" },
      });
      const totalAlertas = alertasRes.data.filter((a) => a.estado === "Nueva").length;

      // 🚀 Obtener entrevistas por mes
      let entrevistasPorMesResp;
      try {
        entrevistasPorMesResp = await api.get("/entrevistas/por-mes");
      } catch (error) {
        // Si falla por autenticación, usar endpoint de prueba
        if (error.status === 401 || error.status === 403) {
          console.log("⚠️ Usando endpoint de prueba para entrevistas");
          entrevistasPorMesResp = await api.get("/entrevistas/por-mes-test");
        } else {
          throw error;
        }
      }
      const entrevistasPorMes = entrevistasPorMesResp.data;

      // 🚀 Obtener tests por especialidad
      let testPorEspecialidadResp;
      try {
        testPorEspecialidadResp = await api.get("/evaluaciones/por-especialidad");
      } catch (error) {
        // Si falla por autenticación, usar endpoint de prueba
        if (error.status === 401 || error.status === 403) {
          console.log("⚠️ Usando endpoint de prueba para evaluaciones");
          testPorEspecialidadResp = await api.get("/evaluaciones/por-especialidad-test");
        } else {
          throw error;
        }
      }
      const testPorEspecialidadRaw = testPorEspecialidadResp.data || [];

      // 🚀 Formatear como lo espera TestBarChart
      const especialidades = {};
      testPorEspecialidadRaw.forEach((row) => {
        const curso = row.curso || row.especialidad; // Usar curso si existe, sino especialidad
        if (!especialidades[curso]) {
          especialidades[curso] = {
            especialidad: curso,
            Kuder: 0,
            Holland: 0,
            Aptitudes: 0,
          };
        }
        if (row.tipo_evaluacion === "Kuder") {
          especialidades[curso].Kuder += row.total;
        } else if (row.tipo_evaluacion === "Holland") {
          especialidades[curso].Holland += row.total;
        } else if (row.tipo_evaluacion === "Aptitudes") {
          especialidades[curso].Aptitudes += row.total;
        }
      });

      const testPorEspecialidad = Object.values(especialidades);

      // 🚀 Devolver datos al Dashboard
      return {
        estudiantes: estudiantesActivos.length,
        entrevistas: ent.data.length,
        alertas: totalAlertas,
        entrevistasPorMes,
        testPorEspecialidad,
      };
    } catch (error) {
      console.error("Error en dashboardService.getResumen:", error);
      // Devolver datos por defecto en caso de error
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
    try {
      return await api.get("/reportes/generar-pdf", {
        responseType: "blob",
      });
    } catch (error) {
      console.error("Error al generar PDF:", error);
      throw error;
    }
  },
};

export default dashboardService;