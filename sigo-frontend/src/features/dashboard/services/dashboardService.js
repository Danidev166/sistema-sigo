// src/features/dashboard/services/dashboardService.js
import api from "../../../services/axios";
import estudianteService from "../../estudiantes/services/estudianteService";

const dashboardService = {
  getResumen: async () => {
    try {
      console.log("🔄 DashboardService: Iniciando carga de datos...");
      
      // 🚀 OPTIMIZACIÓN: Hacer todas las llamadas en paralelo
      console.log("🔄 DashboardService: Ejecutando llamadas paralelas...");
      
      const [
        estudiantesRes,
        entrevistasRes,
        alertasRes,
        entrevistasPorMesRes,
        testPorEspecialidadRes
      ] = await Promise.allSettled([
        // Obtener estudiantes
        estudianteService.getEstudiantes(),
        // Obtener entrevistas (SIN CACHE)
        api.get("/entrevistas", {
          headers: { "Cache-Control": "no-cache" },
        }),
        // Obtener alertas
        api.get("/alertas", {
          headers: { "Cache-Control": "no-cache" },
        }),
        // Obtener entrevistas por mes (con fallback)
        api.get("/entrevistas/por-mes").catch(async (error) => {
          if (error.status === 401 || error.status === 403) {
            console.log("⚠️ Usando endpoint de prueba para entrevistas");
            return await api.get("/entrevistas/por-mes-test");
          }
          throw error;
        }),
        // Obtener tests por especialidad (con fallback)
        api.get("/evaluaciones/por-especialidad").catch(async (error) => {
          if (error.status === 401 || error.status === 403) {
            console.log("⚠️ Usando endpoint de prueba para evaluaciones");
            return await api.get("/evaluaciones/por-especialidad-test");
          }
          throw error;
        })
      ]);

      console.log("✅ DashboardService: Todas las llamadas completadas");

      // 🚀 Procesar estudiantes
      let estudiantes = [];
      if (estudiantesRes.status === 'fulfilled') {
        const est = estudiantesRes.value;
        estudiantes = est.data?.data || est.data || [];
        console.log("✅ DashboardService: Estudiantes obtenidos:", estudiantes.length);
      } else {
        console.warn("⚠️ DashboardService: Error obteniendo estudiantes:", estudiantesRes.reason);
      }
      
      // 🚀 Filtrar estudiantes activos
      const estudiantesActivos = estudiantes.filter(
        (e) => e.estado && e.estado.toLowerCase() === "activo"
      );
      console.log("✅ DashboardService: Estudiantes activos:", estudiantesActivos.length);

      // 🚀 Procesar entrevistas
      let entrevistas = [];
      if (entrevistasRes.status === 'fulfilled') {
        entrevistas = entrevistasRes.value.data || [];
        console.log("✅ DashboardService: Entrevistas obtenidas:", entrevistas.length);
      } else {
        console.warn("⚠️ DashboardService: Error obteniendo entrevistas:", entrevistasRes.reason);
      }

      // 🚀 Procesar alertas
      let totalAlertas = 0;
      if (alertasRes.status === 'fulfilled') {
        const alertas = alertasRes.value.data || [];
        totalAlertas = alertas.filter((a) => a.estado === "Nueva").length;
        console.log("✅ DashboardService: Alertas nuevas:", totalAlertas);
      } else {
        console.warn("⚠️ DashboardService: Error obteniendo alertas:", alertasRes.reason);
      }

      // 🚀 Procesar entrevistas por mes
      const entrevistasPorMes = entrevistasPorMesRes.status === 'fulfilled' 
        ? (entrevistasPorMesRes.value.data || [])
        : [];
      console.log("📊 DashboardService: Entrevistas por mes:", entrevistasPorMes.length);

      // 🚀 Procesar tests por especialidad
      const testPorEspecialidadRaw = testPorEspecialidadRes.status === 'fulfilled' 
        ? (testPorEspecialidadRes.value.data || [])
        : [];
      console.log("📊 DashboardService: Tests por especialidad raw:", testPorEspecialidadRaw.length);

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
      console.log("📊 DashboardService: Tests por especialidad procesados:", testPorEspecialidad.length);

      // 🚀 Devolver datos al Dashboard
      const result = {
        estudiantes: estudiantesActivos.length,
        entrevistas: entrevistas.length,
        alertas: totalAlertas,
        entrevistasPorMes,
        testPorEspecialidad,
      };

      console.log("✅ DashboardService: Datos procesados exitosamente");
      return result;
    } catch (error) {
      console.error("❌ Error en dashboardService.getResumen:", error);
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