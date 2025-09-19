/**
 * Componente para interpretación guiada de resultados de test vocacionales.
 * Proporciona análisis visual e interpretación detallada de resultados.
 *
 * @param {Object} props
 * @param {Object} props.resultado - Resultados del test
 * @param {string} props.tipoTest - Tipo de test (Holland, Kuder, Aptitudes)
 * @param {Object} props.datosEstudiante - Datos del estudiante
 * @returns {JSX.Element}
 *
 * @example
 * <InterpretacionGuida resultado={resultado} tipoTest="Holland" datosEstudiante={estudiante} />
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function InterpretacionGuida({ resultado, tipoTest, datosEstudiante }) {
  const interpretacion = useMemo(() => {
    if (!resultado) return null;

    switch (tipoTest) {
      case 'Holland':
        return interpretarHolland(resultado);
      case 'Kuder':
        return interpretarKuder(resultado);
      case 'Aptitudes':
        return interpretarAptitudes(resultado);
      default:
        return null;
    }
  }, [resultado, tipoTest]);

  const datosGrafico = useMemo(() => {
    if (!resultado) return [];
    
    return Object.entries(resultado).map(([categoria, valor], index) => ({
      categoria,
      valor: typeof valor === 'number' ? valor : parseInt(valor) || 0,
      color: COLORS[index % COLORS.length]
    }));
  }, [resultado]);

  if (!interpretacion) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200">
          No hay resultados disponibles para interpretar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del estudiante */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Información del Estudiante
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Nombre:</span> {datosEstudiante?.nombre} {datosEstudiante?.apellido}
          </div>
          <div>
            <span className="font-medium">Curso:</span> {datosEstudiante?.curso}
          </div>
          <div>
            <span className="font-medium">Test:</span> {tipoTest}
          </div>
          <div>
            <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Gráfico de resultados */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Visualización de Resultados
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interpretación detallada */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Interpretación Guiada
        </h3>
        
        <div className="space-y-4">
          {/* Resumen ejecutivo */}
          <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Resumen Ejecutivo
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {interpretacion.resumen}
            </p>
          </div>

          {/* Fortalezas identificadas */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              Fortalezas Identificadas
            </h4>
            <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-300 space-y-1">
              {interpretacion.fortalezas.map((fortaleza, index) => (
                <li key={index}>{fortaleza}</li>
              ))}
            </ul>
          </div>

          {/* Áreas de desarrollo */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
            <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
              Áreas de Desarrollo
            </h4>
            <ul className="list-disc list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
              {interpretacion.areasDesarrollo.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          {/* Recomendaciones */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Recomendaciones
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {interpretacion.recomendaciones.map((recomendacion, index) => (
                <li key={index}>{recomendacion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Carreras sugeridas */}
      {interpretacion.carrerasSugeridas && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
            Carreras Sugeridas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretacion.carrerasSugeridas.map((carrera, index) => (
              <div key={index} className="bg-white dark:bg-slate-700 p-3 rounded shadow-sm">
                <h4 className="font-medium text-gray-800 dark:text-white">{carrera.nombre}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {carrera.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Funciones de interpretación específicas
function interpretarHolland(resultado) {
  const categorias = Object.keys(resultado);
  const valores = Object.values(resultado);
  const maxValor = Math.max(...valores);
  const categoriasDominantes = categorias.filter(cat => resultado[cat] === maxValor);

  return {
    resumen: `El estudiante muestra preferencias dominantes en las áreas: ${categoriasDominantes.join(', ')}. Esto sugiere un perfil vocacional orientado hacia actividades que requieren estas características.`,
    fortalezas: [
      `Alta afinidad con actividades ${categoriasDominantes.join(' y ')}`,
      'Capacidad de autoconocimiento vocacional',
      'Intereses bien definidos en áreas específicas'
    ],
    areasDesarrollo: [
      'Explorar áreas complementarias para ampliar opciones',
      'Desarrollar habilidades en categorías con menor puntuación',
      'Considerar la combinación de múltiples intereses'
    ],
    recomendaciones: [
      'Realizar actividades prácticas relacionadas con las áreas dominantes',
      'Investigar carreras que combinen múltiples categorías',
      'Participar en talleres vocacionales específicos',
      'Consultar con orientadores sobre opciones de estudio'
    ],
    carrerasSugeridas: obtenerCarrerasHolland(categoriasDominantes)
  };
}

function interpretarKuder(resultado) {
  const actividades = Object.keys(resultado);
  const valores = Object.values(resultado);
  const maxValor = Math.max(...valores);
  const actividadesPreferidas = actividades.filter(act => resultado[act] === maxValor);

  return {
    resumen: `El estudiante muestra mayor interés en actividades relacionadas con: ${actividadesPreferidas.join(', ')}. Esto indica preferencias claras hacia ciertos tipos de trabajo.`,
    fortalezas: [
      `Interés marcado en actividades ${actividadesPreferidas.join(' y ')}`,
      'Capacidad de identificar preferencias laborales',
      'Aptitud para actividades prácticas y específicas'
    ],
    areasDesarrollo: [
      'Explorar actividades complementarias',
      'Desarrollar habilidades en áreas menos preferidas',
      'Considerar la evolución de intereses a lo largo del tiempo'
    ],
    recomendaciones: [
      'Participar en actividades extracurriculares relacionadas',
      'Realizar pasantías en áreas de interés',
      'Investigar oficios y profesiones relacionadas',
      'Mantener un registro de experiencias laborales'
    ],
    carrerasSugeridas: obtenerCarrerasKuder(actividadesPreferidas)
  };
}

function interpretarAptitudes(resultado) {
  const promedio = resultado.promedio || 0;
  const nivel = promedio >= 4 ? 'Alto' : promedio >= 3 ? 'Medio' : 'Bajo';

  return {
    resumen: `El estudiante presenta un nivel ${nivel} de aptitudes generales (promedio: ${promedio.toFixed(1)}/5). Esto sugiere ${nivel.toLowerCase()} capacidad para el aprendizaje y desarrollo de habilidades.`,
    fortalezas: [
      `Nivel ${nivel.toLowerCase()} de aptitudes generales`,
      'Capacidad de autoevaluación',
      'Potencial para desarrollo de habilidades'
    ],
    areasDesarrollo: [
      'Identificar áreas específicas de mejora',
      'Desarrollar estrategias de aprendizaje',
      'Trabajar en habilidades específicas'
    ],
    recomendaciones: [
      'Realizar evaluaciones más específicas por área',
      'Desarrollar un plan de mejora personal',
      'Buscar apoyo en áreas de menor rendimiento',
      'Mantener un seguimiento regular del progreso'
    ]
  };
}

function obtenerCarrerasHolland(categorias) {
  const carrerasPorCategoria = {
    'Realista': [
      { nombre: 'Ingeniería Mecánica', descripcion: 'Diseño y mantenimiento de sistemas mecánicos' },
      { nombre: 'Técnico en Automotriz', descripcion: 'Reparación y mantenimiento de vehículos' },
      { nombre: 'Construcción Civil', descripcion: 'Diseño y construcción de obras civiles' }
    ],
    'Investigador': [
      { nombre: 'Medicina', descripcion: 'Investigación y práctica médica' },
      { nombre: 'Física', descripcion: 'Investigación en fenómenos físicos' },
      { nombre: 'Química', descripcion: 'Investigación en procesos químicos' }
    ],
    'Artístico': [
      { nombre: 'Diseño Gráfico', descripcion: 'Creación visual y comunicación' },
      { nombre: 'Arquitectura', descripcion: 'Diseño de espacios y estructuras' },
      { nombre: 'Música', descripcion: 'Composición e interpretación musical' }
    ],
    'Social': [
      { nombre: 'Psicología', descripcion: 'Atención y apoyo psicológico' },
      { nombre: 'Trabajo Social', descripcion: 'Apoyo y orientación social' },
      { nombre: 'Pedagogía', descripcion: 'Enseñanza y formación educativa' }
    ],
    'Emprendedor': [
      { nombre: 'Administración de Empresas', descripcion: 'Gestión y dirección empresarial' },
      { nombre: 'Marketing', descripcion: 'Estrategias de mercado y ventas' },
      { nombre: 'Derecho', descripcion: 'Asesoría legal y representación' }
    ],
    'Convencional': [
      { nombre: 'Contabilidad', descripcion: 'Gestión financiera y contable' },
      { nombre: 'Bibliotecología', descripcion: 'Gestión de información y documentación' },
      { nombre: 'Secretariado', descripcion: 'Apoyo administrativo y organizacional' }
    ]
  };

  return categorias.flatMap(categoria => carrerasPorCategoria[categoria] || []);
}

function obtenerCarrerasKuder(actividades) {
  const carrerasPorActividad = {
    'Arreglar una bicicleta': [
      { nombre: 'Técnico Mecánico', descripcion: 'Mantenimiento y reparación mecánica' },
      { nombre: 'Ingeniería Mecánica', descripcion: 'Diseño de sistemas mecánicos' }
    ],
    'Resolver un problema matemático': [
      { nombre: 'Ingeniería', descripcion: 'Aplicación de matemáticas en problemas técnicos' },
      { nombre: 'Matemáticas', descripcion: 'Investigación y enseñanza matemática' }
    ],
    'Enseñar a niños': [
      { nombre: 'Pedagogía', descripcion: 'Enseñanza y formación educativa' },
      { nombre: 'Psicopedagogía', descripcion: 'Apoyo al aprendizaje infantil' }
    ]
  };

  return actividades.flatMap(actividad => carrerasPorActividad[actividad] || []);
} 