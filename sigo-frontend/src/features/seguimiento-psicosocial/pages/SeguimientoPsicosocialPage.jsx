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
import DashboardLayout from "../../../components/layout/DashboardLayout";
import seguimientoPsicosocialService from "../services/seguimientoPsicosocialService";
import estudianteService from "../../estudiantes/services/estudianteService";
import SeguimientoTable from "../components/SeguimientoTable";
import SeguimientoPsicosocialFormModal from "../components/SeguimientoPsicosocialFormModal";
import { toast } from "react-toastify";

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
      setSeguimientos(res.data);
    } catch (err) {
      console.error("❌ Error al cargar seguimientos:", err);
      toast.error("Error al cargar seguimientos.");
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
    cargarSeguimientos();
    cargarEstudiantes();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-0 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
            Seguimientos Psicosociales
          </h1>
          <button
            onClick={() => {
              setEditData(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Nuevo Seguimiento
          </button>
        </div>

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
    </DashboardLayout>
  );
}
