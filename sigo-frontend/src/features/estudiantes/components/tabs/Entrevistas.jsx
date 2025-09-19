// src/features/estudiantes/tabs/Entrevistas.jsx
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { CalendarCheckIcon } from "lucide-react";
import estudianteService from "../../services/estudianteService";
import { toast } from "react-toastify";

export default function Entrevistas({ idEstudiante }) {
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntrevistas = useCallback(async () => {
    try {
      const res = await estudianteService.getEntrevistas(idEstudiante, "realizada");
      const ordenadas = res.data.sort(
        (a, b) => new Date(b.fecha_entrevista) - new Date(a.fecha_entrevista)
      );
      setEntrevistas(ordenadas);
    } catch (error) {
      console.error("Error al obtener entrevistas:", error);
      toast.error("Error al cargar entrevistas.");
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    fetchEntrevistas();
  }, [fetchEntrevistas]);

  const getMotivoIcon = (motivo) => {
    switch (motivo) {
      case "Psicológico": return "🧠";
      case "Vocacional": return "🎓";
      case "Académico": return "📚";
      case "Familiar": return "🏠";
      case "Social": return "👫";
      default: return "❓";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
          <CalendarCheckIcon size={20} />
          Historial de Entrevistas
        </h2>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        👉 Las entrevistas <strong>pendientes</strong> se gestionan en la pestaña <strong>Agenda de Entrevistas</strong>.
      </p>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando entrevistas...</p>
      ) : entrevistas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay entrevistas registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entrevistas.map((e) => (
            <div
              key={e.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-4 hover:shadow-md transition-transform"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Fecha:</strong>{" "}
                {format(new Date(e.fecha_entrevista), "dd/MM/yyyy")}
              </p>
              <p className="text-sm text-gray-800 dark:text-white">
                <strong>Orientador:</strong> {e.nombre_orientador || "No disponible"}
              </p>
              <p className="text-sm text-gray-800 dark:text-white flex items-center gap-2">
                <strong>Motivo:</strong>{" "}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                    e.motivo === "Psicológico"
                      ? "bg-blue-100 text-blue-800"
                      : e.motivo === "Vocacional"
                      ? "bg-green-100 text-green-800"
                      : e.motivo === "Académico"
                      ? "bg-purple-100 text-purple-800"
                      : e.motivo === "Familiar"
                      ? "bg-yellow-100 text-yellow-800"
                      : e.motivo === "Social"
                      ? "bg-pink-100 text-pink-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {getMotivoIcon(e.motivo)} {e.motivo}
                </span>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                <strong>Observaciones:</strong> {e.observaciones || "-"}
              </p>
              {e.conclusiones && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <strong>Conclusiones:</strong> {e.conclusiones}
                </p>
              )}
              {e.acciones_acordadas && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <strong>Acciones acordadas:</strong> {e.acciones_acordadas}
                </p>
              )}
              <p className="text-sm mt-1">
                <strong>Estado:</strong>{" "}
                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {e.estado}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
