describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    // Interceptar llamadas a la API para simular respuestas
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'admin',
          nombre: 'Test User'
        }
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          role: 'admin',
          nombre: 'Test User'
        }
      }
    }).as('verifyRequest');
  });

  it('should login successfully and redirect to dashboard', () => {
    cy.visit('/login');

    // Verificar que estamos en la página de login
    cy.get('h1').should('contain', 'Iniciar Sesión');

    // Llenar el formulario
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Esperar a que se complete la petición
    cy.wait('@loginRequest');

    // Verificar que se redirige al dashboard
    cy.url().should('include', '/dashboard');

    // Verificar que se muestra el nombre del usuario
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });

  it('should show error message for invalid credentials', () => {
    // Interceptar con error
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Credenciales inválidas'
      }
    }).as('loginError');

    cy.visit('/login');

    // Llenar el formulario con credenciales incorrectas
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Esperar a que se complete la petición
    cy.wait('@loginError');

    // Verificar que se muestra el mensaje de error
    cy.get('[data-testid="error-message"]').should('contain', 'Credenciales inválidas');

    // Verificar que seguimos en la página de login
    cy.url().should('include', '/login');
  });

  it('should validate required fields', () => {
    cy.visit('/login');

    // Intentar enviar el formulario vacío
    cy.get('button[type="submit"]').click();

    // Verificar que se muestran mensajes de validación
    cy.get('input[name="email"]').should('have.attr', 'aria-invalid', 'true');
    cy.get('input[name="password"]').should('have.attr', 'aria-invalid', 'true');
  });

  it('should logout successfully', () => {
    // Interceptar logout
    cy.intercept('POST', '**/auth/logout', {
      statusCode: 200,
      body: { success: true }
    }).as('logoutRequest');

    // Login primero
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');

    // Verificar que estamos en el dashboard
    cy.url().should('include', '/dashboard');

    // Hacer logout
    cy.get('[data-testid="logout-button"]').click();

    // Esperar a que se complete la petición
    cy.wait('@logoutRequest');

    // Verificar que se redirige al login
    cy.url().should('include', '/login');
  });
}); 