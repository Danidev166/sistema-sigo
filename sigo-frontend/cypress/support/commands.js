// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comando para login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Comando para logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/login')
})

// Comando para esperar que se cargue la página
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('not.have.class', 'loading')
})

// Comando para verificar que no hay errores en consola
Cypress.Commands.add('checkConsoleErrors', () => {
  cy.window().then((win) => {
    cy.spy(win.console, 'error').as('consoleError')
  })
})

// Comando para limpiar localStorage
Cypress.Commands.add('clearLocalStorage', () => {
  cy.window().then((win) => {
    win.localStorage.clear()
  })
})

// Comando para interceptar API calls
Cypress.Commands.add('interceptAPI', (method, url, response) => {
  cy.intercept(method, url, response).as(`${method.toLowerCase()}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`)
})

// Comando para verificar que un elemento está visible y clickeable
Cypress.Commands.add('clickIfVisible', (selector) => {
  cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).should('be.visible').click()
    }
  })
})

// Comando para esperar que un elemento desaparezca
Cypress.Commands.add('waitForElementToDisappear', (selector) => {
  cy.get(selector).should('not.exist')
})

// Comando para verificar que un toast/notificación aparece
Cypress.Commands.add('checkToast', (message) => {
  cy.get('[data-testid="toast"]').should('contain', message)
})

// Comando para llenar formulario dinámicamente
Cypress.Commands.add('fillForm', (formData) => {
  Object.keys(formData).forEach(field => {
    const value = formData[field]
    cy.get(`[name="${field}"]`).type(value)
  })
})

// Comando para verificar que una tabla tiene datos
Cypress.Commands.add('checkTableHasData', (tableSelector) => {
  cy.get(tableSelector).find('tbody tr').should('have.length.greaterThan', 0)
})

// Comando para verificar que un modal está abierto
Cypress.Commands.add('checkModalOpen', (modalTitle) => {
  cy.get('[role="dialog"]').should('be.visible')
  if (modalTitle) {
    cy.get('[role="dialog"]').should('contain', modalTitle)
  }
})

// Comando para cerrar modal
Cypress.Commands.add('closeModal', () => {
  cy.get('[role="dialog"]').find('button[aria-label="Close"]').click()
  cy.get('[role="dialog"]').should('not.exist')
}) 