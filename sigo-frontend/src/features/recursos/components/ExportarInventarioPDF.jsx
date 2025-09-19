import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.png";

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
      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString();

      const img = new Image();
      img.src = logo;

      img.onload = () => {
        doc.addImage(img, "PNG", 10, 10, 25, 25);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Liceo Bicentenario Politécnico Caupolicán", 40, 20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Inventario de Recursos Estudiantiles", 40, 28);
        doc.text(`Fecha: ${fecha}`, 14, 45);

        autoTable(doc, {
          startY: 50,
          head: [["Tipo", "Nombre", "Descripción", "Disponible"]],
          body: recursos.map((r) => [
            r.tipo_recurso,
            r.nombre,
            r.descripcion || "-",
            r.cantidad_disponible ?? 0,
          ]),
          styles: { fontSize: 10 },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });

        doc.save(`inventario_recursos_${fecha.replaceAll("/", "-")}.pdf`);
        toast.success("Inventario exportado correctamente");
      };

      img.onerror = () => {
        toast.error("⚠️ No se pudo cargar el logo institucional.");
      };
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
