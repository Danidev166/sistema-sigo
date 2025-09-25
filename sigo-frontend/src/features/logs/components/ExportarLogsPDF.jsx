import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";

export default function ExportarLogsPDF({ logs }) {
  const [isExporting, setIsExporting] = useState(false);

  const resumenDetalles = (log) => {
    if (!log.detalles) return "-";
    try {
      const detalles = typeof log.detalles === 'string' ? JSON.parse(log.detalles) : log.detalles;
      return Object.keys(detalles).slice(0, 2).map(key => `${key}: ${detalles[key]}`).join(", ");
    } catch {
      return log.detalles.substring(0, 50) + "...";
    }
  };

  const handleExport = async () => {
    if (!logs || logs.length === 0) {
      toast.error("No hay logs para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const doc = await createStandardPDF("Reporte de Logs de Actividad", "Registro de Actividades del Sistema");
      
      const headers = ["#", "Usuario", "Acción", "Tabla", "ID Registro", "IP", "Fecha", "Detalles"];
      const bodyData = logs.map((l, i) => [
        i + 1,
        l.usuario_nombre || "Sistema",
        l.accion,
        l.tabla_afectada,
        l.id_registro || "-",
        l.ip_address || "-",
        l.fecha_accion ? new Date(l.fecha_accion).toLocaleString() : "-",
        resumenDetalles(l)
      ]);

      addStandardTable(doc, headers, bodyData, {
        styles: { fontSize: 8 }
      });

      saveStandardPDF(doc, "logs_actividad");
      toast.success("Logs exportados correctamente");
    } catch (error) {
      console.error("Error al exportar logs:", error);
      toast.error("Error al exportar los logs");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !logs || logs.length === 0}
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