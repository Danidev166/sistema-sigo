import { useState } from "react";
import { FileSpreadsheet } from "lucide-react";
import { toast } from "react-hot-toast";
import { createCompleteExcel, formatDateForExcel } from "../../../utils/excelTemplate";

export default function ExportarDerivacionesExcel({ data }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const headers = ["Nombre", "Apellido", "Curso", "Motivo", "Fecha", "Profesional", "Estado", "Observaciones"];
      const bodyData = data.map((e) => [
        e.nombre,
        e.apellido,
        e.curso,
        e.motivo,
        formatDateForExcel(e.fecha),
        e.profesional_asignado,
        e.estado,
        e.observaciones,
      ]);

      createCompleteExcel(
        "Reporte de Derivaciones / Intervenciones",
        "Registro de Derivaciones",
        headers,
        bodyData,
        "derivaciones",
        "Derivaciones"
      );

      toast.success("Reporte Excel exportado correctamente");
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      toast.error("Error al exportar el reporte Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <FileSpreadsheet className="h-4 w-4 mr-2" /> Exportar Excel
        </>
      )}
    </button>
  );
}
