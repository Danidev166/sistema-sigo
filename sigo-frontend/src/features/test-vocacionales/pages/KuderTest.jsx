/**
 * Página del test de Kuder.
 *
 * Permite realizar el test de preferencias vocacionales de Kuder.
 * Integra formulario de preguntas y cálculo de resultados.
 *
 * @component
 * @returns {JSX.Element} Página del test de Kuder
 *
 * @example
 * <Route path="/test-vocacionales/kuder" element={<KuderTest />} />
 */
// src/features/test-vocacionales/pages/KuderTest.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import Button from "../../../components/ui/Button";
import logo from "../../../assets/logo.png";
import api from "../../../services/axios";
import { interpretarKuder } from "../utils/interpretaciones";

const triadas = [
  // GRUPO 1-5: Actividades técnicas y mecánicas
  ["Arreglar una bicicleta", "Resolver un problema matemático", "Enseñar a niños"],
  ["Reparar un motor", "Diseñar un edificio", "Escribir un artículo"],
  ["Trabajar con herramientas", "Analizar datos científicos", "Dirigir una orquesta"],
  ["Construir una maqueta", "Hacer experimentos", "Pintar un cuadro"],
  ["Instalar un sistema eléctrico", "Calcular presupuestos", "Enseñar a adultos"],
  
  // GRUPO 6-10: Actividades creativas y artísticas
  ["Diseñar un afiche", "Organizar archivos", "Investigar sobre plantas"],
  ["Crear una obra de arte", "Vender productos", "Trabajar al aire libre"],
  ["Escribir cuentos", "Hacer experimentos", "Cantar en público"],
  ["Tocar un instrumento musical", "Leer poesía", "Convencer a alguien de una idea"],
  ["Fotografiar paisajes", "Organizar eventos", "Estudiar historia"],
  
  // GRUPO 11-15: Actividades sociales y de servicio
  ["Cuidar animales", "Reparar un motor", "Calcular presupuestos"],
  ["Ayudar a personas enfermas", "Resolver problemas matemáticos", "Dirigir una orquesta"],
  ["Trabajar en equipo", "Trabajar solo", "Liderar un proyecto"],
  ["Enseñar a niños", "Diseñar un edificio", "Analizar datos científicos"],
  ["Participar en voluntariado", "Crear una obra de arte", "Vender productos"],
  
  // GRUPO 16-20: Actividades de liderazgo y emprendimiento
  ["Convencer a alguien de una idea", "Leer poesía", "Tocar un instrumento musical"],
  ["Dirigir una empresa", "Investigar en laboratorio", "Escribir un libro"],
  ["Liderar un proyecto", "Trabajar con números", "Trabajar con personas"],
  ["Tomar decisiones importantes", "Seguir instrucciones", "Innovar constantemente"],
  ["Vender ideas", "Organizar archivos", "Debatir un tema"],
  
  // GRUPO 21-25: Actividades de investigación y análisis
  ["Investigar sobre plantas", "Diseñar un afiche", "Organizar archivos"],
  ["Analizar datos científicos", "Ayudar a personas enfermas", "Resolver problemas matemáticos"],
  ["Estudiar medicina", "Crear una obra de arte", "Vender productos"],
  ["Hacer experimentos", "Escribir cuentos", "Cantar en público"],
  ["Investigar en laboratorio", "Dirigir una orquesta", "Leer poesía"],
  
  // GRUPO 26-30: Actividades organizativas y administrativas
  ["Organizar archivos", "Investigar sobre plantas", "Diseñar un afiche"],
  ["Calcular presupuestos", "Cuidar animales", "Reparar un motor"],
  ["Trabajar con números", "Trabajar con personas", "Trabajar con ideas"],
  ["Seguir instrucciones", "Tomar decisiones", "Innovar constantemente"],
  ["Mantener registros", "Planificar actividades", "Supervisar trabajos"]
];

export default function KuderTest() {
  const [form, setForm] = useState({ nombre: "", apellido: "", rut: "", curso: "" });
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.evaluacion) {
      const ev = location.state.evaluacion;
      // Separar nombre y apellido si es posible
      let nombre = "", apellido = "";
      if (ev.nombre_completo) {
        const partes = ev.nombre_completo.split(" ");
        nombre = partes[0] || "";
        apellido = partes.slice(1).join(" ") || "";
      }
      setForm({
        nombre,
        apellido,
        rut: ev.rut || "",
        curso: ev.curso || ""
      });
      // Cargar respuestas y resultado si existen
      if (ev.respuestas) setRespuestas(ev.respuestas);
      if (ev.resultados) {
        try {
          const resObj = typeof ev.resultados === "string" ? JSON.parse(ev.resultados) : ev.resultados;
          setResultado(resObj);
        } catch (error) {
          console.error('Error parsing resultados:', error);
        }
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeleccion = (index, opcion) => {
    setRespuestas((prev) => ({ ...prev, [index]: opcion }));
  };

  const procesarResultado = () => {
    if (Object.keys(respuestas).length !== triadas.length) {
      alert("⚠️ Debes responder todas las triadas antes de calcular el resultado.");
      return;
    }

    const conteo = {};
    Object.values(respuestas).forEach((valor, i) => {
      const actividad = triadas[i][valor];
      conteo[actividad] = (conteo[actividad] || 0) + 1;
    });
    setResultado(conteo);
    alert("✅ Resultado calculado correctamente");
  };

  const guardarEvaluacion = async () => {
    const { nombre, apellido, rut, curso } = form;
    if (!nombre || !apellido || !rut || !curso) {
      alert("⚠️ Completa todos los campos del formulario.");
      return;
    }
    if (!resultado) {
      alert("⚠️ Debes calcular el resultado antes de guardar.");
      return;
    }

    try {
      const estudianteRes = await api.get(`/estudiantes/buscar?rut=${rut}`);
      const estudiante = estudianteRes.data;

      if (!estudiante) {
        alert("❌ Estudiante no encontrado por RUT.");
        return;
      }

      const evaluacionData = {
        id_estudiante: estudiante.id,
        tipo_evaluacion: "Kuder",
        resultados: JSON.stringify(resultado),
        fecha_evaluacion: new Date().toISOString(),
        nombre_completo: `${nombre} ${apellido}`,
        curso,
      };

      const response = await api.post("/evaluaciones", evaluacionData);
      if (response.status === 201) {
        alert("✅ Evaluación guardada correctamente.");
        setForm({ nombre: "", apellido: "", rut: "", curso: "" });
        setRespuestas({});
        setResultado(null);
      }
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert(error.response?.data?.message || "⚠️ No se pudo guardar la evaluación.");
    }
  };

  const exportarPDF = () => {
    // Si no hay resultado, calcularlo antes de exportar
    let total = Object.values(respuestas).reduce((a, b) => a + b, 0);
    let promedio = triadas.length > 0 ? total / triadas.length : 0;
    const resultadoActual = resultado || { total, promedio };

    // Obtener interpretación
    const interpretacion = interpretarKuder(resultadoActual);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 15, 10, 25, 25);
      const titulo = "Evaluación Vocacional: Kuder";
      const centerX = (pageWidth - doc.getTextWidth(titulo)) / 2;
      doc.setFontSize(14).setFont("helvetica", "bold");
      doc.text("Liceo Bicentenario Politécnico Caupolicán", 45, 20);
      doc.setFontSize(11).setFont("helvetica", "normal");
      doc.text(titulo, centerX, 27);

      const { nombre, apellido, rut, curso } = form;
      doc.text(`Nombre: ${nombre} ${apellido}`, 14, 45);
      doc.text(`RUT: ${rut}`, 14, 52);
      doc.text(`Curso: ${curso}`, 14, 59);
      doc.text(`Promedio: ${resultadoActual.promedio ? resultadoActual.promedio.toFixed(1) : "-"}`, 14, 66);
      doc.text(`Perfil: ${interpretacion.tipo}`, 14, 73);
      doc.text(`Descripción: ${interpretacion.descripcion}`, 14, 80);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 87);

      const tabla = triadas.map((p, i) => [
        p,
        respuestas[i] !== undefined ? `${respuestas[i]} pts` : "- pts"
      ]);
      autoTable(doc, {
        head: [["Pregunta", "Puntaje"]],
        body: tabla,
        startY: 95,
        styles: { fontSize: 10 },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });

      // Agregar tabla de preferencias
      if (interpretacion.preferencias) {
        const preferenciasTable = interpretacion.preferencias.map(pref => [pref.tipo, pref.frecuencia]);
        autoTable(doc, {
          head: [["Tipo de Actividad", "Frecuencia"]],
          body: preferenciasTable,
          startY: doc.lastAutoTable.finalY + 10,
          styles: { fontSize: 10 },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });
      }

      doc.save(`kuder_${nombre}_${apellido}.pdf`);
    };

    img.onerror = () => {
      alert("❌ No se pudo cargar el logo.");
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Test de Intereses Kuder
        </h1>

        {/* Datos del estudiante */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-white">Datos del Estudiante</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="input" />
            <input type="text" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" className="input" />
            <input type="text" name="rut" value={form.rut} onChange={handleChange} placeholder="RUT" className="input" />
            <input type="text" name="curso" value={form.curso} onChange={handleChange} placeholder="Curso" className="input" />
          </div>
        </div>

        {/* Preguntas */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-6">
          {triadas.map((grupo, i) => (
            <div key={i}>
              <p className="text-gray-700 dark:text-white mb-2">Triada {i + 1}:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                {grupo.map((actividad, j) => (
                  <label key={j} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`triada-${i}`}
                      value={j}
                      checked={respuestas[i] === j}
                      onChange={() => handleSeleccion(i, j)}
                    />
                    <span className="text-sm text-gray-800 dark:text-white">{actividad}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={procesarResultado} className="bg-blue-600 text-white">
            Calcular
          </Button>
          <Button onClick={guardarEvaluacion} className="bg-green-600 text-white">
            Guardar
          </Button>
          <Button onClick={exportarPDF} className="bg-gray-600 text-white">
            Exportar PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
