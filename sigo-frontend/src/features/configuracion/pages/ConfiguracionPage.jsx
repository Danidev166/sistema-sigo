/**
 * Página de configuración del sistema.
 *
 * Central de administración con estadísticas, herramientas y configuraciones.
 * Integra múltiples componentes de administración del sistema.
 *
 * @component
 * @returns {JSX.Element} Página de configuración
 *
 * @example
 * <Route path="/configuracion" element={<ConfiguracionPage />} />
 */
import DashboardLayout from "../../../components/layout/DashboardLayout";
import SystemStats from "../components/SystemStats";
import AdminTools from "../components/AdminTools";
import EmailConfig from "../components/EmailConfig";
import RolesManager from "../components/RolesManager";
import InstitucionalForm from "../components/InstitucionalForm";
import PersonalizacionForm from "../components/PersonalizacionForm";
import PoliticasForm from "../components/PoliticasForm";

export default function ConfiguracionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            🛠️ Central de Administración
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Panel de control del sistema
          </div>
        </div>

        {/* Estadísticas del sistema */}
        <SystemStats />

        {/* Herramientas de administración */}
        <AdminTools />

        {/* Configuración de email */}
        <EmailConfig />

        {/* Configuraciones básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Institucional */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
            <InstitucionalForm />
          </div>

          {/* Personalización */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow">
            <PersonalizacionForm />
          </div>

          {/* Políticas de seguridad */}
          <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow md:col-span-2">
            <PoliticasForm />
          </div>

          {/* Gestión de roles y permisos */}
          <div className="md:col-span-2">
            <RolesManager />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
