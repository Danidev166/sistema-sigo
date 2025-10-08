/**
 * Página principal del dashboard.
 *
 * Muestra estadísticas generales y acceso rápido a funcionalidades.
 * Integra componentes específicos según el rol del usuario.
 *
 * @component
 * @returns {JSX.Element} Página del dashboard
 *
 * @example
 * <Route path="/dashboard" element={<DashboardPage />} />
 */
import { useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { useCache } from "../../../hooks/useCache";

import OptimizedSummaryCard from "../components/OptimizedSummaryCard";
import EntrevistasLineChart from "../components/EntrevistasLineChart";
import TestBarChart from "../components/TestBarChart";
import QuickActionsPanelV2 from "../components/QuickActionsPanelV2";
import DashboardHeader from '../components/DashboardHeader';

import {
  UsersIcon,
  CalendarCheckIcon,
  BellIcon,
} from "lucide-react";

import dashboardService from "../services/dashboardService";

export default function DashboardPageFinal() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirigir al Asistente Social a su dashboard específico
  useEffect(() => {
    if (user && user.rol === "AsistenteSocial") {
      navigate("/dashboard-asistente-social", { replace: true });
    }
  }, [user, navigate]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      console.log("🔄 Cargando datos del dashboard...");
      const data = await dashboardService.getResumen();
      console.log("✅ Datos del dashboard cargados:", data);
      return {
        estudiantes: data.estudiantes || 0,
        entrevistas: data.entrevistas || 0,
        alertas: data.alertas || 0,
        entrevistasPorMes: data.entrevistasPorMes || [],
        testPorEspecialidad: data.testPorEspecialidad || [],
      };
    } catch (error) {
      console.error("❌ Error al cargar datos del dashboard:", error);
      // Devolver datos por defecto en caso de error
      return {
        estudiantes: 0,
        entrevistas: 0,
        alertas: 0,
        entrevistasPorMes: [],
        testPorEspecialidad: [],
      };
    }
  }, []);

  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
  } = useCache("dashboard_stats", fetchDashboardStats, 5 * 60 * 1000);

  const handleGenerarPDF = useCallback(async () => {
    try {
      const response = await dashboardService.generarReportePDF();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte-sigo.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
    }
  }, []);

  const processedChartData = useMemo(() => {
    if (!stats) return { entrevistasPorMes: [], testPorEspecialidad: [] };
    return {
      entrevistasPorMes: stats.entrevistasPorMes,
      testPorEspecialidad: stats.testPorEspecialidad,
    };
  }, [stats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700 text-sm sm:text-base">
        Cargando información...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 text-sm sm:text-base">
        No se pudo cargar el usuario.
      </div>
    );
  }

  if (loadingStats) {
    return (
      <ImprovedDashboardLayout>
        <div className="px-6 py-8 space-y-6">
          {/* Skeleton para tarjetas de resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl shadow-md bg-gray-200 dark:bg-gray-700 p-6 flex justify-between items-center animate-pulse">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            ))}
          </div>
          
          {/* Skeleton para gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ImprovedDashboardLayout>
    );
  }

  if (statsError) {
    return (
      <ImprovedDashboardLayout>
        <div className="p-4 sm:p-6 text-red-500 text-sm sm:text-base">
          Error al cargar los datos del dashboard.
        </div>
      </ImprovedDashboardLayout>
    );
  }

  return (
    <ImprovedDashboardLayout>
      <DashboardHeader />
      <div className="px-6 py-8 space-y-8 animate-fade-in">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <OptimizedSummaryCard
            title="Estudiantes"
            value={stats.estudiantes}
            icon={<UsersIcon size={28} className="w-7 h-7" />}
            color="blue"
            loading={loadingStats}
          />
          <OptimizedSummaryCard
            title="Entrevistas"
            value={stats.entrevistas}
            icon={<CalendarCheckIcon size={28} className="w-7 h-7" />}
            color="green"
            loading={loadingStats}
          />
          <OptimizedSummaryCard
            title="Alertas"
            value={stats.alertas}
            icon={<BellIcon size={28} className="w-7 h-7" />}
            color="red"
            loading={loadingStats}
          />
        </div>

        {/* Gráficos y panel de acciones */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <EntrevistasLineChart data={processedChartData.entrevistasPorMes} />
            </div>
            <div className="overflow-x-auto rounded-xl shadow-lg">
              <TestBarChart data={processedChartData.testPorEspecialidad} />
            </div>
          </div>

          <div className="xl:col-span-1">
            <QuickActionsPanelV2 
              onGenerarPDF={handleGenerarPDF}
              loading={loadingStats}
              error={statsError}
              userRole={user?.rol}
            />
          </div>
        </div>
      </div>
    </ImprovedDashboardLayout>
  );
}
