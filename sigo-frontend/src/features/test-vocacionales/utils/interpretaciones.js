/**
 * Utilidades para interpretar resultados de tests vocacionales
 */

// Interpretaciones para Test de Aptitudes
export const interpretarAptitudes = (promedio) => {
  if (promedio >= 4.5) {
    return {
      tipo: "Excelente",
      descripcion: "Alto nivel de aptitudes generales",
      color: "text-green-600 dark:text-green-400",
      icono: "⭐"
    };
  } else if (promedio >= 3.5) {
    return {
      tipo: "Bueno",
      descripcion: "Buen nivel de aptitudes generales",
      color: "text-blue-600 dark:text-blue-400",
      icono: "👍"
    };
  } else if (promedio >= 2.5) {
    return {
      tipo: "Regular",
      descripcion: "Nivel regular de aptitudes generales",
      color: "text-yellow-600 dark:text-yellow-400",
      icono: "📊"
    };
  } else {
    return {
      tipo: "Necesita apoyo",
      descripcion: "Requiere apoyo en aptitudes generales",
      color: "text-red-600 dark:text-red-400",
      icono: "💡"
    };
  }
};

// Interpretaciones para Test de Holland (RIASEC)
export const interpretarHolland = (resultados) => {
  const categorias = {
    Realista: { descripcion: "Técnico/Manual", icono: "🔧", color: "text-blue-600" },
    Investigador: { descripcion: "Científico/Analítico", icono: "🔬", color: "text-green-600" },
    Artístico: { descripcion: "Creativo/Expresivo", icono: "🎨", color: "text-purple-600" },
    Social: { descripcion: "Humanitario/Ayuda", icono: "🤝", color: "text-pink-600" },
    Emprendedor: { descripcion: "Líder/Persuasivo", icono: "💼", color: "text-orange-600" },
    Convencional: { descripcion: "Organizado/Detallista", icono: "📋", color: "text-gray-600" }
  };

  // Encontrar las 2 categorías con mayor puntaje
  const sorted = Object.entries(resultados)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);

  const perfil = sorted.map(([categoria, puntaje]) => ({
    categoria,
    puntaje,
    ...categorias[categoria]
  }));

  return {
    perfil,
    tipo: `${perfil[0].categoria}-${perfil[1].categoria}`,
    descripcion: `${perfil[0].descripcion} con tendencia ${perfil[1].descripcion.toLowerCase()}`,
    color: "text-indigo-600 dark:text-indigo-400",
    icono: "🧠"
  };
};

// Interpretaciones para Test de Kuder
export const interpretarKuder = (resultados) => {
  const actividades = {
    "Arreglar una bicicleta": { tipo: "Mecánico", icono: "🔧", color: "text-blue-600" },
    "Resolver un problema matemático": { tipo: "Analítico", icono: "📐", color: "text-green-600" },
    "Enseñar a niños": { tipo: "Educativo", icono: "👨‍🏫", color: "text-yellow-600" },
    "Diseñar un afiche": { tipo: "Creativo", icono: "🎨", color: "text-purple-600" },
    "Organizar archivos": { tipo: "Organizativo", icono: "📁", color: "text-gray-600" },
    "Investigar sobre plantas": { tipo: "Científico", icono: "🔬", color: "text-teal-600" },
    "Convencer a alguien de una idea": { tipo: "Persuasivo", icono: "💬", color: "text-orange-600" },
    "Leer poesía": { tipo: "Literario", icono: "📖", color: "text-pink-600" },
    "Tocar un instrumento musical": { tipo: "Musical", icono: "🎵", color: "text-indigo-600" },
    "Cuidar animales": { tipo: "Cuidado", icono: "🐾", color: "text-brown-600" },
    "Reparar un motor": { tipo: "Técnico", icono: "⚙️", color: "text-blue-600" },
    "Calcular presupuestos": { tipo: "Financiero", icono: "💰", color: "text-green-600" },
    "Escribir cuentos": { tipo: "Narrativo", icono: "✍️", color: "text-purple-600" },
    "Hacer experimentos": { tipo: "Experimental", icono: "🧪", color: "text-teal-600" },
    "Cantar en público": { tipo: "Artístico", icono: "🎤", color: "text-pink-600" },
    "Trabajar al aire libre": { tipo: "Natural", icono: "🌿", color: "text-green-600" },
    "Debatir un tema": { tipo: "Argumentativo", icono: "🗣️", color: "text-orange-600" },
    "Crear una obra de arte": { tipo: "Creativo", icono: "🎭", color: "text-purple-600" }
  };

  // Encontrar las 3 actividades más seleccionadas
  const sorted = Object.entries(resultados)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const preferencias = sorted.map(([actividad, frecuencia]) => ({
    actividad,
    frecuencia,
    ...actividades[actividad]
  }));

  return {
    preferencias,
    tipo: preferencias[0].tipo,
    descripcion: `Interés principal en actividades ${preferencias[0].tipo.toLowerCase()}`,
    color: "text-indigo-600 dark:text-indigo-400",
    icono: "🧩"
  };
};

// Función general para interpretar cualquier test
export const interpretarResultado = (tipo, resultados) => {
  switch (tipo) {
    case 'Aptitudes':
      if (resultados.resultado && resultados.resultado.promedio) {
        return interpretarAptitudes(resultados.resultado.promedio);
      }
      return null;
    
    case 'Holland':
      return interpretarHolland(resultados);
    
    case 'Kuder':
      return interpretarKuder(resultados);
    
    default:
      return null;
  }
}; 