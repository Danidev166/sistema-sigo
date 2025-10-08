/**
 * Página de seguimiento psicosocial de estudiantes.
 *
 * Permite visualizar, crear y gestionar seguimientos psicosociales.
 * Integra tabla y modales para formularios.
 *
 * @component
 * @returns {JSX.Element} Página de seguimiento psicosocial
 *
 * @example
 * <Route path="/seguimiento-psicosocial" element={<SeguimientoPsicosocialPage />} />
 */
// src/features/seguimiento/pages/SeguimientoPsicosocialPage.jsx
import { useEffect, useState } from "react";
import { UserCog, Plus } from "lucide-react";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import { TableHeader } from "../../../components/headers/InstitutionalHeader";
import seguimientoPsicosocialService from "../services/seguimientoPsicosocialService";
import estudianteService from "../../estudiantes/services/estudianteService";
import SeguimientoTable from "../components/SeguimientoTable";
import SeguimientoPsicosocialFormModal from "../components/SeguimientoPsicosocialFormModal";
import { toast } from "react-hot-toast";

export default function SeguimientoPsicosocialPage() {
  const [seguimientos, setSeguimientos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const cargarSeguimientos = async () => {
    try {
      setLoading(true);
      const res = await seguimientoPsicosocialService.getSeguimientos();
      console.log("🔍 Debug - Respuesta completa:", res);
      console.log("🔍 Debug - res.data:", res.data);
      console.log("🔍 Debug - Tipo de res.data:", typeof res.data);
      console.log("🔍 Debug - Es array:", Array.isArray(res.data));
      
      // Asegurar que siempre sea un array
      const datos = Array.isArray(res.data) ? res.data : [];
      console.log("🔍 Debug - Datos finales:", datos);
      setSeguimientos(datos);
    } catch (err) {
      console.error("Error al cargar seguimientos:", err);
      toast.error("Error al cargar seguimientos.");
      setSeguimientos([]); // Asegurar que sea un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      const res = await estudianteService.getEstudiantes();
      setEstudiantes(res.data);
    } catch (err) {
      console.error("❌ Error al cargar estudiantes:", err);
      toast.error("Error al cargar estudiantes.");
    }
  };

  const handleGuardar = async (data) => {
    try {
      if (editData) {
        await seguimientoPsicosocialService.actualizarSeguimiento(editData.id, data);
        toast.success("Seguimiento actualizado.");
      } else {
        await seguimientoPsicosocialService.crearSeguimiento(data);
        toast.success("Seguimiento registrado.");
      }
      setModalOpen(false);
      setEditData(null);
      await cargarSeguimientos();
    } catch (err) {
      console.error("❌ Error al guardar seguimiento:", err);
      toast.error("Error al guardar seguimiento.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este seguimiento?")) return;
    try {
      await seguimientoPsicosocialService.eliminarSeguimiento(id);
      toast.success("Seguimiento eliminado.");
      await cargarSeguimientos();
    } catch (err) {
      console.error("❌ Error al eliminar seguimiento:", err);
      toast.error("Error al eliminar seguimiento.");
    }
  };

  useEffect(() => {
    console.log("🔍 Debug - useEffect ejecutándose");
    cargarSeguimientos();
    cargarEstudiantes();
  }, []);

  // Debug del estado
  useEffect(() => {
    console.log("🔍 Debug - Estado actualizado:", {
      seguimientos: seguimientos.length,
      estudiantes: estudiantes.length,
      loading,
      modalOpen
    });
  }, [seguimientos, estudiantes, loading, modalOpen]);

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 pb-8">
        <TableHeader
          title="Seguimientos Psicosociales"
          subtitle="Gestiona el seguimiento psicosocial de los estudiantes"
          totalItems={seguimientos.length}
          actions={[
            {
              label: "Nuevo Seguimiento",
              icon: Plus,
              onClick: () => {
                setEditData(null);
                setModalOpen(true);
              },
              variant: "primary"
            }
          ]}
        />

        <SeguimientoTable
          seguimientos={seguimientos}
          onEdit={(s) => {
            setEditData(s);
            setModalOpen(true);
          }}
          onDelete={(s) => handleEliminar(s.id)}
        />

        <SeguimientoPsicosocialFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSubmit={handleGuardar}
          initialData={editData}
          estudiantes={estudiantes}
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
