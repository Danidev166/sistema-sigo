/**
 * Página de gestión de agenda de entrevistas.
 *
 * Permite visualizar, crear, editar y eliminar entrevistas agendadas.
 * Integra modales para formularios y confirmaciones.
 *
 * @component
 * @returns {JSX.Element} Página de agenda de entrevistas
 *
 * @example
 * // Uso en rutas protegidas
 * <Route path="/agenda" element={<AgendaPage />} />
 */
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import Button from "../../../components/ui/Button";

import agendaService from "../services/AgendaService";
import AgendaFormModal from "../components/AgendaFormModal";
import AgendaTable from "../components/AgendaTable";
import DeleteConfirmModal from "../../estudiantes/components/intervenciones/DeleteConfirmModal";
import estudianteService from "../../estudiantes/services/estudianteService";
import api from "../../../services/axios";
import RegistrarEntrevistaModal from "../components/RegistrarEntrevistaModal";

export default function AgendaPage() {
  const [agenda, setAgenda] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registroAgenda, setRegistroAgenda] = useState(null);

  const fetchAgenda = async () => {
    try {
      const res = await agendaService.getAll();
      setAgenda(res.data);
    } catch (err) {
      toast.error("Error al cargar la agenda");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEstudiantes = async () => {
    try {
      const res = await estudianteService.getAll();
      setEstudiantes(res.data);
    } catch (err) {
      toast.error("Error al cargar estudiantes");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAgenda();
    fetchEstudiantes();
  }, []);

  const handleGuardar = async (formData) => {
    try {
      if (editing) {
        await agendaService.actualizar(editing.id, formData);
        toast.success("Entrevista actualizada");
      } else {
        await agendaService.crear(formData);
        toast.success("Entrevista agendada");
      }
      setModalOpen(false);
      setEditing(null);
      fetchAgenda();
    } catch (err) {
      toast.error("Error al guardar entrevista");
      console.error(err);
    }
  };

  const handleEliminar = async () => {
    try {
      await agendaService.eliminar(deleteTarget.id);
      toast.success("Entrevista eliminada");
      setDeleteTarget(null);
      fetchAgenda();
    } catch (err) {
      toast.error("Error al eliminar entrevista");
      console.error(err);
    }
  };

  const handleRegistrarEntrevista = (agendaItem) => {
    setRegistroAgenda(agendaItem);
  };

  const handleSubmitRegistro = async (formData) => {
    try {
      await api.post(`/entrevistas/registrar-desde-agenda/${registroAgenda.id}`, formData);
      toast.success("✅ Entrevista registrada correctamente.");
      setRegistroAgenda(null);
      fetchAgenda();
    } catch (error) {
      console.error("Error al registrar entrevista:", error);
      toast.error("Error al registrar la entrevista.");
    }
  };

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 pb-6 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <h1 className="page-title text-xl sm:text-2xl lg:text-3xl">
            Agenda de Entrevistas
          </h1>
          <Button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Agendar Entrevista
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500">Cargando agenda...</p>
        ) : (
          <AgendaTable
            agendaItems={agenda}
            onEdit={(item) => {
              setEditing(item);
              setModalOpen(true);
            }}
            onDelete={(item) => setDeleteTarget(item)}
            onRegistrarEntrevista={handleRegistrarEntrevista}
          />
        )}

        <AgendaFormModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleGuardar}
          initialData={editing}
          estudiantes={estudiantes}
        />

        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleEliminar}
          title="¿Deseas eliminar esta entrevista?"
        />

        <RegistrarEntrevistaModal
          isOpen={!!registroAgenda}
          onClose={() => setRegistroAgenda(null)}
          onSubmit={handleSubmitRegistro}
        />
      </div>
    </ImprovedDashboardLayout>
  );
}
