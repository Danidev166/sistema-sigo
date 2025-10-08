// src/features/estudiantes/components/CargaMasivaModal.jsx
import { useRef, useState } from "react";
import Modal from "../components/Modal";
import Papa from "papaparse";
import * as XLSX from 'xlsx';
import { UploadIcon, CheckCircle, XCircle, AlertTriangle, Download, FileSpreadsheet } from "lucide-react";
import { OPCIONES_CURSOS } from "../constants/cursos";

// Función para validar RUT chileno
function validarRut(rut) {
  if (!rut) return false;
  rut = rut.replace(/\./g, '').replace(/-/g, '');
  if (!/^[0-9kK]+$/.test(rut)) return false;
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1).toUpperCase();
  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  return dv === dvEsperado;
}

// Función para formatear RUT (sin puntos, con guion)
function formatearRut(rut) {
  if (!rut) return "";
  rut = rut.replace(/\./g, '').replace(/-/g, '');
  if (rut.length < 2) return rut;
  let cuerpo = rut.slice(0, -1);
  let dv = rut.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + dv;
}

// Función para validar email
function validarEmail(email) {
  if (!email || email.trim() === "") return true; // Email es opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar curso
function validarCurso(curso) {
  if (!curso || curso.trim() === "") return true; // Curso es opcional
  const cursosValidos = OPCIONES_CURSOS.map(c => c.value);
  return cursosValidos.includes(curso.trim());
}

// Función para validar fecha
function validarFecha(fecha) {
  if (!fecha) return false;
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj);
}

// Función para generar RUT válido
function generarRutValido() {
  const numeros = Math.floor(Math.random() * 90000000) + 10000000; // 8 dígitos
  let suma = 0;
  let multiplo = 2;
  const rutStr = numeros.toString();
  
  for (let i = rutStr.length - 1; i >= 0; i--) {
    suma += parseInt(rutStr[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  
  let dv = 11 - (suma % 11);
  dv = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
  
  return formatearRut(numeros + dv);
}

// Función para procesar archivo Excel
function procesarArchivoExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '' // Valor por defecto para celdas vacías
        });
        
        if (jsonData.length < 2) {
          reject(new Error("El archivo Excel está vacío o no tiene datos"));
          return;
        }
        
        // Convertir a formato de objetos con headers
        const headers = jsonData[0];
        const rows = jsonData.slice(1);
        
        const estudiantes = rows.map(row => {
          const estudiante = {};
          headers.forEach((header, index) => {
            if (header) {
              estudiante[header.toLowerCase().trim()] = row[index] || '';
            }
          });
          return estudiante;
        });
        
        resolve(estudiantes);
      } catch (error) {
        reject(new Error("Error al procesar el archivo Excel: " + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

// Función para procesar archivo CSV
function procesarArchivoCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error("Error al procesar CSV: " + results.errors[0].message));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error("Error al leer el archivo CSV: " + error.message));
      }
    });
  });
}

export default function CargaMasivaModal({ isOpen, onClose, onUpload }) {
  const [archivoNombre, setArchivoNombre] = useState(null);
  const [datos, setDatos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [isValidando, setIsValidando] = useState(false);
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const fileInputRef = useRef();

  // Función para validar todos los datos
  const validarDatos = (datos) => {
    const errores = [];
    
    datos.forEach((estudiante, index) => {
      const fila = index + 2; // +2 porque index empieza en 0 y la fila 1 es el header
      const erroresFila = [];

      // Validar campos obligatorios
      if (!estudiante.nombre || estudiante.nombre.trim() === "") {
        erroresFila.push("Nombre es obligatorio");
      }
      if (!estudiante.apellido || estudiante.apellido.trim() === "") {
        erroresFila.push("Apellido es obligatorio");
      }
      if (!estudiante.rut || estudiante.rut.trim() === "") {
        erroresFila.push("RUT es obligatorio");
      } else if (!validarRut(estudiante.rut)) {
        erroresFila.push("RUT inválido");
      }
      if (!estudiante.direccion || estudiante.direccion.trim() === "") {
        erroresFila.push("Dirección es obligatoria");
      }
      if (!estudiante.fecha_nacimiento || !validarFecha(estudiante.fecha_nacimiento)) {
        erroresFila.push("Fecha de nacimiento inválida");
      }

      // Validar campos opcionales
      if (estudiante.email && !validarEmail(estudiante.email)) {
        erroresFila.push("Email inválido");
      }
      if (estudiante.curso && !validarCurso(estudiante.curso)) {
        erroresFila.push("Curso inválido");
      }

      if (erroresFila.length > 0) {
        errores.push({
          fila,
          estudiante: `${estudiante.nombre || 'N/A'} ${estudiante.apellido || 'N/A'}`,
          errores: erroresFila
        });
      }
    });

    return errores;
  };

  const handleArchivo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivoNombre(file.name);
    setIsValidando(true);
    setMostrarVistaPrevia(false);
    setDatos([]);
    setErrores([]);

    try {
      let datosRaw = [];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      // Procesar según el tipo de archivo
      if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        datosRaw = await procesarArchivoExcel(file);
      } else if (fileExtension === 'csv') {
        datosRaw = await procesarArchivoCSV(file);
      } else {
        throw new Error("Formato de archivo no soportado. Use .csv, .xlsx o .xls");
      }

      setIsValidando(false);
      
      if (datosRaw.length === 0) {
        alert("⚠️ El archivo está vacío o mal formateado");
        return;
      }

      // Formatear datos
      const datosFormateados = datosRaw.map(estudiante => ({
        ...estudiante,
        nombre: estudiante.nombre?.toString().toUpperCase().trim() || "",
        apellido: estudiante.apellido?.toString().toUpperCase().trim() || "",
        rut: formatearRut(estudiante.rut?.toString().trim() || ""),
        email: estudiante.email?.toString().trim() || "",
        telefono: estudiante.telefono?.toString().trim() || "",
        direccion: estudiante.direccion?.toString().toUpperCase().trim() || "",
        curso: estudiante.curso?.toString().trim() || "",
        especialidad: estudiante.especialidad?.toString().toUpperCase().trim() || "",
        situacion_economica: estudiante.situacion_economica?.toString().toUpperCase().trim() || "",
        estado: estudiante.estado?.toString().trim() || "Activo",
        nombre_apoderado: estudiante.nombre_apoderado?.toString().toUpperCase().trim() || "",
        telefono_apoderado: estudiante.telefono_apoderado?.toString().trim() || "",
        email_apoderado: estudiante.email_apoderado?.toString().trim() || ""
      }));

      setDatos(datosFormateados);

      // Validar datos
      const erroresEncontrados = validarDatos(datosFormateados);
      setErrores(erroresEncontrados);

      if (erroresEncontrados.length === 0) {
        setMostrarVistaPrevia(true);
      }
    } catch (error) {
      setIsValidando(false);
      alert("❌ Error al procesar el archivo: " + error.message);
    }
  };

  const handleConfirmarCarga = async () => {
    if (errores.length === 0) {
      try {
        setIsValidando(true);
        await onUpload(datos);
        onClose();
      } catch (error) {
        console.error('Error en carga masiva:', error);
        // Mostrar errores del backend si los hay
        if (error.response?.data?.errors) {
          const erroresBackend = error.response.data.errors;
          setErrores(erroresBackend);
          setMostrarVistaPrevia(false);
        } else {
          alert(`Error en la carga masiva: ${error.message || 'Error desconocido'}`);
        }
      } finally {
        setIsValidando(false);
      }
    }
  };

  const handleDescargarPlantilla = (formato = 'csv') => {
    const headers = [
      "nombre", "apellido", "rut", "email", "telefono", "direccion", 
      "fecha_nacimiento", "curso", "especialidad", "situacion_economica", "estado",
      "nombre_apoderado", "telefono_apoderado", "email_apoderado"
    ];
    
    // Generar RUTs válidos para la plantilla
    const rut1 = generarRutValido();
    const rut2 = generarRutValido();
    
    const datosEjemplo = [
      ["JUAN", "PÉREZ", rut1, "juan@email.com", "+56912345678", "AV. PRINCIPAL 123", "2005-03-15", "1° Medio A", "TÉCNICO", "MEDIA", "Activo", "CARLOS PÉREZ", "+56911111111", "carlos@email.com"],
      ["MARÍA", "GONZÁLEZ", rut2, "maria@email.com", "+56987654321", "CALLE SECUNDARIA 456", "2004-07-22", "2° Medio B", "HUMANISTA", "BAJA", "Activo", "ANA GONZÁLEZ", "+56922222222", "ana@email.com"]
    ];

    if (formato === 'excel') {
      // Crear archivo Excel
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([headers, ...datosEjemplo]);
      
      // Ajustar ancho de columnas
      const colWidths = headers.map(() => ({ wch: 15 }));
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
      XLSX.writeFile(wb, "plantilla_estudiantes.xlsx");
    } else {
      // Crear archivo CSV
      const ejemplo = [
        headers.join(","),
        `"${datosEjemplo[0].join('","')}"`,
        `"${datosEjemplo[1].join('","')}"`
      ].join("\n");

      const blob = new Blob([ejemplo], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "plantilla_estudiantes.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Carga Masiva de Estudiantes">
      <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
        {/* Botón de cerrar */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            title="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Instrucciones */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            📋 Instrucciones para la carga masiva
          </p>
          <p className="text-blue-700 dark:text-blue-300">
            Sube un archivo <strong>.csv</strong> o <strong>.xlsx</strong> con los estudiantes a registrar. 
            Puedes descargar una plantilla con el formato correcto.
          </p>
        </div>

        {/* Botones de descarga de plantilla */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => handleDescargarPlantilla('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition"
          >
            <Download size={18} />
            Plantilla CSV
          </button>
          <button
            onClick={() => handleDescargarPlantilla('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            <FileSpreadsheet size={18} />
            Plantilla Excel
          </button>
        </div>

        {/* Selector de archivo */}
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleArchivo}
          ref={fileInputRef}
          className="hidden"
        />

        <div className="w-full">
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            <UploadIcon size={18} />
            {archivoNombre ? `Archivo: ${archivoNombre}` : "Seleccionar archivo (CSV/Excel)"}
          </button>
        </div>

        {/* Validación en progreso */}
        {isValidando && (
          <div className="flex items-center justify-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
            <span className="text-yellow-800 dark:text-yellow-200">Validando datos...</span>
          </div>
        )}

        {/* Errores encontrados */}
        {errores.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="text-red-600" size={20} />
              <h3 className="font-medium text-red-800 dark:text-red-200">
                Se encontraron {errores.length} error(es)
              </h3>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {errores.map((error, index) => (
                <div key={index} className="text-xs bg-red-100 dark:bg-red-800/30 p-2 rounded">
                  <div className="font-medium text-red-800 dark:text-red-200">
                    {error.fila ? `Fila ${error.fila}: ` : ''}{error.estudiante || error.message || 'Error'}
                  </div>
                  {error.errores && Array.isArray(error.errores) ? (
                    <ul className="ml-4 mt-1 space-y-1">
                      {error.errores.map((err, i) => (
                        <li key={i} className="text-red-700 dark:text-red-300">• {err}</li>
                      ))}
                    </ul>
                  ) : error.detail ? (
                    <p className="text-red-700 dark:text-red-300 mt-1">{error.detail}</p>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="text-xs text-red-700 dark:text-red-300 mt-2">
              {errores.some(e => e.fila) 
                ? 'Corrige los errores en tu archivo y vuelve a subirlo.'
                : 'Revisa los errores y corrige los datos antes de continuar.'
              }
            </p>
          </div>
        )}

        {/* Vista previa de datos */}
        {mostrarVistaPrevia && errores.length === 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="text-green-600" size={20} />
              <h3 className="font-medium text-green-800 dark:text-green-200">
                ✅ Datos válidos - {datos.length} estudiante(s) listo(s) para cargar
              </h3>
            </div>
            
            {/* Vista previa de los primeros 3 estudiantes */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {datos.slice(0, 3).map((estudiante, index) => (
                <div key={index} className="text-xs bg-green-100 dark:bg-green-800/30 p-2 rounded">
                  <div className="font-medium text-green-800 dark:text-green-200">
                    {estudiante.nombre} {estudiante.apellido}
                  </div>
                  <div className="text-green-700 dark:text-green-300">
                    RUT: {estudiante.rut} | Curso: {estudiante.curso || 'No especificado'}
                  </div>
                  {estudiante.nombre_apoderado && (
                    <div className="text-green-600 dark:text-green-400 text-xs">
                      Apoderado: {estudiante.nombre_apoderado}
                    </div>
                  )}
                </div>
              ))}
              {datos.length > 3 && (
                <div className="text-xs text-green-700 dark:text-green-300 text-center">
                  ... y {datos.length - 3} estudiante(s) más
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmarCarga}
                disabled={isValidando}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {isValidando ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Cargando...
                  </>
                ) : (
                  'Confirmar Carga'
                )}
              </button>
              <button
                onClick={() => {
                  setDatos([]);
                  setErrores([]);
                  setMostrarVistaPrevia(false);
                  setArchivoNombre(null);
                }}
                disabled={isValidando}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Información de encabezados */}
        <div className="overflow-auto text-xs bg-gray-100 dark:bg-slate-800 p-3 rounded-md border border-gray-200 dark:border-slate-600">
          <p className="mb-2 font-medium">📋 Formatos soportados: CSV, Excel (.xlsx, .xls)</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-400">Obligatorios:</p>
              <code className="text-xs">nombre, apellido, rut, direccion, fecha_nacimiento</code>
            </div>
            <div>
              <p className="font-medium text-gray-600 dark:text-gray-400">Opcionales:</p>
              <code className="text-xs">email, telefono, curso, especialidad, situacion_economica, estado, nombre_apoderado, telefono_apoderado, email_apoderado</code>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium text-gray-600 dark:text-gray-400">Cursos válidos:</p>
            <code className="text-xs break-words">
              {OPCIONES_CURSOS.map(c => c.value).join(", ")}
            </code>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
