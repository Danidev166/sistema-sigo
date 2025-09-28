/**
 * Página de gestión de alertas.
 *
 * Permite visualizar, crear, editar y eliminar alertas del sistema.
 * Integra tabla y modales para formularios y confirmaciones.
 *
 * @component
 * @returns {JSX.Element} Página de alertas
 *
 * @example
 * <Route path="/alertas" element={<AlertasPage />} />
 */
import { useEffect, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { TableHeader } from "../../../components/headers/InstitutionalHeader";
import alertaService from "../services/alertaService";
import { toast } from "react-hot-toast";
import AlertaTable from "../components/AlertaTable";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarAlertas = async () => {
    try {
      const res = await alertaService.getAlertas();
      setAlertas(res.data);
    } catch (err) {
      console.error("❌ Error al cargar alertas:", err);
      toast.error("Error al cargar alertas.");
    }
  };

  const handleGenerar = async () => {
    try {
      setLoading(true);
      await alertaService.generarAlertas();
      toast.success("Alertas generadas.");
      await cargarAlertas();
    } catch (err) {
      console.error("❌ Error al generar alertas:", err);
      toast.error("Error al generar alertas.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarResuelta = async (alerta) => {
    try {
      await alertaService.cambiarEstado(alerta.id, "Resuelta");
      toast.success(`Alerta marcada como Resuelta (estudiante: ${alerta.nombre} ${alerta.apellido})`);
      await cargarAlertas();
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      toast.error("Error al cambiar estado.");
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 md:px-8 pb-8">
        <TableHeader
          title="Gestión de Alertas"
          subtitle="Monitorea y gestiona las alertas del sistema"
          totalItems={alertas.length}
          actions={[
            {
              label: loading ? "Generando..." : "Regenerar Alertas",
              icon: loading ? RefreshCw : Bell,
              onClick: handleGenerar,
              disabled: loading,
              variant: "primary"
            }
          ]}
        />

        <AlertaTable
          alertas={alertas}
          onMarcarResuelta={handleMarcarResuelta}
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
