// src/features/estudiantes/pages/tabs/Evaluaciones.jsx
import { useEffect, useState } from "react";
import api from "../../../../services/axios";

export default function Evaluaciones({ idEstudiante }) {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        console.log("🔍 Buscando evaluaciones para estudiante:", idEstudiante);
        const res = await api.get(`/evaluaciones?estudiante=${idEstudiante}`);
        console.log("📊 Evaluaciones encontradas:", res.data);
        setEvaluaciones(res.data);
        setError(null);
      } catch (error) {
        console.error("❌ Error al cargar evaluaciones:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (idEstudiante) {
      fetchEvaluaciones();
    } else {
      setLoading(false);
    }
  }, [idEstudiante]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-300">Cargando evaluaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!evaluaciones.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-300">No hay evaluaciones registradas para este estudiante.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Evaluaciones Vocacionales ({evaluaciones.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evaluaciones.map((eva) => (
          <div
            key={eva.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-200 dark:border-slate-700"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(eva.fecha_evaluacion).toLocaleDateString()}
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                {eva.tipo_evaluacion}
              </span>
            </div>
            
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p><strong>Curso:</strong> {eva.curso}</p>
              <p><strong>Resultados:</strong> {eva.resultados ? 'Disponibles' : 'No disponibles'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
