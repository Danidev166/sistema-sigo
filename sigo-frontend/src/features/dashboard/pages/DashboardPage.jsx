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
import DashboardLayout from "../../../components/layout/DashboardLayout";
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
    const data = await dashboardService.getResumen();
    return {
      estudiantes: data.estudiantes || 0,
      entrevistas: data.entrevistas || 0,
      alertas: data.alertas || 0,
      entrevistasPorMes: data.entrevistasPorMes || [],
      testPorEspecialidad: data.testPorEspecialidad || [],
    };
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
      <DashboardLayout>
        <div className="p-4 sm:p-6 text-gray-600 text-sm sm:text-base">
          Cargando datos del dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (statsError) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 text-red-500 text-sm sm:text-base">
          Error al cargar los datos del dashboard.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="px-4 sm:px-6 md:px-8 space-y-6 pb-8">
        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <OptimizedSummaryCard
            title="Estudiantes"
            value={stats.estudiantes}
            icon={<UsersIcon size={24} className="sm:w-7 sm:h-7" />}
            color="blue"
          />
          <OptimizedSummaryCard
            title="Entrevistas"
            value={stats.entrevistas}
            icon={<CalendarCheckIcon size={24} className="sm:w-7 sm:h-7" />}
            color="green"
          />
          <OptimizedSummaryCard
            title="Alertas"
            value={stats.alertas}
            icon={<BellIcon size={24} className="sm:w-7 sm:h-7" />}
            color="red"
          />
        </div>

        {/* Gráficos y panel de acciones */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="overflow-x-auto rounded-lg sm:rounded-xl">
              <EntrevistasLineChart data={processedChartData.entrevistasPorMes} />
            </div>
            <div className="overflow-x-auto rounded-lg sm:rounded-xl">
              <TestBarChart data={processedChartData.testPorEspecialidad} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <QuickActionsPanelV2 onGenerarPDF={handleGenerarPDF} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
