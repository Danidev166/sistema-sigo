// src/features/estudiantes/components/ExportarEstudiantesPDF.jsx
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.png";

export default function ExportarEstudiantesPDF({ estudiantes }) {
  const exportar = () => {
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
      doc.text("Listado de Estudiantes", 40, 28);
      doc.text(`Fecha: ${fecha}`, 14, 45);

      autoTable(doc, {
        startY: 50,
        head: [["Nombre", "Apellido", "RUT", "Curso", "Especialidad", "Estado"]],
        body: estudiantes.map((e) => [
          e.nombre,
          e.apellido,
          e.rut,
          e.curso || "-",
          e.especialidad || "-",
          e.estado || "-",
        ]),
        styles: { fontSize: 10 },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });

      doc.save(`estudiantes_${fecha.replaceAll("/", "-")}.pdf`);
    };

    img.onerror = () => {
      alert("⚠️ No se pudo cargar el logo institucional.");
    };
  };

  return (
    <button
      onClick={exportar}
      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium transition"
    >
      <FileText size={16} />
      Exportar PDF
    </button>
  );
}
