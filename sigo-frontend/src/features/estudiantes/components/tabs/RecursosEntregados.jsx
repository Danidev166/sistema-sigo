// src/features/estudiantes/tabs/RecursosEntregados.jsx
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import estudianteService from "../../services/estudianteService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RecursosEntregados({ idEstudiante, nombreEstudiante, curso }) {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarRecursos = async () => {
      try {
        const response = await estudianteService.getRecursosEntregados(idEstudiante);
        if (response?.data) {
          setRecursos(response.data);
        } else {
          setRecursos([]);
          toast.info("No hay recursos entregados para este estudiante");
        }
      } catch (error) {
        console.error("Error al cargar recursos entregados:", error);
        toast.error(error.response?.data?.error || "No se pudieron cargar los recursos entregados");
        setRecursos([]);
      } finally {
        setLoading(false);
      }
    };

    if (idEstudiante) {
      cargarRecursos();
    }
  }, [idEstudiante]);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Recursos Entregados", 14, 20);
    doc.setFontSize(11);
    doc.text(`Estudiante: ${nombreEstudiante}`, 14, 30);
    doc.text(`Curso: ${curso}`, 14, 37);
    doc.text(`Fecha de generación: ${format(new Date(), "dd/MM/yyyy")}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [["Fecha", "Recurso", "Tipo", "Cantidad", "Observaciones"]],
      body: recursos.map((r) => [
        format(new Date(r.fecha_entrega), "dd/MM/yyyy"),
        r.nombre_recurso,
        r.tipo,
        r.cantidad_entregada,
        r.observaciones || "—",
      ]),
    });

    doc.save(`recursos_entregados_${nombreEstudiante}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!recursos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No hay recursos entregados para este estudiante
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Título y botón */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recursos Entregados
        </h3>
        <button
          onClick={exportarPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Exportar PDF
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-100 dark:bg-slate-800">
            <tr>
              {["Fecha", "Recurso", "Tipo", "Cantidad", "Observaciones"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {recursos.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2">{format(new Date(r.fecha_entrega), "dd/MM/yyyy")}</td>
                <td className="px-4 py-2">{r.nombre_recurso}</td>
                <td className="px-4 py-2">{r.tipo}</td>
                <td className="px-4 py-2">{r.cantidad_entregada}</td>
                <td className="px-4 py-2">{r.observaciones || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
