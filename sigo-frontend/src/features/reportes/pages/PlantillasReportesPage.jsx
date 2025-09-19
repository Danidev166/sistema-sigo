import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PlantillaTable from "../components/PlantillaTable";
import PlantillaFormModal from "../components/PlantillaFormModal";
import plantillaReporteService from "../services/PlantillaReporteService";
import { toast } from "react-hot-toast";

export default function PlantillasReportesPage() {
  const [plantillas, setPlantillas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlantillas = async () => {
    setIsLoading(true);
    try {
      const res = await plantillaReporteService.getAll();
      setPlantillas(res.data);
    } catch (err) {
      toast.error("Error al cargar plantillas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantillas();
  }, []);

  const handleAdd = () => {
    setSelectedPlantilla(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta plantilla?")) {
      try {
        await plantillaReporteService.delete(id);
        toast.success("Plantilla eliminada");
        fetchPlantillas();
      } catch {
        toast.error("Error al eliminar");
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedPlantilla) {
        await plantillaReporteService.update(selectedPlantilla.id, data);
        toast.success("Plantilla actualizada");
      } else {
        await plantillaReporteService.create(data);
        toast.success("Plantilla creada");
      }
      setIsModalOpen(false);
      fetchPlantillas();
    } catch {
      toast.error("Error al guardar la plantilla");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Plantillas de Reportes</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Nueva Plantilla
          </button>
        </div>
        <PlantillaTable
          plantillas={plantillas}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <PlantillaFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          plantilla={selectedPlantilla}
        />
      </div>
    </DashboardLayout>
  );
} 