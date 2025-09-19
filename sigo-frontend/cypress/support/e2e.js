// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configuración global para Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false previene que Cypress falle en errores no capturados
  // Útil para errores de librerías externas
  return false
})

// Configurar timeouts globales
Cypress.config('defaultCommandTimeout', 10000)
Cypress.config('requestTimeout', 10000)
Cypress.config('responseTimeout', 10000)

// Configurar viewport por defecto
Cypress.config('viewportWidth', 1280)
Cypress.config('viewportHeight', 720) 