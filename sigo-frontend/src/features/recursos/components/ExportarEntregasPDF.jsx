/**
 * Componente para exportar entregas a PDF.
 *
 * @param {Object} props
 * @param {Array} props.entregas - Lista de entregas a exportar
 * @returns {JSX.Element}
 *
 * @example
 * <ExportarEntregasPDF entregas={[]} />
 */
// src/features/recursos/components/ExportarEntregasPDF.jsx
import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";

export default function ExportarEntregasPDF({ entregas }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!entregas || entregas.length === 0) {
      toast.error("No hay entregas para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const doc = await createStandardPDF("Reporte de Entrega de Recursos", "Registro de Entregas");
      
      const headers = ["#", "Estudiante", "RUT", "Curso", "Recurso", "Cantidad", "Fecha", "Observaciones"];
      const bodyData = entregas.map((e, i) => [
        i + 1,
        e.nombre_estudiante,
        e.rut,
        e.curso,
        e.recurso,
        e.cantidad,
        new Date(e.fecha_entrega).toLocaleDateString(),
        e.observaciones || "—",
      ]);

      addStandardTable(doc, headers, bodyData, {
        styles: { fontSize: 9 }
      });

      saveStandardPDF(doc, "entregas_recursos");
      toast.success("Entregas exportadas correctamente");
    } catch (error) {
      console.error("Error al exportar entregas:", error);
      toast.error("Error al exportar las entregas");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !entregas || entregas.length === 0}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
          <FileDown className="h-4 w-4 mr-2" /> Exportar PDF
        </>
      )}
    </button>
  );
}
