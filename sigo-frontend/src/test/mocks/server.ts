import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Configurar el servidor MSW para Node.js (testing)
export const server = setupServer(...handlers)


