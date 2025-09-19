// src/features/estudiantes/tabs/Intervenciones.jsx
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import IntervencionFormModal from "../../components/intervenciones/IntervencionFormModal";
import DeleteConfirmModal from "../../components/intervenciones/DeleteConfirmModal";
import { toast } from "react-toastify";

export default function Intervenciones({ idEstudiante }) {
  const [intervenciones, setIntervenciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchIntervenciones = useCallback(async () => {
    try {
      const res = await estudianteService.getIntervenciones(idEstudiante);
      const ordenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setIntervenciones(ordenadas);
    } catch (error) {
      console.error("❌ Error al cargar intervenciones:", error);
      toast.error("Error al cargar intervenciones.");
    } finally {
      setCargando(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    fetchIntervenciones();
  }, [fetchIntervenciones]);

  const handleSubmit = async (formData) => {
    try {
      const data = {
        ...formData,
        id_estudiante: idEstudiante,
        completado: false,
      };

      if (editingData) {
        await estudianteService.actualizarIntervencion(editingData.id, data);
        toast.success("Intervención actualizada correctamente.");
      } else {
        await estudianteService.crearIntervencion(data);
        toast.success("Intervención registrada correctamente.");
      }

      setModalOpen(false);
      setEditingData(null);
      fetchIntervenciones();
    } catch (error) {
      console.error("❌ Error al guardar intervención:", error);
      toast.error("Error al guardar la intervención.");
    }
  };

  const handleDelete = async () => {
    try {
      await estudianteService.eliminarIntervencion(deleteTarget.id);
      toast.success("Intervención eliminada correctamente.");
      setDeleteTarget(null);
      fetchIntervenciones();
    } catch (error) {
      console.error("❌ Error al eliminar intervención:", error);
      toast.error("Error al eliminar la intervención.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Intervenciones
        </h2>
        <button
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={16} /> Nueva Intervención
        </button>
      </div>

      {/* Contenido */}
      {cargando ? (
        <p className="text-sm text-gray-400">Cargando intervenciones...</p>
      ) : intervenciones.length === 0 ? (
        <p className="text-sm text-gray-400">No hay intervenciones registradas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {intervenciones.map((interv) => (
            <div
              key={interv.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4 shadow-sm relative"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingData(interv);
                    setModalOpen(true);
                  }}
                  className="text-gray-400 hover:text-blue-500"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setDeleteTarget(interv)}
                  className="text-gray-400 hover:text-red-500"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300">
                  {interv.accion}
                </h4>
                <span className="text-xs text-gray-500">
                  {interv.fecha ? format(new Date(interv.fecha), "dd/MM/yyyy") : "Sin fecha"}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Meta:</strong> {interv.meta}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                <strong>Compromiso:</strong> {interv.compromiso}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <strong>Responsable:</strong> {interv.responsable}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      <IntervencionFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingData}
      />

      {/* Modal de confirmación */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="¿Deseas eliminar esta intervención?"
      />
    </div>
  );
}
