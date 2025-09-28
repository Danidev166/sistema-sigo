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
import { Settings } from "lucide-react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { InstitutionalHeader } from "../../../components/headers/InstitutionalHeader";
import SystemStats from "../components/SystemStats";
import AdminTools from "../components/AdminTools";
import EmailConfig from "../components/EmailConfig";
import RolesManager from "../components/RolesManager";
import InstitucionalForm from "../components/InstitucionalForm";
import PersonalizacionForm from "../components/PersonalizacionForm";
import PoliticasForm from "../components/PoliticasForm";

export default function ConfiguracionPage() {
  return (
    <ImprovedDashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8 pb-8">
        <InstitutionalHeader
          title="Central de Administración"
          subtitle="Panel de control del sistema"
          icon={Settings}
          variant="with-icon"
        />

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
    </ImprovedDashboardLayout>
  );
}
