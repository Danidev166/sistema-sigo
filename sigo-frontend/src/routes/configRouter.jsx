// src/routes/configRouter.jsx
import { lazy } from 'react';

// Lazy loading para todas las páginas
const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const UsuariosPage = lazy(() => import("../features/usuarios/pages/UsuariosPage"));
const EstudiantesPage = lazy(() => import("../features/estudiantes/pages/EstudiantesPage"));
const EstudianteDetalle = lazy(() => import("../features/estudiantes/pages/EstudianteDetalle"));
const AgendaPage = lazy(() => import("../features/agenda/pages/AgendaPage"));
const ReportesPage = lazy(() => import("../features/reportes/pages/ReportesPage"));
const EvaluacionesPage = lazy(() => import("../features/test-vocacionales/pages/EvaluacionesVocacionalesPage"));
const KuderTest = lazy(() => import("../features/test-vocacionales/pages/KuderTest"));
const HollandTest = lazy(() => import("../features/test-vocacionales/pages/HollandTest"));
const AptitudesTest = lazy(() => import("../features/test-vocacionales/pages/AptitudesTest"));
const TablaResultadosEvaluacion = lazy(() => import("../features/test-vocacionales/components/TablaResultadosEvaluacion"));
const MobileTestPage = lazy(() => import("../features/test-vocacionales/pages/MobileTestPage"));
const TestMobilePage = lazy(() => import("../features/test-vocacionales/pages/TestMobilePage"));
const RecursosPage = lazy(() => import("../features/recursos/pages/RecursosPage"));
const MovimientosPage = lazy(() => import("../features/recursos/pages/MovimientosPage"));
const EntregasPage = lazy(() => import("../features/recursos/pages/EntregasPage"));
const ConfiguracionPage = lazy(() => import("../features/configuracion/pages/ConfiguracionPage"));
const AlertasPage = lazy(() => import("../features/alertas/pages/AlertasPage"));
const SeguimientoPsicosocialPage = lazy(() => import("../features/seguimiento-psicosocial/pages/SeguimientoPsicosocialPage"));
const RecuperarPasswordPage = lazy(() => import("../features/auth/pages/RecuperarPasswordPage"));
const VerificarCodigoPage = lazy(() => import("../features/auth/pages/VerificarCodigoPage"));
const DashboardAsistenteSocialPage = lazy(() => import("../features/dashboard/pages/DashboardAsistenteSocialPage"));
const LogsPage = lazy(() => import("../features/logs/pages/LogsPage"));
const PlantillasReportesPage = lazy(() => import("../features/reportes/pages/PlantillasReportesPage"));

// 🔓 Rutas públicas
export const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/recuperar", element: <RecuperarPasswordPage /> },
  { path: "/verificar-codigo", element: <VerificarCodigoPage /> },
  // Rutas móviles para test vocacionales (acceso público via QR)
  { path: "/test-mobile/:testType", element: <TestMobilePage /> }
];

// 🔒 Rutas privadas (con control de roles)
export const privateRoutes = [
  { path: "/dashboard", element: <DashboardPage />, roles: ["Admin", "Orientador", "AsistenteSocial"] },
  { path: "/dashboard-asistente-social", element: <DashboardAsistenteSocialPage />, roles: ["AsistenteSocial"] },
  { path: "/usuarios", element: <UsuariosPage />, roles: ["Admin"] },
  { path: "/estudiantes", element: <EstudiantesPage />, roles: ["Admin", "Orientador"] },
  { path: "/estudiantes/:id", element: <EstudianteDetalle />, roles: ["Admin", "Orientador"] },
  { path: "/agenda", element: <AgendaPage />, roles: ["Admin", "Orientador"] },
  { path: "/reportes", element: <ReportesPage />, roles: ["Admin", "Orientador"] },
  { path: "/reportes/plantillas", element: <PlantillasReportesPage />, roles: ["Admin", "Orientador"] },
  { path: "/evaluaciones", element: <EvaluacionesPage />, roles: ["Admin", "Orientador"] },
  { path: "/evaluaciones/kuder", element: <KuderTest />, roles: ["Admin", "Orientador"] },
  { path: "/evaluaciones/holland", element: <HollandTest />, roles: ["Admin", "Orientador"] },
  { path: "/evaluaciones/aptitudes", element: <AptitudesTest />, roles: ["Admin", "Orientador"] },
  { path: "/evaluaciones/resultados/:id", element: <TablaResultadosEvaluacion />, roles: ["Admin", "Orientador"] },
  { path: "/recursos", element: <RecursosPage />, roles: ["Admin", "Orientador"] },
  { path: "/movimientos", element: <MovimientosPage />, roles: ["Admin", "Orientador"] },
  { path: "entregas", element: <EntregasPage />, roles: ["Admin", "Orientador"] },
  { path: "/configuracion", element: <ConfiguracionPage />, roles: ["Admin"] },
  { path: "/alertas", element: <AlertasPage />, roles: ["Admin"] },
  { path: "/seguimiento-psicosocial", element: <SeguimientoPsicosocialPage />, roles: ["Admin", "Orientador"] },
  { path: "/logs", element: <LogsPage />, roles: ["Admin"] },
];

// Página 404
export const fallbackRoute = {
  path: "*",
  element: <NotFoundPage />
};
