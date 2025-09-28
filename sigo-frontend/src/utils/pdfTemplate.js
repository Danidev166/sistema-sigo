/**
 * Plantilla base para exportaciones PDF estandarizadas
 * Basada en el diseño de ExportarMovimientosPDF.jsx
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo-pages.webp";

/**
 * Crea un documento PDF con el diseño estándar del Liceo
 * @param {string} title - Título del reporte
 * @param {string} subtitle - Subtítulo del reporte
 * @returns {Promise<jsPDF>} Documento PDF configurado
 */
export const createStandardPDF = async (title, subtitle) => {
  return new Promise((resolve, reject) => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // Logo institucional
      doc.addImage(img, "PNG", 10, 10, 25, 25);
      
      // Título principal
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Liceo Bicentenario Politécnico Caupolicán", 40, 20);
      
      // Subtítulo del reporte
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(title, 40, 28);
      
      // Fecha
      doc.text(`Fecha: ${fecha}`, 14, 45);

      resolve(doc);
    };

    img.onerror = () => {
      reject(new Error("No se pudo cargar el logo institucional"));
    };
  });
};

/**
 * Agrega una tabla al documento PDF con el estilo estándar
 * @param {jsPDF} doc - Documento PDF
 * @param {Array} headers - Encabezados de la tabla
 * @param {Array} data - Datos de la tabla
 * @param {Object} options - Opciones adicionales
 */
export const addStandardTable = (doc, headers, data, options = {}) => {
  const defaultOptions = {
    startY: 50,
    styles: { fontSize: 9 },
    theme: "grid",
    margin: { left: 14, right: 14 },
    ...options
  };

  autoTable(doc, {
    head: [headers],
    body: data,
    ...defaultOptions
  });
};

/**
 * Guarda el documento PDF con nombre estándar
 * @param {jsPDF} doc - Documento PDF
 * @param {string} filename - Nombre del archivo (sin extensión)
 */
export const saveStandardPDF = (doc, filename) => {
  const fecha = new Date().toLocaleDateString();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${cleanFilename}_${fecha.replaceAll("/", "-")}.pdf`);
};

/**
 * Colores estándar del sistema
 */
export const COLORS = {
  primary: '#388266',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#6B7280'
};

/**
 * Estilos estándar para texto
 */
export const TEXT_STYLES = {
  title: { fontSize: 14, font: "helvetica", style: "bold" },
  subtitle: { fontSize: 11, font: "helvetica", style: "normal" },
  body: { fontSize: 9, font: "helvetica", style: "normal" },
  small: { fontSize: 8, font: "helvetica", style: "normal" }
};
