// src/features/estudiantes/components/ExportarEstudiantesPDF.jsx
import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";

export default function ExportarEstudiantesPDF({ estudiantes }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!estudiantes || estudiantes.length === 0) {
      toast.error("No hay estudiantes para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const doc = await createStandardPDF("Listado de Estudiantes", "Registro de Estudiantes");
      
      const headers = ["#", "Nombre", "Apellido", "RUT", "Curso", "Especialidad", "Estado"];
      const data = estudiantes.map((e, i) => [
        i + 1,
        e.nombre,
        e.apellido,
        e.rut,
        e.curso || "-",
        e.especialidad || "-",
        e.estado || "-",
      ]);

      addStandardTable(doc, headers, data, {
        styles: { fontSize: 9 }
      });

      saveStandardPDF(doc, "estudiantes");
      toast.success("Estudiantes exportados correctamente");
    } catch (error) {
      console.error("Error al exportar estudiantes:", error);
      toast.error("Error al exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !estudiantes || estudiantes.length === 0}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Exportando...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Exportar PDF
        </>
      )}
    </button>
  );
}
