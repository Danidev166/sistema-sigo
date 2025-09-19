// src/features/estudiantes/constants/cursos.js
// Constantes para cursos estandarizados del sistema SIGO

export const OPCIONES_CURSOS = [
  // 1° Medio
  { value: "1° Medio A", label: "1° Medio A" },
  { value: "1° Medio B", label: "1° Medio B" },
  { value: "1° Medio C", label: "1° Medio C" },
  { value: "1° Medio D", label: "1° Medio D" },
  { value: "1° Medio E", label: "1° Medio E" },
  
  // 2° Medio
  { value: "2° Medio A", label: "2° Medio A" },
  { value: "2° Medio B", label: "2° Medio B" },
  { value: "2° Medio C", label: "2° Medio C" },
  { value: "2° Medio D", label: "2° Medio D" },
  { value: "2° Medio E", label: "2° Medio E" },
  
  // 3° Medio
  { value: "3° Medio A", label: "3° Medio A" },
  { value: "3° Medio B", label: "3° Medio B" },
  { value: "3° Medio C", label: "3° Medio C" },
  { value: "3° Medio D", label: "3° Medio D" },
  { value: "3° Medio E", label: "3° Medio E" },
  
  // 4° Medio
  { value: "4° Medio A", label: "4° Medio A" },
  { value: "4° Medio B", label: "4° Medio B" },
  { value: "4° Medio C", label: "4° Medio C" },
  { value: "4° Medio D", label: "4° Medio D" },
  { value: "4° Medio E", label: "4° Medio E" },
];

// Opciones para filtros (incluye "Todos")
export const OPCIONES_CURSOS_FILTRO = [
  { value: "", label: "Todos los cursos" },
  ...OPCIONES_CURSOS
];

// Función para formatear el curso de manera estándar
export const formatearCurso = (curso) => {
  if (!curso) return "-";
  
  // Normalizar el curso a formato estándar
  const cursoNormalizado = curso.toString().toUpperCase().trim();
  
  // Patrones para detectar diferentes formatos (solo enseñanza media)
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

  // Si no coincide con ningún patrón, devolver tal como está
  return cursoNormalizado;
};

// Función para obtener el color del curso según el nivel (solo enseñanza media)
export const getCursoColor = (curso) => {
  if (!curso) return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  
  const cursoStr = curso.toString().toUpperCase();
  
  if (cursoStr.includes('1° MEDIO') || cursoStr.includes('1 MEDIO')) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  } else if (cursoStr.includes('2° MEDIO') || cursoStr.includes('2 MEDIO')) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  } else if (cursoStr.includes('3° MEDIO') || cursoStr.includes('3 MEDIO')) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  } else if (cursoStr.includes('4° MEDIO') || cursoStr.includes('4 MEDIO')) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  }
  
  return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
};
