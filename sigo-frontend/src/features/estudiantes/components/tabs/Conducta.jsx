// src/features/estudiantes/pages/Conducta.jsx
import { useEffect, useState, useCallback } from "react";
import estudianteService from "../../services/estudianteService";
import ConductaTable from "../../components/conducta/ConductaTable";
import ConductaFormModal from "../../components/conducta/ConductaFormModal";
import { Plus } from "lucide-react";

export default function Conducta({ idEstudiante }) {
  const [conductas, setConductas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchConductas = useCallback(async () => {
    try {
      const res = await estudianteService.getConducta(idEstudiante);
      setConductas(res.data || []);
    } catch (error) {
      console.error("❌ Error al cargar conducta:", error);
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    fetchConductas();
  }, [fetchConductas]);

  const handleSubmit = async (formData) => {
    try {
      if (editingData) {
        await estudianteService.actualizarConducta(editingData.id, {
          ...formData,
          id_estudiante: idEstudiante,
        });
      } else {
        await estudianteService.crearConducta({
          ...formData,
          id_estudiante: idEstudiante,
        });
      }
      setModalOpen(false);
      setEditingData(null);
      fetchConductas();
    } catch (error) {
      console.error("❌ Error al guardar conducta:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Registro de Conducta
        </h2>
        <button
          onClick={() => {
            setEditingData(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nueva Conducta
        </button>
      </div>

      {/* Tabla */}
      <ConductaTable
        conductas={conductas}
        loading={loading}
        onEdit={(registro) => {
          setEditingData(registro);
          setModalOpen(true);
        }}
      />

      {/* Modal */}
      <ConductaFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingData}
      />
    </div>
  );
}
