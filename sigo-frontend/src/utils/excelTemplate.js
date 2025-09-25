/**
 * Plantilla base para exportaciones Excel estandarizadas
 * Basada en el diseño de las exportaciones PDF
 */

import * as XLSX from 'xlsx';

/**
 * Colores estándar del sistema para Excel
 */
export const EXCEL_COLORS = {
  primary: '#388266',
  secondary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#374151'
};

/**
 * Crea un libro de Excel con el diseño estándar del Liceo
 * @param {string} title - Título del reporte
 * @param {string} subtitle - Subtítulo del reporte
 * @returns {Object} Libro de Excel configurado
 */
export const createStandardExcel = (title, subtitle) => {
  const wb = XLSX.utils.book_new();
  
  // Crear hoja de trabajo
  const ws = XLSX.utils.aoa_to_sheet([]);
  
  // Agregar información del encabezado
  const headerData = [
    ['Liceo Bicentenario Politécnico Caupolicán'],
    [title],
    [subtitle],
    [`Fecha: ${new Date().toLocaleDateString()}`],
    [''], // Línea en blanco
  ];
  
  // Insertar datos del encabezado
  XLSX.utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });
  
  // Configurar estilos básicos
  ws['!cols'] = [
    { wch: 15 }, // Columna A
    { wch: 20 }, // Columna B
    { wch: 15 }, // Columna C
    { wch: 20 }, // Columna D
    { wch: 15 }, // Columna E
    { wch: 20 }, // Columna F
    { wch: 15 }, // Columna G
    { wch: 25 }, // Columna H
  ];
  
  return { wb, ws };
};

/**
 * Agrega una tabla de datos a la hoja de Excel
 * @param {Object} ws - Hoja de trabajo
 * @param {Array} headers - Encabezados de la tabla
 * @param {Array} data - Datos de la tabla
 * @param {number} startRow - Fila de inicio (por defecto 6)
 */
export const addStandardTable = (ws, headers, data, startRow = 6) => {
  // Agregar encabezados
  const headerRow = startRow;
  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: `A${headerRow}` });
  
  // Agregar datos
  if (data.length > 0) {
    XLSX.utils.sheet_add_aoa(ws, data, { origin: `A${headerRow + 1}` });
  }
  
  // Configurar rango de la tabla
  const endRow = startRow + data.length;
  const endCol = String.fromCharCode(65 + headers.length - 1); // Convertir número a letra
  ws['!ref'] = `A1:${endCol}${endRow}`;
};

/**
 * Guarda el libro de Excel con nombre estándar
 * @param {Object} wb - Libro de Excel
 * @param {string} filename - Nombre del archivo (sin extensión)
 * @param {string} sheetName - Nombre de la hoja (por defecto 'Reporte')
 */
export const saveStandardExcel = (wb, filename, sheetName = 'Reporte') => {
  const fecha = new Date().toLocaleDateString();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanFilename}_${fecha.replaceAll("/", "-")}.xlsx`;
  
  // Agregar la hoja al libro
  wb.SheetNames.push(sheetName);
  wb.Sheets[sheetName] = wb.ws;
  
  // Descargar archivo
  XLSX.writeFile(wb, fileName);
};

/**
 * Crea un archivo Excel completo con encabezado y tabla
 * @param {string} title - Título del reporte
 * @param {string} subtitle - Subtítulo del reporte
 * @param {Array} headers - Encabezados de la tabla
 * @param {Array} data - Datos de la tabla
 * @param {string} filename - Nombre del archivo
 * @param {string} sheetName - Nombre de la hoja
 */
export const createCompleteExcel = (title, subtitle, headers, data, filename, sheetName = 'Reporte') => {
  const { wb, ws } = createStandardExcel(title, subtitle);
  
  // Agregar numeración a los datos si no la tiene
  const dataWithNumbers = data.map((row, i) => [i + 1, ...row]);
  const headersWithNumbers = ['#', ...headers];
  
  addStandardTable(ws, headersWithNumbers, dataWithNumbers);
  
  // Agregar la hoja al libro
  wb.SheetNames.push(sheetName);
  wb.Sheets[sheetName] = ws;
  
  // Guardar archivo
  const fecha = new Date().toLocaleDateString();
  const cleanFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${cleanFilename}_${fecha.replaceAll("/", "-")}.xlsx`;
  
  XLSX.writeFile(wb, fileName);
};

/**
 * Formatear fecha para Excel
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDateForExcel = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('es-CL');
};

/**
 * Formatear fecha y hora para Excel
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTimeForExcel = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('es-CL');
};
