import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { createStandardPDF, addStandardTable, saveStandardPDF } from "../../../utils/pdfTemplate";

/**
 * Componente para exportar inventario a PDF.
 *
 * @param {Object} props
 * @param {Array} props.recursos - Lista de recursos a exportar
 * @returns {JSX.Element}
 *
 * @example
 * <ExportarInventarioPDF recursos={[]} />
 */

export default function ExportarInventarioPDF({ recursos }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!recursos || recursos.length === 0) {
      toast.error("No hay recursos para exportar");
      return;
    }

    setIsExporting(true);
    try {
      const doc = await createStandardPDF("Inventario de Recursos Estudiantiles", "Registro de Inventario");
      
      const headers = ["#", "Tipo", "Nombre", "Descripción", "Disponible"];
      const bodyData = recursos.map((r, i) => [
        i + 1,
        r.tipo_recurso,
        r.nombre,
        r.descripcion || "-",
        r.cantidad_disponible ?? 0,
      ]);

      addStandardTable(doc, headers, bodyData, {
        styles: { fontSize: 10 }
      });

      saveStandardPDF(doc, "inventario_recursos");
      toast.success("Inventario exportado correctamente");
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar el inventario");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !recursos || recursos.length === 0}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <FileDown className="h-4 w-4 mr-2" />
          Exportar PDF
        </>
      )}
    </button>
  );
}
