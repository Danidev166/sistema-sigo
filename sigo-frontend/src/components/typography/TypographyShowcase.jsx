import React from 'react';

/**
 * Componente showcase para demostrar el sistema de tipografía institucional
 * Útil para verificar consistencia y para documentación
 */
export default function TypographyShowcase() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-institutional-5xl mb-4">Sistema de Tipografía Institucional</h1>
        <p className="text-institutional-lg text-gray-600">
          Fuentes optimizadas para sistemas gubernamentales e institucionales
        </p>
      </div>

      {/* Jerarquía de títulos */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Jerarquía de Títulos</h2>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-institutional-5xl mb-2">Título Principal (5xl)</h1>
            <code className="text-code text-sm">text-institutional-5xl</code>
          </div>
          
          <div>
            <h2 className="text-institutional-4xl mb-2">Título Secundario (4xl)</h2>
            <code className="text-code text-sm">text-institutional-4xl</code>
          </div>
          
          <div>
            <h3 className="text-institutional-3xl mb-2">Título Terciario (3xl)</h3>
            <code className="text-code text-sm">text-institutional-3xl</code>
          </div>
          
          <div>
            <h4 className="text-institutional-2xl mb-2">Título Cuaternario (2xl)</h4>
            <code className="text-code text-sm">text-institutional-2xl</code>
          </div>
          
          <div>
            <h5 className="text-institutional-xl mb-2">Título Quinto (xl)</h5>
            <code className="text-code text-sm">text-institutional-xl</code>
          </div>
        </div>
      </section>

      {/* Texto de contenido */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Texto de Contenido</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-institutional-lg mb-2">Texto destacado (lg)</p>
            <code className="text-code text-sm">text-institutional-lg</code>
          </div>
          
          <div>
            <p className="text-institutional-base mb-2">Texto base (base) - Este es el tamaño estándar para contenido principal en sistemas institucionales.</p>
            <code className="text-code text-sm">text-institutional-base</code>
          </div>
          
          <div>
            <p className="text-institutional-sm mb-2">Texto secundario (sm) - Para información complementaria y notas.</p>
            <code className="text-code text-sm">text-institutional-sm</code>
          </div>
          
          <div>
            <p className="text-institutional-xs mb-2">Texto pequeño (xs) - Para etiquetas y metadatos.</p>
            <code className="text-code text-sm">text-institutional-xs</code>
          </div>
        </div>
      </section>

      {/* Tipografía para documentos */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Tipografía para Documentos</h2>
        
        <div className="prose-institutional max-w-none">
          <h3 className="text-document-heading mb-4">Documento Institucional</h3>
          <p className="text-document mb-4">
            Este es un ejemplo de texto para documentos institucionales usando Source Sans Pro. 
            Esta fuente está optimizada para la lectura de contenido largo y proporciona 
            una excelente legibilidad en documentos oficiales.
          </p>
          <p className="text-document">
            La tipografía institucional debe ser clara, profesional y accesible para 
            todos los usuarios, incluyendo aquellos con necesidades especiales de lectura.
          </p>
        </div>
      </section>

      {/* Formularios */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Formularios</h2>
        
        <div className="max-w-md space-y-4">
          <div>
            <label className="text-form-label block mb-2">Nombre del Estudiante</label>
            <input 
              type="text" 
              className="text-form-input w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ingrese el nombre completo"
            />
            <p className="text-form-help mt-1">Este campo es obligatorio</p>
          </div>
          
          <div>
            <label className="text-form-label block mb-2">RUT</label>
            <input 
              type="text" 
              className="text-form-input w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="12.345.678-9"
            />
          </div>
        </div>
      </section>

      {/* Tablas */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Tablas de Datos</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-table-header px-4 py-2 text-left border-b">ID</th>
                <th className="text-table-header px-4 py-2 text-left border-b">Nombre</th>
                <th className="text-table-header px-4 py-2 text-left border-b">Curso</th>
                <th className="text-table-header px-4 py-2 text-left border-b">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-table-cell px-4 py-2 border-b">001</td>
                <td className="text-table-cell px-4 py-2 border-b">Juan Pérez</td>
                <td className="text-table-cell px-4 py-2 border-b">4° Medio A</td>
                <td className="text-table-cell px-4 py-2 border-b">Activo</td>
              </tr>
              <tr>
                <td className="text-table-cell px-4 py-2 border-b">002</td>
                <td className="text-table-cell px-4 py-2 border-b">María González</td>
                <td className="text-table-cell px-4 py-2 border-b">3° Medio B</td>
                <td className="text-table-cell px-4 py-2 border-b">Activo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Código */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Código</h2>
        
        <div className="bg-gray-900 p-4 rounded-lg">
          <code className="text-code-block text-green-400">
{`// Ejemplo de código
function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}

const mensaje = saludar('SIGO');
console.log(mensaje);`}
          </code>
        </div>
      </section>

      {/* Navegación */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Navegación</h2>
        
        <nav className="space-y-2">
          <div className="text-nav-title">SIGO</div>
          <div className="space-y-1">
            <a href="#" className="text-nav-item block hover:text-blue-600">Dashboard</a>
            <a href="#" className="text-nav-item block hover:text-blue-600">Estudiantes</a>
            <a href="#" className="text-nav-item block hover:text-blue-600">Reportes</a>
            <a href="#" className="text-nav-item block hover:text-blue-600">Configuración</a>
          </div>
        </nav>
      </section>

      {/* Alertas */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Alertas y Notificaciones</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-alert-title text-blue-800 mb-2">Información</h4>
            <p className="text-alert text-blue-700">Este es un mensaje informativo para el usuario.</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-alert-title text-yellow-800 mb-2">Advertencia</h4>
            <p className="text-alert text-yellow-700">Por favor, revise los datos antes de continuar.</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-alert-title text-red-800 mb-2">Error</h4>
            <p className="text-alert text-red-700">Ha ocurrido un error al procesar la solicitud.</p>
          </div>
        </div>
      </section>

      {/* Utilidades de accesibilidad */}
      <section className="space-y-6">
        <h2 className="text-institutional-3xl font-bold text-gray-800 mb-6">Utilidades de Accesibilidad</h2>
        
        <div className="space-y-4">
          <p className="text-institutional-base">Texto normal</p>
          <p className="text-institutional-base text-high-contrast">Texto de alto contraste</p>
          <p className="text-large-print">Texto de impresión grande</p>
        </div>
      </section>
    </div>
  );
}
