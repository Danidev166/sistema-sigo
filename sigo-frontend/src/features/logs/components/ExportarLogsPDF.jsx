import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";
import { toast } from "react-toastify";
import logo from "../../../assets/logo-pages.png";

export default function ExportarLogsPDF({ logs }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!logs || logs.length === 0) {
      toast.error("No hay logs para exportar");
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
        doc.text("Reporte de Logs de Actividad", 40, 28);
        doc.text(`Fecha: ${fecha}`, 14, 45);

        autoTable(doc, {
          startY: 50,
          head: [[
            "Usuario",
            "Acción",
            "Tabla",
            "ID Registro",
            "IP",
            "Fecha",
            "Detalles"
          ]],
          body: logs.map((l) => [
            l.usuario_nombre || "Sistema",
            l.accion,
            l.tabla_afectada,
            l.id_registro || "-",
            l.ip_address || "-",
            l.fecha_accion ? new Date(l.fecha_accion).toLocaleString() : "-",
            // Mostrar resumen de detalles
            resumenDetalles(l)
          ]),
          styles: { fontSize: 9 },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });

        doc.save(`logs_actividad_${fecha.replaceAll("/", "-")}.pdf`);
        toast.success("Logs exportados correctamente");
      };

      img.onerror = () => {
        toast.error("No se pudo cargar el logo institucional");
      };
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

// Agregar función para mostrar resumen de detalles
function resumenDetalles(log) {
  let detalles = [];
  if (log.datos_anteriores) {
    try {
      const prev = JSON.parse(log.datos_anteriores);
      detalles.push("Antes: " + resumenObjeto(prev));
    } catch {
      detalles.push("Antes: " + log.datos_anteriores);
    }
  }
  if (log.datos_nuevos) {
    try {
      const next = JSON.parse(log.datos_nuevos);
      detalles.push("Después: " + resumenObjeto(next));
    } catch {
      detalles.push("Después: " + log.datos_nuevos);
    }
  }
  return detalles.length > 0 ? detalles.join(" | ") : "-";
}

function resumenObjeto(obj) {
  // Si es array, tomar el primero
  if (Array.isArray(obj)) obj = obj[0];
  if (!obj || typeof obj !== 'object') return String(obj);
  // Mostrar solo los campos principales
  const claves = Object.keys(obj).slice(0, 4); // máximo 4 campos
  return claves.map(k => `${k}: ${obj[k]}`).join(", ");
} 