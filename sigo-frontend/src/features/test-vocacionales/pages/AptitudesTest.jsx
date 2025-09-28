/**
 * Página del test de aptitudes.
 *
 * Permite realizar el test de aptitudes vocacionales.
 * Integra formulario de preguntas y cálculo de resultados.
 *
 * @component
 * @returns {JSX.Element} Página del test de aptitudes
 *
 * @example
 * <Route path="/test-vocacionales/aptitudes" element={<AptitudesTest />} />
 */
// src/features/test-vocacionales/pages/AptitudesTest.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ImprovedDashboardLayout from "../../../components/layout/ImprovedDashboardLayout";
import Button from "../../../components/ui/Button";
import logo from "../../../assets/logo.png";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../services/axios";
import { interpretarAptitudes } from "../utils/interpretaciones";

const preguntas = [
  // APTITUD MATEMÁTICA (5 preguntas)
  "Resuelvo problemas matemáticos con facilidad.",
  "Puedo realizar cálculos mentales rápidamente.",
  "Entiendo conceptos de álgebra y geometría sin dificultad.",
  "Me gusta trabajar con números y estadísticas.",
  "Puedo resolver problemas de lógica matemática.",
  
  // APTITUD CIENTÍFICA (5 preguntas)
  "Comprendo conceptos científicos rápidamente.",
  "Me interesa entender cómo funcionan las cosas.",
  "Puedo analizar datos experimentales.",
  "Entiendo principios de física y química.",
  "Me gusta hacer experimentos y observaciones.",
  
  // APTITUD VERBAL (5 preguntas)
  "Me expreso claramente por escrito.",
  "Comprendo rápidamente lo que leo.",
  "Tengo facilidad para aprender idiomas.",
  "Puedo explicar conceptos complejos de manera simple.",
  "Me gusta escribir y redactar textos.",
  
  // APTITUD LÓGICA (5 preguntas)
  "Encuentro patrones o relaciones fácilmente.",
  "Tomo decisiones con lógica y razonamiento.",
  "Puedo resolver problemas paso a paso.",
  "Analizo situaciones desde diferentes perspectivas.",
  "Identifico errores en argumentos o razonamientos.",
  
  // APTITUD ESPACIAL (5 preguntas)
  "Puedo visualizar objetos en tres dimensiones.",
  "Tengo facilidad para leer mapas y planos.",
  "Puedo imaginar cómo se vería algo desde otro ángulo.",
  "Me gusta resolver rompecabezas y laberintos.",
  "Tengo buena orientación espacial.",
  
  // APTITUD MECÁNICA (5 preguntas)
  "Entiendo cómo funcionan las máquinas.",
  "Puedo arreglar objetos mecánicos.",
  "Me gusta trabajar con herramientas.",
  "Comprendo diagramas técnicos y esquemas.",
  "Tengo habilidad para el trabajo manual."
];

export default function AptitudesTest() {
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
      if (ev.resultados) {
        try {
          const resObj = typeof ev.resultados === "string" ? JSON.parse(ev.resultados) : ev.resultados;
          if (resObj.respuestas) setRespuestas(resObj.respuestas);
          if (resObj.resultado) setResultado(resObj.resultado);
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

  const handleRespuesta = (index, valor) => {
    setRespuestas((prev) => ({ ...prev, [index]: parseInt(valor) }));
  };

  const calcularResultado = () => {
    if (Object.keys(respuestas).length !== preguntas.length) {
      alert("⚠️ Debes responder todas las preguntas.");
      return;
    }
    const total = Object.values(respuestas).reduce((a, b) => a + b, 0);
    const promedio = total / preguntas.length;
    setResultado({ total, promedio });
    alert("✅ Resultado calculado.");
  };

  const guardarEvaluacion = async () => {
    const { nombre, apellido, rut, curso } = form;
    if (!nombre || !apellido || !rut || !curso) {
      alert("⚠️ Completa todos los campos.");
      return;
    }
    if (!resultado) {
      alert("⚠️ Debes calcular el resultado antes.");
      return;
    }

    try {
      const estudianteRes = await api.get(`/estudiantes/buscar?rut=${rut}`);
      const estudiante = estudianteRes.data;
      if (!estudiante) return alert("❌ Estudiante no encontrado.");

      const evaluacionData = {
        id_estudiante: estudiante.id,
        tipo_evaluacion: "Aptitudes",
        resultados: JSON.stringify({
          respuestas,
          resultado: { total: resultado.total, promedio: resultado.promedio },
        }),
        fecha_evaluacion: new Date().toISOString(),
        nombre_completo: `${nombre} ${apellido}`,
        curso,
      };

      const response = await api.post("/evaluaciones", evaluacionData);
      if (response.status === 201) {
        alert("✅ Evaluación guardada.");
        setForm({ nombre: "", apellido: "", rut: "", curso: "" });
        setRespuestas({});
        setResultado(null);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("⚠️ No se pudo guardar la evaluación.");
    }
  };

  const exportarPDF = () => {
    // Si no hay resultado, calcularlo antes de exportar
    let total = Object.values(respuestas).reduce((a, b) => a + b, 0);
    let promedio = preguntas.length > 0 ? total / preguntas.length : 0;
    const resultadoActual = resultado || { total, promedio };

    // Obtener interpretación
    const interpretacion = interpretarAptitudes(resultadoActual.promedio);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 15, 10, 25, 25);
      const titulo = "Evaluación Vocacional: Aptitudes";
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

      const tabla = preguntas.map((p, i) => [
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

      doc.save(`aptitudes_${nombre}_${apellido}.pdf`);
    };

    img.onerror = () => {
      alert("❌ No se pudo cargar el logo.");
    };
  };

  return (
    <ImprovedDashboardLayout>
      <div className="space-y-8 pb-12">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Test de Aptitudes Generales
        </h1>

        {/* Datos estudiante */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-white">Datos del Estudiante</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {["nombre", "apellido", "rut", "curso"].map((campo) => (
              <input
                key={campo}
                type="text"
                name={campo}
                value={form[campo]}
                onChange={handleChange}
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-slate-700 dark:text-white"
              />
            ))}
          </div>
        </div>

        {/* Preguntas */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-6">
          {preguntas.map((p, i) => (
            <div key={i}>
              <p className="text-gray-700 dark:text-white mb-2">{p}</p>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((v) => (
                  <label key={v} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name={`pregunta-${i}`}
                      value={v}
                      onChange={() => handleRespuesta(i, v)}
                      checked={respuestas[i] === v}
                    />
                    <span className="text-sm text-gray-800 dark:text-white">{v}</span>
                  </label>
                ))}
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
