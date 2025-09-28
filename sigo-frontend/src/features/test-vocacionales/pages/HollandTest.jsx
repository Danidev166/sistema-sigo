/**
 * Página del test de Holland (RIASEC).
 *
 * Permite realizar el test de personalidad vocacional de Holland.
 * Integra formulario de preguntas y cálculo de resultados.
 *
 * @component
 * @returns {JSX.Element} Página del test de Holland
 *
 * @example
 * <Route path="/test-vocacionales/holland" element={<HollandTest />} />
 */
// src/features/test-vocacionales/pages/HollandTest.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import Button from "../../../components/ui/Button";
import logo from "../../../assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../services/axios";
import { interpretarHolland } from "../utils/interpretaciones";

const preguntas = [
  // REALISTA (R) - 5 preguntas
  { id: 1, texto: "¿Disfrutas reparando objetos mecánicos o arreglando cosas?", categoria: "Realista" },
  { id: 2, texto: "¿Te gusta trabajar con herramientas y máquinas?", categoria: "Realista" },
  { id: 3, texto: "¿Prefieres trabajos que requieren actividad física?", categoria: "Realista" },
  { id: 4, texto: "¿Te interesa la agricultura, pesca o actividades al aire libre?", categoria: "Realista" },
  { id: 5, texto: "¿Disfrutas construyendo o fabricando objetos?", categoria: "Realista" },
  
  // INVESTIGADOR (I) - 5 preguntas
  { id: 6, texto: "¿Te interesa hacer experimentos científicos?", categoria: "Investigador" },
  { id: 7, texto: "¿Disfrutas analizando problemas complejos?", categoria: "Investigador" },
  { id: 8, texto: "¿Te gusta estudiar y aprender sobre temas específicos?", categoria: "Investigador" },
  { id: 9, texto: "¿Prefieres trabajos que requieren pensamiento abstracto?", categoria: "Investigador" },
  { id: 10, texto: "¿Te interesa la investigación y el descubrimiento?", categoria: "Investigador" },
  
  // ARTÍSTICO (A) - 5 preguntas
  { id: 11, texto: "¿Te gusta participar en actividades creativas como la música o el arte?", categoria: "Artístico" },
  { id: 12, texto: "¿Te interesa expresarte a través del arte o la música?", categoria: "Artístico" },
  { id: 13, texto: "¿Disfrutas creando cosas originales y únicas?", categoria: "Artístico" },
  { id: 14, texto: "¿Te gusta trabajar de forma independiente y flexible?", categoria: "Artístico" },
  { id: 15, texto: "¿Prefieres ambientes de trabajo no convencionales?", categoria: "Artístico" },
  
  // SOCIAL (S) - 5 preguntas
  { id: 16, texto: "¿Disfrutas ayudar a otras personas con sus problemas?", categoria: "Social" },
  { id: 17, texto: "¿Te gusta enseñar o ayudar a otros a aprender?", categoria: "Social" },
  { id: 18, texto: "¿Te interesa trabajar en equipo y colaborar?", categoria: "Social" },
  { id: 19, texto: "¿Disfrutas escuchando y entendiendo a otras personas?", categoria: "Social" },
  { id: 20, texto: "¿Te gusta participar en actividades de servicio comunitario?", categoria: "Social" },
  
  // EMPRENDEDOR (E) - 5 preguntas
  { id: 21, texto: "¿Te interesa liderar proyectos o equipos?", categoria: "Emprendedor" },
  { id: 22, texto: "¿Disfrutas vender ideas o productos?", categoria: "Emprendedor" },
  { id: 23, texto: "¿Te gusta tomar decisiones importantes?", categoria: "Emprendedor" },
  { id: 24, texto: "¿Prefieres trabajos que requieren persuasión y negociación?", categoria: "Emprendedor" },
  { id: 25, texto: "¿Te interesa iniciar y dirigir tu propio negocio?", categoria: "Emprendedor" },
  
  // CONVENCIONAL (C) - 5 preguntas
  { id: 26, texto: "¿Prefieres seguir instrucciones claras y trabajar con datos?", categoria: "Convencional" },
  { id: 27, texto: "¿Te gustan los trabajos organizados y estructurados?", categoria: "Convencional" },
  { id: 28, texto: "¿Disfrutas trabajando con números y cálculos?", categoria: "Convencional" },
  { id: 29, texto: "¿Prefieres ambientes de trabajo estables y predecibles?", categoria: "Convencional" },
  { id: 30, texto: "¿Te gusta mantener registros y archivos organizados?", categoria: "Convencional" },
];

export default function HollandTest() {
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
      // Cargar respuestas si existen
      if (ev.respuestas) {
        setRespuestas(ev.respuestas);
      } else if (ev.resultados) {
        // Si solo hay resultados, intentar reconstruir respuestas (no siempre posible)
        try {
          const resObj = typeof ev.resultados === "string" ? JSON.parse(ev.resultados) : ev.resultados;
          setResultado(resObj);
        } catch (error) {
          console.error('Error parsing resultados:', error);
        }
      }
      // Si hay resultado guardado
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

  const handleRespuesta = (id, valor) => {
    setRespuestas((prev) => ({ ...prev, [id]: valor === "si" }));
  };

  const calcularResultado = () => {
    if (Object.keys(respuestas).length !== preguntas.length) {
      alert("⚠️ Debes responder todas las preguntas antes de calcular el resultado.");
      return;
    }

    const conteo = {};
    preguntas.forEach((p) => {
      if (respuestas[p.id]) {
        conteo[p.categoria] = (conteo[p.categoria] || 0) + 1;
      }
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
        tipo_evaluacion: "Holland",
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
    let promedio = preguntas.length > 0 ? total / preguntas.length : 0;
    const resultadoActual = resultado || { total, promedio };

    // Obtener interpretación
    const interpretacion = interpretarHolland(resultadoActual);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 15, 10, 25, 25);
      const titulo = "Evaluación Vocacional: Holland";
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

      const tabla = preguntas.map((p) => [
        p.texto,
        respuestas[p.id] === true ? "Sí" : respuestas[p.id] === false ? "No" : "-"
      ]);
      autoTable(doc, {
        head: [["Pregunta", "Puntaje"]],
        body: tabla,
        startY: 95,
        styles: { fontSize: 10 },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });

      // Agregar tabla de perfil RIASEC
      if (interpretacion.perfil) {
        const perfilTable = interpretacion.perfil.map(cat => [cat.categoria, cat.puntaje]);
        autoTable(doc, {
          head: [["Categoría RIASEC", "Puntaje"]],
          body: perfilTable,
          startY: doc.lastAutoTable.finalY + 10,
          styles: { fontSize: 10 },
          theme: "grid",
          margin: { left: 14, right: 14 },
        });
      }

      doc.save(`holland_${nombre}_${apellido}.pdf`);
    };

    img.onerror = () => {
      alert("❌ No se pudo cargar el logo.");
    };
  };

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-8 pb-10">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Test Vocacional de Holland
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
          {preguntas.map((p) => (
            <div key={p.id}>
              <p className="text-gray-700 dark:text-white mb-2">{p.texto}</p>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`pregunta-${p.id}`}
                    value="si"
                    onChange={(e) => handleRespuesta(p.id, e.target.value)}
                    checked={respuestas[p.id] === true}
                  />
                  <span className="text-sm text-gray-800 dark:text-white">Sí</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`pregunta-${p.id}`}
                    value="no"
                    onChange={(e) => handleRespuesta(p.id, e.target.value)}
                    checked={respuestas[p.id] === false}
                  />
                  <span className="text-sm text-gray-800 dark:text-white">No</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={calcularResultado} className="bg-blue-600 text-white">
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
    </ImprovedDashboardLayout>
  );
}
