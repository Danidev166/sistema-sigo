// src/features/estudiantes/pages/EstudianteDetalle.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import estudianteService from "../services/estudianteService";

import EstudianteHeader from "../components/EstudianteHeader";
import EstudianteTabs from "../components/EstudianteTabs";
import DashboardLayout from "../../../components/layout/DashboardLayout";

export default function EstudianteDetalle() {
  const { id } = useParams();
  const [estudiante, setEstudiante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await estudianteService.getEstudianteById(id);
        setEstudiante(response.data);
      } catch (error) {
        console.error("❌ Error al cargar el estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
          Cargando estudiante...
        </div>
      </DashboardLayout>
    );
  }

  if (!estudiante) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-red-500 text-sm">
          No se encontró el estudiante.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4">
        <EstudianteHeader estudiante={estudiante} />
        <EstudianteTabs idEstudiante={id} />
      </div>
    </DashboardLayout>
  );
}
