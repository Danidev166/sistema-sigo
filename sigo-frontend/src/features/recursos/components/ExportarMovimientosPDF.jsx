import { useState } from "react";
import { FileDown } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.png";

/**
 * Componente para exportar movimientos a PDF.
 *
 * @param {Object} props
 * @param {Array} props.movimientos - Lista de movimientos a exportar
 * @returns {JSX.Element}
 *
 * @example
 * <ExportarMovimientosPDF movimientos={[]} />
 */

export default function ExportarMovimientosPDF({ movimientos = [] }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (!movimientos.length) {
      toast.error("No hay movimientos para exportar");
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
        doc.text("Movimientos de Recursos", 40, 28);
        doc.text(`Fecha: ${fecha}`, 14, 45);

        autoTable(doc, {
          startY: 50,
          head: [["#", "Fecha", "Tipo", "Recurso", "Cantidad", "Estudiante", "Responsable", "Observaciones"]],
          body: movimientos.map((m, i) => [
            i + 1,
            new Date(m.fecha).toLocaleDateString(),
            m.tipo_movimiento,
            m.recurso,
            m.cantidad,
            m.estudiante || "-",
            m.responsable || "-",
            m.observaciones || "-"
          ]),
          styles: { fontSize: 9 },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });

        doc.save(`movimientos_recursos_${fecha.replaceAll("/", "-")}.pdf`);
        toast.success("PDF exportado correctamente");
      };

      img.onerror = () => {
        toast.error("No se pudo cargar el logo institucional.");
      };
    } catch (error) {
      console.error("Error al exportar movimientos:", error);
      toast.error("Error al exportar PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !movimientos.length}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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
