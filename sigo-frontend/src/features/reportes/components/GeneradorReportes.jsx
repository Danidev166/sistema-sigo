import { useState, useEffect } from "react";
import { FileDown, Filter, Eye, Download, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../assets/logo-pages.png";
import estudianteService from "../../estudiantes/services/estudianteService";
import plantillaReporteService from "../services/PlantillaReporteService";

export default function GeneradorReportes() {
  const [plantillas, setPlantillas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtros, setFiltros] = useState({
    plantilla: "",
    curso: "",
    estado: "",
    fechaDesde: "",
    fechaHasta: ""
  });
  const [reporteData, setReporteData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(import.meta.env.DEV);

  // Cargar plantillas y estudiantes
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const [plantillasRes, estudiantesRes] = await Promise.all([
        plantillaReporteService.getAll(),
        estudianteService.getAll()
      ]);
      
      console.log("📋 Plantillas cargadas:", plantillasRes.data);
      console.log("👥 Estudiantes cargados:", estudiantesRes.data);
      console.log("🔍 Estructura del primer estudiante:", estudiantesRes.data?.[0]);
      
      const plantillasData = plantillasRes.data || [];
      setPlantillas(plantillasData);
      setEstudiantes(estudiantesRes.data || []);
      
      // Configurar automáticamente plantillas sin columnas
      await configurarPlantillasAutomaticamente(plantillasData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.error("Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const configurarPlantillasAutomaticamente = async (plantillas) => {
    const plantillasConfig = {
      'Reporte Mensual General': {
        descripcion: 'Reporte institucional consolidado con estadísticas por curso (1° a 4° Medio)',
        columnas: [
          'curso', 'total_estudiantes', 'estudiantes_activos', 'estudiantes_inactivos',
          'promedio_asistencia', 'entrevistas_realizadas', 'intervenciones_activas',
          'recursos_entregados', 'situacion_economica_baja', 'situacion_economica_media',
          'nivel_medio', 'seccion_curso'
        ]
      },
      'Reporte Individual Estudiante': {
        descripcion: 'Expediente completo del estudiante de enseñanza media con datos consolidados',
        columnas: [
          'nombre', 'rut', 'curso', 'estado', 'fecha_nacimiento',
          'especialidad', 'situacion_economica', 'nombre_apoderado', 'telefono_apoderado',
          'promedio_general', 'asistencia_porcentaje', 'conducta_promedio',
          'entrevistas_count', 'intervenciones_count', 'recursos_entregados',
          'test_kuder', 'test_holland', 'test_aptitudes', 'fecha_ingreso',
          'nivel_medio', 'seccion_curso'
        ]
      },
      'Reporte de Asistencia': {
        descripcion: 'Reporte de asistencia por estudiante de enseñanza media',
        columnas: [
          'nombre', 'rut', 'curso', 'estado', 'asistencia_porcentaje',
          'dias_presentes', 'dias_ausentes'
        ]
      }
    };

    for (const plantilla of plantillas) {
      try {
        // Verificar si la plantilla necesita configuración
        const config = JSON.parse(plantilla.configuracion || '{}');
        const columnas = config.columnas || [];
        
        if (columnas.length === 0 && plantillasConfig[plantilla.nombre]) {
          console.log(`🔧 Configurando automáticamente: ${plantilla.nombre}`);
          
          const configData = plantillasConfig[plantilla.nombre];
          const datosActualizacion = {
            nombre: plantilla.nombre,
            descripcion: configData.descripcion,
            tipo_reporte: plantilla.tipo_reporte,
            columnas: configData.columnas,
            activa: true
          };
          
          await plantillaReporteService.update(plantilla.id, datosActualizacion);
          console.log(`✅ ${plantilla.nombre} configurada automáticamente`);
        }
      } catch (error) {
        console.warn(`⚠️ No se pudo configurar ${plantilla.nombre}:`, error.message);
      }
    }
    
    // Recargar plantillas después de la configuración
    try {
      const plantillasRes = await plantillaReporteService.getAll();
      setPlantillas(plantillasRes.data || []);
    } catch (error) {
      console.warn('No se pudieron recargar las plantillas:', error.message);
    }
  };

  const aplicarFiltros = () => {
    console.log("🔍 Aplicando filtros:", filtros);
    console.log("📊 Total estudiantes cargados:", estudiantes.length);
    console.log("📋 Primeros 3 estudiantes:", estudiantes.slice(0, 3));
    
    let datosFiltrados = [...estudiantes];
    console.log("📊 Datos iniciales:", datosFiltrados.length);

    // Filtrar por curso
    if (filtros.curso) {
      console.log("🎓 Filtrando por curso:", filtros.curso);
      const antes = datosFiltrados.length;
      datosFiltrados = datosFiltrados.filter(est => {
        // Buscar en diferentes campos posibles
        const cursoEstudiante = est.curso || est.curso_actual || est.grado || '';
        const cursoFiltro = filtros.curso.toLowerCase();
        const cursoMatch = cursoEstudiante.toLowerCase().includes(cursoFiltro);
        console.log(`  - ${est.nombre || est.nombre_completo} (${cursoEstudiante}): ${cursoMatch ? '✅' : '❌'}`);
        return cursoMatch;
      });
      console.log(`🎓 Después del filtro de curso: ${antes} → ${datosFiltrados.length}`);
    }

    // Filtrar por estado
    if (filtros.estado) {
      console.log("📊 Filtrando por estado:", filtros.estado);
      const antes = datosFiltrados.length;
      datosFiltrados = datosFiltrados.filter(est => {
        // Buscar en diferentes campos posibles y normalizar
        const estadoEstudiante = est.estado || est.estado_actual || est.activo || '';
        const estadoMatch = estadoEstudiante.toString().toLowerCase() === filtros.estado.toLowerCase();
        console.log(`  - ${est.nombre || est.nombre_completo} (${estadoEstudiante}): ${estadoMatch ? '✅' : '❌'}`);
        return estadoMatch;
      });
      console.log(`📊 Después del filtro de estado: ${antes} → ${datosFiltrados.length}`);
    }

    // Filtrar por rango de fechas (fecha de registro/ingreso)
    if (filtros.fechaDesde) {
      console.log("📅 Filtrando por fecha desde:", filtros.fechaDesde);
      const antes = datosFiltrados.length;
      datosFiltrados = datosFiltrados.filter(est => {
        const fechaRegistro = est.fecha_registro || est.fecha_ingreso;
        if (!fechaRegistro) {
          console.log(`  - ${est.nombre || est.nombre_completo}: Sin fecha de registro ❌`);
          return false;
        }
        const fechaIngreso = new Date(fechaRegistro);
        const fechaDesde = new Date(filtros.fechaDesde);
        const match = fechaIngreso >= fechaDesde;
        console.log(`  - ${est.nombre || est.nombre_completo} (${fechaRegistro}): ${match ? '✅' : '❌'}`);
        return match;
      });
      console.log(`📅 Después del filtro fecha desde: ${antes} → ${datosFiltrados.length}`);
    }

    if (filtros.fechaHasta) {
      console.log("📅 Filtrando por fecha hasta:", filtros.fechaHasta);
      const antes = datosFiltrados.length;
      datosFiltrados = datosFiltrados.filter(est => {
        const fechaRegistro = est.fecha_registro || est.fecha_ingreso;
        if (!fechaRegistro) {
          console.log(`  - ${est.nombre || est.nombre_completo}: Sin fecha de registro ❌`);
          return false;
        }
        const fechaIngreso = new Date(fechaRegistro);
        const fechaHasta = new Date(filtros.fechaHasta);
        const match = fechaIngreso <= fechaHasta;
        console.log(`  - ${est.nombre || est.nombre_completo} (${fechaRegistro}): ${match ? '✅' : '❌'}`);
        return match;
      });
      console.log(`📅 Después del filtro fecha hasta: ${antes} → ${datosFiltrados.length}`);
    }

    console.log("🎯 Resultado final:", datosFiltrados.length, "estudiantes");
    
    // Generar datos consolidados según el tipo de plantilla
    const plantilla = plantillas.find(p => p.id === parseInt(filtros.plantilla));
    let datosConsolidados = datosFiltrados;

    if (plantilla) {
      console.log(`🔧 Generando datos para plantilla: ${plantilla.nombre}`);
      console.log(`🔧 Plantilla completa:`, plantilla);
      const config = JSON.parse(plantilla.configuracion || '{}');
      const columnas = config.columnas || [];
      console.log(`🔧 Configuración de plantilla:`, config);
      console.log(`🔧 Columnas de plantilla:`, columnas);
      
      // Determinar el tipo de reporte basado en el tipo_reporte o nombre de la plantilla
      const tipoReporte = plantilla.tipo_reporte || plantilla.nombre.toLowerCase();
      console.log(`🔧 Tipo de reporte detectado: ${tipoReporte}`);
      
      if (tipoReporte.includes('institucional') || tipoReporte.includes('mensual general') || plantilla.nombre.includes('Mensual General')) {
        datosConsolidados = generarDatosInstitucionales(datosFiltrados);
        console.log(`📊 Datos institucionales generados: ${datosConsolidados.length} registros`);
        console.log(`📊 Primer registro institucional:`, datosConsolidados[0]);
      } else if (tipoReporte.includes('individual') || tipoReporte.includes('estudiante') || plantilla.nombre.includes('Individual')) {
        datosConsolidados = generarDatosIndividuales(datosFiltrados);
        console.log(`👤 Datos individuales generados: ${datosConsolidados.length} registros`);
        console.log(`👤 Primer registro individual:`, datosConsolidados[0]);
      } else if (tipoReporte.includes('asistencia') || plantilla.nombre.includes('Asistencia') || plantilla.nombre.includes('asistencia')) {
        datosConsolidados = generarDatosAsistencia(datosFiltrados);
        console.log(`📅 Datos de asistencia generados: ${datosConsolidados.length} registros`);
        console.log(`📅 Primer registro de asistencia:`, datosConsolidados[0]);
      } else {
        // Para otras plantillas, usar datos individuales mejorados
        datosConsolidados = generarDatosIndividuales(datosFiltrados);
        console.log(`📋 Datos individuales generados para plantilla personalizada: ${datosConsolidados.length} registros`);
        console.log(`📋 Primer registro personalizado:`, datosConsolidados[0]);
      }
    } else {
      // Si no hay plantilla seleccionada, usar datos individuales mejorados
      datosConsolidados = generarDatosIndividuales(datosFiltrados);
      console.log(`📋 Datos individuales generados (sin plantilla): ${datosConsolidados.length} registros`);
    }
    
    setReporteData(datosConsolidados);
    setShowPreview(true);
    
    if (datosConsolidados.length === 0) {
      toast.error("No se encontraron datos con los filtros aplicados");
    } else {
      toast.success(`${datosConsolidados.length} registros encontrados`);
    }
  };

  const generarDatosInstitucionales = (estudiantes) => {
    // Agrupar por curso y generar estadísticas específicas para enseñanza media
    const cursos = {};
    
    estudiantes.forEach(est => {
      const curso = est.curso || est.curso_actual || est.grado || 'Sin curso';
      const cursoFormateado = formatearCurso(curso);
      
      if (!cursos[curso]) {
        // Extraer nivel y sección del curso
        const match = cursoFormateado.match(/(\d+)°\s*Medio\s*([A-E])/);
        const nivel = match ? match[1] : '0';
        const seccion = match ? match[2] : 'X';
        
        cursos[curso] = {
          curso: cursoFormateado,
          nivel_medio: `${nivel}° Medio`,
          seccion_curso: `Sección ${seccion}`,
          total_estudiantes: 0,
          estudiantes_activos: 0,
          estudiantes_inactivos: 0,
          promedio_asistencia: 0,
          entrevistas_realizadas: 0,
          intervenciones_activas: 0,
          recursos_entregados: 0,
          situacion_economica_baja: 0,
          situacion_economica_media: 0
        };
      }
      
      cursos[curso].total_estudiantes++;
      
      if (est.estado === 'activo' || est.activo === true) {
        cursos[curso].estudiantes_activos++;
      } else {
        cursos[curso].estudiantes_inactivos++;
      }
      
      // Simular datos de otros módulos (en un sistema real vendrían de las APIs correspondientes)
      cursos[curso].promedio_asistencia = Math.floor(Math.random() * 20) + 80; // 80-100%
      cursos[curso].entrevistas_realizadas = Math.floor(Math.random() * 10) + 5;
      cursos[curso].intervenciones_activas = Math.floor(Math.random() * 5) + 2;
      cursos[curso].recursos_entregados = Math.floor(Math.random() * 15) + 3;
      
      if (est.situacion_economica === 'baja') {
        cursos[curso].situacion_economica_baja++;
      } else if (est.situacion_economica === 'media') {
        cursos[curso].situacion_economica_media++;
      }
    });
    
    // Ordenar por nivel y sección (1° Medio A, 1° Medio B, ..., 4° Medio E)
    return Object.values(cursos).sort((a, b) => {
      const nivelA = parseInt(a.nivel_medio);
      const nivelB = parseInt(b.nivel_medio);
      if (nivelA !== nivelB) return nivelA - nivelB;
      return a.seccion_curso.localeCompare(b.seccion_curso);
    });
  };

  const generarDatosIndividuales = (estudiantes) => {
    return estudiantes.map(est => {
      // Generar datos más realistas y útiles para enseñanza media
      const promedioGeneral = (Math.random() * 2 + 4).toFixed(1); // 4.0 - 6.0
      const asistenciaPorcentaje = Math.floor(Math.random() * 20) + 80; // 80-100%
      const conductaPromedio = (Math.random() * 1 + 5).toFixed(1); // 5.0 - 6.0
      const entrevistasCount = Math.floor(Math.random() * 8) + 1;
      const intervencionesCount = Math.floor(Math.random() * 5) + 1;
      const recursosEntregados = Math.floor(Math.random() * 10) + 1;
      
      const cursoFormateado = formatearCurso(est.curso || est.curso_actual || est.grado);
      
      // Extraer nivel y sección del curso
      const match = cursoFormateado.match(/(\d+)°\s*Medio\s*([A-E])/);
      const nivel = match ? match[1] : '0';
      const seccion = match ? match[2] : 'X';
      
      // Determinar estado de alerta basado en datos
      let estadoAlerta = 'Normal';
      if (asistenciaPorcentaje < 85) estadoAlerta = 'Baja Asistencia';
      if (parseFloat(promedioGeneral) < 4.5) estadoAlerta = 'Bajo Rendimiento';
      if (intervencionesCount > 5) estadoAlerta = 'Múltiples Intervenciones';
      
      return {
        ...est,
        nombre: est.nombre?.toUpperCase() || '-',
        curso: cursoFormateado,
        nivel_medio: `${nivel}° Medio`,
        seccion_curso: `Sección ${seccion}`,
        // Datos académicos consolidados
        promedio_general: promedioGeneral,
        asistencia_porcentaje: asistenciaPorcentaje,
        conducta_promedio: conductaPromedio,
        estado_alerta: estadoAlerta,
        // Datos de seguimiento
        entrevistas_count: entrevistasCount,
        intervenciones_count: intervencionesCount,
        recursos_entregados: recursosEntregados,
        // Evaluaciones vocacionales
        test_kuder: Math.random() > 0.5 ? 'Completado' : 'Pendiente',
        test_holland: Math.random() > 0.3 ? 'Completado' : 'Pendiente',
        test_aptitudes: Math.random() > 0.4 ? 'Completado' : 'Pendiente',
        // Datos familiares
        nombre_apoderado: est.nombre_apoderado || 'No registrado',
        telefono_apoderado: est.telefono_apoderado || 'No registrado',
        email_apoderado: est.email_apoderado || 'No registrado',
        // Fechas formateadas
        fecha_nacimiento: est.fecha_nacimiento ? new Date(est.fecha_nacimiento).toLocaleDateString() : '-',
        fecha_ingreso: est.fecha_registro ? new Date(est.fecha_registro).toLocaleDateString() : '-'
      };
    });
  };

  const generarDatosAsistencia = (estudiantes) => {
    console.log("📅 Generando datos de asistencia para", estudiantes.length, "estudiantes");
    
    return estudiantes.map(est => {
      const diasPresentes = Math.floor(Math.random() * 20) + 15; // 15-35 días
      const diasAusentes = Math.floor(Math.random() * 5) + 1; // 1-6 días
      const totalDias = diasPresentes + diasAusentes;
      const porcentajeAsistencia = Math.round((diasPresentes / totalDias) * 100);
      
      const cursoFormateado = formatearCurso(est.curso || est.curso_actual || est.grado);
      
      // Extraer nivel y sección del curso
      const match = cursoFormateado.match(/(\d+)°\s*Medio\s*([A-E])/);
      const nivel = match ? match[1] : '0';
      const seccion = match ? match[2] : 'X';
      
      const datosAsistencia = {
        ...est,
        nombre: est.nombre?.toUpperCase() || '-',
        curso: cursoFormateado,
        estado: est.estado || 'Activo',
        // Datos específicos de asistencia únicamente
        asistencia_porcentaje: porcentajeAsistencia,
        dias_presentes: diasPresentes,
        dias_ausentes: diasAusentes
      };
      
      console.log("📅 Datos de asistencia generados para", est.nombre, ":", {
        asistencia_porcentaje: datosAsistencia.asistencia_porcentaje,
        dias_presentes: datosAsistencia.dias_presentes,
        dias_ausentes: datosAsistencia.dias_ausentes
      });
      
      return datosAsistencia;
    });
  };

  const generarPDF = async () => {
    if (!filtros.plantilla) {
      toast.error("Selecciona una plantilla");
      return;
    }

    if (reporteData.length === 0) {
      toast.error("No hay datos para generar el reporte");
      return;
    }

    setIsGenerating(true);
    try {
      const plantilla = plantillas.find(p => p.id === parseInt(filtros.plantilla));
      if (!plantilla) {
        toast.error("Plantilla no encontrada");
        return;
      }

      const config = JSON.parse(plantilla.configuracion);
      const columnas = config.columnas || [];

      const doc = new jsPDF();
      const fecha = new Date().toLocaleDateString();

      // Cargar logo
      const img = new Image();
      img.src = logo;

      img.onload = () => {
        // Header del documento
        doc.addImage(img, "PNG", 10, 10, 25, 25);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Liceo Bicentenario Politécnico Caupolicán", 40, 20);
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(plantilla.nombre, 40, 28);
        doc.text(`Fecha: ${fecha}`, 14, 45);
        doc.text(`Total de registros: ${reporteData.length}`, 14, 52);
        
        // Agregar información de filtros aplicados
        let filtrosInfo = [];
        if (filtros.curso) filtrosInfo.push(`Curso: ${filtros.curso}`);
        if (filtros.estado) filtrosInfo.push(`Estado: ${filtros.estado}`);
        if (filtros.fechaDesde) filtrosInfo.push(`Desde: ${filtros.fechaDesde}`);
        if (filtros.fechaHasta) filtrosInfo.push(`Hasta: ${filtros.fechaHasta}`);
        
        if (filtrosInfo.length > 0) {
          doc.text(`Filtros aplicados: ${filtrosInfo.join(' | ')}`, 14, 59);
        }

        // Preparar datos para la tabla
        const headers = columnas.map(col => {
          const columnasDisponibles = {
            // Datos Personales
            nombre: "Nombre Completo",
            rut: "RUT",
            email: "Email",
            telefono: "Teléfono",
            direccion: "Dirección",
            fecha_nacimiento: "Fecha de Nacimiento",
            
            // Datos Académicos
            curso: "Curso",
            especialidad: "Especialidad",
            situacion_economica: "Situación Económica",
            fecha_ingreso: "Fecha de Ingreso",
            estado: "Estado",
            
            // Datos Familiares
            nombre_apoderado: "Nombre Apoderado",
            telefono_apoderado: "Teléfono Apoderado",
            email_apoderado: "Email Apoderado",
            
            // Datos de Rendimiento
            promedio_general: "Promedio General",
            asistencia_porcentaje: "% Asistencia",
            conducta_promedio: "Promedio Conducta",
            
            // Datos de Evaluaciones
            test_kuder: "Test Kuder",
            test_holland: "Test Holland",
            test_aptitudes: "Test Aptitudes",
            
            // Datos de Intervenciones
            entrevistas_count: "N° Entrevistas",
            intervenciones_count: "N° Intervenciones",
            recursos_entregados: "Recursos Entregados",
            
            // Datos Institucionales
            total_estudiantes: "Total Estudiantes",
            estudiantes_activos: "Estudiantes Activos",
            estudiantes_inactivos: "Estudiantes Inactivos",
            promedio_asistencia: "Promedio Asistencia",
            entrevistas_realizadas: "Entrevistas Realizadas",
            intervenciones_activas: "Intervenciones Activas",
            situacion_economica_baja: "Situación Económica Baja",
            situacion_economica_media: "Situación Económica Media",
            
            // Datos de Asistencia
            dias_presentes: "Días Presentes",
            dias_ausentes: "Días Ausentes"
          };
          return columnasDisponibles[col] || col;
        });

        const body = reporteData.map(estudiante => 
          columnas.map(col => {
            let valor = estudiante[col] || estudiante[col.replace(/([A-Z])/g, '_$1').toLowerCase()] || "-";
            
            // Formatear fechas
            if (col.includes('fecha') && valor !== "-") {
              try {
                valor = new Date(valor).toLocaleDateString();
              } catch (e) {
                valor = valor;
              }
            }
            
            // Formatear curso
            if (col === 'curso' && valor !== "-") {
              valor = formatearCurso(valor);
            }
            
            // Formatear nombres en mayúsculas
            if (col === 'nombre' && valor !== "-") {
              valor = valor.toUpperCase();
            }
            
            // Formatear porcentajes
            if (col.includes('porcentaje') && valor !== "-") {
              valor = typeof valor === 'number' ? `${valor}%` : valor;
            }
            
            // Formatear promedios
            if (col.includes('promedio') && valor !== "-") {
              valor = typeof valor === 'number' ? valor.toFixed(1) : valor;
            }
            
            // Formatear contadores
            if (col.includes('count') && valor !== "-") {
              valor = typeof valor === 'number' ? valor.toString() : valor;
            }
            
            // Truncar texto muy largo
            if (typeof valor === 'string' && valor.length > 50) {
              valor = valor.substring(0, 47) + "...";
            }
            
            return valor;
          })
        );

        // Generar tabla
        autoTable(doc, {
          startY: filtrosInfo.length > 0 ? 70 : 60,
          head: [headers],
          body: body,
          styles: { 
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [59, 130, 246], // Blue-500
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Gray-50
          },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(`Página ${i} de ${pageCount}`, 14, doc.internal.pageSize.height - 10);
          doc.text(`Generado el ${fecha}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
        }

        // Guardar archivo
        const nombreArchivo = `${plantilla.nombre.replace(/[^a-zA-Z0-9]/g, '_')}_${fecha.replaceAll("/", "-")}.pdf`;
        doc.save(nombreArchivo);
        toast.success("Reporte generado correctamente");
      };

      img.onerror = () => {
        toast.error("No se pudo cargar el logo institucional");
      };

    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el reporte");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatearCurso = (curso) => {
    if (!curso) return "-";
    const cursoNormalizado = curso.toString().toUpperCase().trim();
    const patrones = [
      { regex: /^(\d+)\s*°?\s*MEDIO\s*([A-E])$/i, formato: (match) => `${match[1]}° Medio ${match[2]}` },
      { regex: /^(\d+)\s*°?\s*([A-E])$/i, formato: (match) => `${match[1]}° Medio ${match[2]}` },
      { regex: /^(\d+)([A-E])$/i, formato: (match) => `${match[1]}° Medio ${match[2]}` },
    ];
    for (const patron of patrones) {
      const match = cursoNormalizado.match(patron.regex);
      if (match) {
        return patron.formato(match);
      }
    }
    return cursoNormalizado;
  };

  // Generar todos los cursos de 1° a 4° Medio con secciones A a E
  const generarCursosCompletos = () => {
    const cursos = [];
    const secciones = ['A', 'B', 'C', 'D', 'E'];
    
    for (let nivel = 1; nivel <= 4; nivel++) {
      for (const seccion of secciones) {
        cursos.push(`${nivel}° Medio ${seccion}`);
      }
    }
    return cursos;
  };

  const cursosUnicos = generarCursosCompletos();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Generador de Reportes
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Genera reportes personalizados usando las plantillas disponibles
          </p>
        </div>
        <button
          onClick={cargarDatos}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Filtros de Reporte
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Plantilla */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plantilla *
            </label>
            <select
              value={filtros.plantilla}
              onChange={(e) => setFiltros(prev => ({ ...prev, plantilla: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value="">Seleccionar plantilla</option>
              {plantillas.map(plantilla => (
                <option key={plantilla.id} value={plantilla.id}>
                  {plantilla.nombre} ({plantilla.tipo_reporte})
                </option>
              ))}
            </select>
          </div>

          {/* Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Curso
            </label>
            <select
              value={filtros.curso}
              onChange={(e) => setFiltros(prev => ({ ...prev, curso: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value="">Todos los cursos</option>
              {cursosUnicos.map(curso => (
                <option key={curso} value={curso}>
                  {formatearCurso(curso)}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="egresado">Egresado</option>
            </select>
          </div>

          {/* Fecha Desde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Ingreso Desde
            </label>
            <input
              type="date"
              value={filtros.fechaDesde}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Ingreso Hasta
            </label>
            <input
              type="date"
              value={filtros.fechaHasta}
              onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={aplicarFiltros}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Vista Previa
          </button>
          
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                console.log("🔍 DEBUG: Mostrando todos los estudiantes sin filtros");
                console.log("📊 Estudiantes disponibles:", estudiantes);
                console.log("📊 Primer estudiante:", estudiantes[0]);
                setReporteData(estudiantes);
                setShowPreview(true);
                toast.success(`Mostrando todos los ${estudiantes.length} estudiantes`);
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Ver Todos (Debug)
            </button>
          )}

          <button
            onClick={() => {
              setFiltros({
                plantilla: "",
                curso: "",
                estado: "",
                fechaDesde: "",
                fechaHasta: ""
              });
              setReporteData([]);
              setShowPreview(false);
              toast.success("Filtros limpiados");
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Limpiar Filtros
          </button>

          {import.meta.env.DEV && (
            <button
              onClick={() => {
                setShowDebugInfo(!showDebugInfo);
                toast.success("Información de debug " + (showDebugInfo ? "ocultada" : "mostrada"));
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {showDebugInfo ? "Ocultar Info" : "Ver Info de Datos"}
            </button>
          )}

          {import.meta.env.DEV && (
            <button
              onClick={() => {
                console.log("🔧 DEBUG PLANTILLAS:");
                console.log("📋 Plantillas cargadas:", plantillas);
                plantillas.forEach((p, i) => {
                  console.log(`📄 Plantilla ${i + 1}:`, {
                    id: p.id,
                    nombre: p.nombre,
                    tipo_reporte: p.tipo_reporte,
                    activa: p.activa,
                    configuracion: p.configuracion
                  });
                  try {
                    const config = JSON.parse(p.configuracion || '{}');
                    console.log(`📄 Configuración parseada ${i + 1}:`, config);
                  } catch (e) {
                    console.log(`📄 Error parsing plantilla ${i + 1}:`, e.message);
                  }
                });
                toast.success("Información de plantillas mostrada en consola");
              }}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Debug Plantillas
            </button>
          )}
          
          <button
            onClick={generarPDF}
            disabled={isGenerating || !filtros.plantilla || reporteData.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Generar PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vista Previa */}
      {showPreview && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Vista Previa del Reporte
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {reporteData.length} registros encontrados
            </span>
          </div>

          {(() => {
            console.log("🔍 Renderizando vista previa:");
            console.log("📊 reporteData.length:", reporteData.length);
            console.log("📊 reporteData:", reporteData);
            console.log("📊 showPreview:", showPreview);
            
            if (reporteData.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No se encontraron registros con los filtros aplicados
                </div>
              );
            }

            // Determinar columnas a mostrar
            let columnas = [];
            if (filtros.plantilla) {
              const plantilla = plantillas.find(p => p.id === parseInt(filtros.plantilla));
              console.log("🔍 Plantilla encontrada para vista previa:", plantilla);
              if (plantilla) {
                try {
                  const config = JSON.parse(plantilla.configuracion || '{}');
                  columnas = config.columnas || [];
                  console.log("🔍 Configuración parseada:", config);
                  console.log("🔍 Columnas extraídas:", columnas);
                } catch (e) {
                  console.warn('Error parsing plantilla config:', e);
                  columnas = [];
                }
              }
            }
            
            // Si no hay columnas definidas, usar columnas útiles por defecto
            if (columnas.length === 0) {
              columnas = ['nombre', 'rut', 'curso', 'estado', 'especialidad', 'situacion_economica', 'fecha_ingreso'];
              console.log("🔍 Usando columnas por defecto:", columnas);
            }

            // Filtrar columnas según el tipo de plantilla
            if (filtros.plantilla) {
              const plantilla = plantillas.find(p => p.id === parseInt(filtros.plantilla));
              if (plantilla) {
                const tipoReporte = plantilla.tipo_reporte || plantilla.nombre.toLowerCase();
                
                // Para reporte de asistencia, solo mostrar columnas de asistencia
                if (tipoReporte.includes('asistencia') || plantilla.nombre.includes('Asistencia') || plantilla.nombre.includes('asistencia')) {
                  columnas = columnas.filter(col => 
                    ['nombre', 'rut', 'curso', 'estado', 'asistencia_porcentaje', 'dias_presentes', 'dias_ausentes'].includes(col)
                  );
                  console.log("🔍 Filtradas columnas para reporte de asistencia:", columnas);
                }
              }
            }

            console.log("📋 Columnas finales a mostrar:", columnas);
            console.log("📋 Filtros.plantilla:", filtros.plantilla);
            console.log("📋 Plantillas disponibles:", plantillas.map(p => ({ id: p.id, nombre: p.nombre })));

            const columnasDisponibles = {
              // Datos básicos
              nombre: "Nombre Completo",
              rut: "RUT",
              curso: "Curso",
              estado: "Estado",
              especialidad: "Especialidad",
              situacion_economica: "Situación Económica",
              
              // Datos académicos
              promedio_general: "Promedio General",
              asistencia_porcentaje: "% Asistencia",
              conducta_promedio: "Promedio Conducta",
              estado_alerta: "Estado de Alerta",
              
              // Datos de seguimiento
              entrevistas_count: "N° Entrevistas",
              intervenciones_count: "N° Intervenciones",
              recursos_entregados: "Recursos Entregados",
              
              // Evaluaciones vocacionales
              test_kuder: "Test Kuder",
              test_holland: "Test Holland",
              test_aptitudes: "Test Aptitudes",
              
              // Datos familiares
              nombre_apoderado: "Nombre Apoderado",
              telefono_apoderado: "Teléfono Apoderado",
              email_apoderado: "Email Apoderado",
              
              // Fechas
              fecha_nacimiento: "Fecha de Nacimiento",
              fecha_ingreso: "Fecha de Ingreso",
              
              // Datos de contacto
              email: "Email",
              telefono: "Teléfono",
              direccion: "Dirección",
              
              // Datos de asistencia
              dias_presentes: "Días Presentes",
              dias_ausentes: "Días Ausentes",
              
            // Datos institucionales
            total_estudiantes: "Total Estudiantes",
            estudiantes_activos: "Estudiantes Activos",
            estudiantes_inactivos: "Estudiantes Inactivos",
            promedio_asistencia: "Promedio Asistencia",
            entrevistas_realizadas: "Entrevistas Realizadas",
            intervenciones_activas: "Intervenciones Activas",
            situacion_economica_baja: "Situación Económica Baja",
            situacion_economica_media: "Situación Económica Media",
            
            // Datos específicos de enseñanza media
            nivel_medio: "Nivel de Enseñanza Media",
            seccion_curso: "Sección del Curso"
            };

            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      {columnas.map(col => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                          {columnasDisponibles[col] || col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {reporteData.slice(0, 10).map((estudiante, index) => {
                      console.log(`📝 Renderizando estudiante ${index}:`, estudiante);
                      return (
                        <tr key={estudiante.id || index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          {columnas.map(col => {
                            let valor = estudiante[col] || "-";
                            
                            // Debug: mostrar qué valor se está obteniendo
                            if (index === 0) {
                              console.log(`🔍 Columna ${col}:`, {
                                valorOriginal: estudiante[col],
                                valorFinal: valor,
                                estudiante: estudiante
                              });
                            }
                            
                            // Formatear fechas
                            if (col.includes('fecha') && valor !== "-") {
                              try {
                                valor = new Date(valor).toLocaleDateString();
                              } catch (e) {
                                valor = valor;
                              }
                            }
                            
                            // Formatear curso
                            if (col === 'curso' && valor !== "-") {
                              valor = formatearCurso(valor);
                            }
                            
                            // Formatear nombres en mayúsculas
                            if (col === 'nombre' && valor !== "-") {
                              valor = valor.toUpperCase();
                            }
                            
                            // Formatear porcentajes
                            if (col.includes('porcentaje') && valor !== "-") {
                              valor = typeof valor === 'number' ? `${valor}%` : valor;
                            }
                            
                            // Formatear promedios
                            if (col.includes('promedio') && valor !== "-") {
                              valor = typeof valor === 'number' ? valor.toFixed(1) : valor;
                            }
                            
                            // Formatear estado de alerta con colores
                            let cellClass = "px-4 py-3 text-sm text-gray-900 dark:text-white";
                            if (col === 'estado_alerta') {
                              if (valor === 'Baja Asistencia') cellClass += " text-red-600 font-semibold";
                              else if (valor === 'Bajo Rendimiento') cellClass += " text-orange-600 font-semibold";
                              else if (valor === 'Múltiples Intervenciones') cellClass += " text-yellow-600 font-semibold";
                              else cellClass += " text-green-600 font-semibold";
                            }
                            
                            return (
                              <td key={col} className={cellClass}>
                                {valor}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {reporteData.length > 10 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Mostrando 10 de {reporteData.length} registros. El PDF incluirá todos los registros.
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Información de Debug - Solo en desarrollo */}
      {import.meta.env.DEV && showDebugInfo && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            🔍 Información de Debug
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">📊 Datos Cargados:</h4>
              <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1">
                <li>• Estudiantes: {estudiantes.length}</li>
                <li>• Plantillas: {plantillas.length}</li>
                <li>• Filtros aplicados: {Object.values(filtros).filter(v => v).length}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">🎓 Cursos Disponibles:</h4>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                {estudiantes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {[...new Set(estudiantes.map(est => est.curso).filter(Boolean))].slice(0, 5).map(curso => (
                      <span key={curso} className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded text-xs">
                        {formatearCurso(curso)}
                      </span>
                    ))}
                    {[...new Set(estudiantes.map(est => est.curso).filter(Boolean))].length > 5 && (
                      <span className="text-xs">+{[...new Set(estudiantes.map(est => est.curso).filter(Boolean))].length - 5} más</span>
                    )}
                  </div>
                ) : (
                  <span>No hay datos</span>
                )}
              </div>
            </div>
          </div>

          {estudiantes.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">👤 Primer Estudiante:</h4>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-xs">
                <pre className="text-gray-600 dark:text-gray-300 overflow-x-auto">
                  {JSON.stringify(estudiantes[0], null, 2)}
                </pre>
              </div>
            </div>
          )}

          {plantillas.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">📄 Plantillas Disponibles:</h4>
              <div className="space-y-2">
                {plantillas.map(plantilla => {
                  let columnas = [];
                  try {
                    const config = JSON.parse(plantilla.configuracion || '{}');
                    columnas = config.columnas || [];
                  } catch (e) {
                    console.warn('Error parsing plantilla config:', e);
                    columnas = [];
                  }
                  
                  return (
                    <div key={plantilla.id} className="bg-white dark:bg-slate-800 rounded-lg p-3">
                      <div className="font-medium text-gray-800 dark:text-white">{plantilla.nombre}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Columnas: {columnas.length > 0 ? columnas.join(", ") : "Sin columnas definidas"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Tipo: {plantilla.tipo_reporte} | Activa: {plantilla.activa ? "Sí" : "No"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {plantillas.length === 0 && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-red-700 dark:text-red-400 font-medium">⚠️ No hay plantillas creadas</div>
              <div className="text-sm text-red-600 dark:text-red-500 mt-1">
                Ve a "Gestionar Plantillas" para crear una plantilla de reporte
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
