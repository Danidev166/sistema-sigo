import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable
const doc = new jsPDF();

export const exportToPDF = {
  // Exportar seguimiento académico a PDF
  seguimientoAcademico: (data, estudianteInfo) => {
    const pdf = new jsPDF();
    
    // Configuración del documento
    pdf.setFontSize(20);
    pdf.text('Reporte de Seguimiento Académico', 20, 20);
    
    // Información del estudiante
    pdf.setFontSize(12);
    pdf.text(`Estudiante: ${estudianteInfo?.nombre || 'N/A'}`, 20, 35);
    pdf.text(`Curso: ${estudianteInfo?.curso || 'N/A'}`, 20, 42);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 49);
    
    // Tabla de seguimiento
    const tableData = data.map(item => [
      item.asignatura,
      item.nota,
      item.promedio_curso,
      new Date(item.fecha).toLocaleDateString('es-ES')
    ]);
    
    pdf.autoTable({
      head: [['Asignatura', 'Nota', 'Promedio Curso', 'Fecha']],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });
    
    // Estadísticas al final
    const finalY = pdf.lastAutoTable.finalY + 20;
    pdf.setFontSize(14);
    pdf.text('Estadísticas Generales', 20, finalY);
    
    pdf.setFontSize(10);
    const promedio = data.reduce((sum, item) => sum + parseFloat(item.nota), 0) / data.length;
    const asignaturasUnicas = [...new Set(data.map(item => item.asignatura))].length;
    
    pdf.text(`Promedio General: ${promedio.toFixed(2)}`, 20, finalY + 10);
    pdf.text(`Asignaturas Únicas: ${asignaturasUnicas}`, 20, finalY + 17);
    pdf.text(`Total de Registros: ${data.length}`, 20, finalY + 24);
    
    return pdf;
  },

  // Exportar asistencia a PDF
  asistencia: (data, estudianteInfo) => {
    const pdf = new jsPDF();
    
    // Configuración del documento
    pdf.setFontSize(20);
    pdf.text('Reporte de Asistencia', 20, 20);
    
    // Información del estudiante
    pdf.setFontSize(12);
    pdf.text(`Estudiante: ${estudianteInfo?.nombre || 'N/A'}`, 20, 35);
    pdf.text(`Curso: ${estudianteInfo?.curso || 'N/A'}`, 20, 42);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 49);
    
    // Tabla de asistencia
    const tableData = data.map(item => [
      new Date(item.fecha).toLocaleDateString('es-ES'),
      item.tipo,
      item.justificacion || 'N/A',
      new Date(item.created_at).toLocaleDateString('es-ES')
    ]);
    
    pdf.autoTable({
      head: [['Fecha', 'Tipo', 'Justificación', 'Registrado']],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });
    
    // Estadísticas al final
    const finalY = pdf.lastAutoTable.finalY + 20;
    pdf.setFontSize(14);
    pdf.text('Estadísticas de Asistencia', 20, finalY);
    
    pdf.setFontSize(10);
    const presentes = data.filter(item => item.tipo === 'Presente').length;
    const ausentes = data.filter(item => item.tipo === 'Ausente').length;
    const justificadas = data.filter(item => item.tipo === 'Justificada').length;
    const pendientes = data.filter(item => item.tipo === 'Pendiente').length;
    const porcentajeAsistencia = ((presentes + justificadas) / data.length * 100).toFixed(1);
    
    pdf.text(`Presentes: ${presentes}`, 20, finalY + 10);
    pdf.text(`Ausentes: ${ausentes}`, 20, finalY + 17);
    pdf.text(`Justificadas: ${justificadas}`, 20, finalY + 24);
    pdf.text(`Pendientes: ${pendientes}`, 20, finalY + 31);
    pdf.text(`Porcentaje de Asistencia: ${porcentajeAsistencia}%`, 20, finalY + 38);
    
    return pdf;
  },

  // Exportar historial académico a PDF
  historialAcademico: (data, estudianteInfo) => {
    const pdf = new jsPDF();
    
    // Configuración del documento
    pdf.setFontSize(20);
    pdf.text('Historial Académico', 20, 20);
    
    // Información del estudiante
    pdf.setFontSize(12);
    pdf.text(`Estudiante: ${estudianteInfo?.nombre || 'N/A'}`, 20, 35);
    pdf.text(`Curso: ${estudianteInfo?.curso || 'N/A'}`, 20, 42);
    pdf.text(`Año: ${data[0]?.anio || new Date().getFullYear()}`, 20, 49);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 56);
    
    // Información del historial
    if (data.length > 0) {
      const historial = data[0];
      const startY = 70;
      
      pdf.setFontSize(14);
      pdf.text('Resumen Académico', 20, startY);
      
      pdf.setFontSize(12);
      pdf.text(`Promedio General: ${historial.promedio_general}`, 20, startY + 15);
      pdf.text(`Porcentaje de Asistencia: ${historial.asistencia}%`, 20, startY + 25);
      pdf.text(`Fecha de Actualización: ${new Date(historial.fecha_actualizacion).toLocaleDateString('es-ES')}`, 20, startY + 35);
      
      // Observaciones
      pdf.setFontSize(12);
      pdf.text('Observaciones Académicas:', 20, startY + 50);
      
      // Dividir observaciones en líneas
      const observaciones = historial.observaciones_academicas || '';
      const maxWidth = 170;
      const lineHeight = 7;
      let y = startY + 60;
      
      const words = observaciones.split(' ');
      let line = '';
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const testWidth = pdf.getTextWidth(testLine);
        
        if (testWidth > maxWidth && line !== '') {
          pdf.text(line, 20, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        pdf.text(line, 20, y);
      }
    }
    
    return pdf;
  },

  // Exportar dashboard completo a PDF
  dashboardCompleto: (data, estudianteInfo) => {
    const pdf = new jsPDF();
    
    // Configuración del documento
    pdf.setFontSize(20);
    pdf.text('Dashboard Académico Completo', 20, 20);
    
    // Información del estudiante
    pdf.setFontSize(12);
    pdf.text(`Estudiante: ${estudianteInfo?.nombre || 'N/A'}`, 20, 35);
    pdf.text(`Curso: ${estudianteInfo?.curso || 'N/A'}`, 20, 42);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 20, 49);
    
    // Sección de seguimiento académico
    if (data.seguimiento && data.seguimiento.length > 0) {
      pdf.setFontSize(16);
      pdf.text('Seguimiento Académico', 20, 70);
      
      const tableData = data.seguimiento.map(item => [
        item.asignatura,
        item.nota,
        item.promedio_curso,
        new Date(item.fecha).toLocaleDateString('es-ES')
      ]);
      
      pdf.autoTable({
        head: [['Asignatura', 'Nota', 'Promedio Curso', 'Fecha']],
        body: tableData,
        startY: 80,
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
    }
    
    // Sección de asistencia
    if (data.asistencia && data.asistencia.length > 0) {
      const startY = data.seguimiento && data.seguimiento.length > 0 ? pdf.lastAutoTable.finalY + 20 : 80;
      
      pdf.setFontSize(16);
      pdf.text('Registro de Asistencia', 20, startY);
      
      const tableData = data.asistencia.map(item => [
        new Date(item.fecha).toLocaleDateString('es-ES'),
        item.tipo,
        item.justificacion || 'N/A'
      ]);
      
      pdf.autoTable({
        head: [['Fecha', 'Tipo', 'Justificación']],
        body: tableData,
        startY: startY + 10,
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });
    }
    
    return pdf;
  }
};

export default exportToPDF;
