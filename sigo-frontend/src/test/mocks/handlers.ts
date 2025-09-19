import { http, HttpResponse } from 'msw'

// Mock data para testing
const mockUsers = [
  {
    id: 1,
    nombre: 'Admin',
    apellido: 'Test',
    email: 'admin@test.com',
    rol: 'Admin',
    estado: true
  },
  {
    id: 2,
    nombre: 'Orientador',
    apellido: 'Test',
    email: 'orientador@test.com',
    rol: 'Orientador',
    estado: true
  }
]

const mockEstudiantes = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    rut: '12.345.678-9',
    email: 'juan@test.com',
    curso: '4° Medio A',
    especialidad: 'Técnico en Informática',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    rut: '98.765.432-1',
    email: 'maria@test.com',
    curso: '3° Medio B',
    especialidad: 'Técnico en Enfermería',
    estado: 'Activo'
  }
]

const mockDashboard = {
  totalEstudiantes: 150,
  totalUsuarios: 8,
  entrevistasHoy: 5,
  testCompletados: 45
}

// Handlers para las APIs
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      usuario: mockUsers[0]
    })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ mensaje: 'Logout exitoso' })
  }),

  // Usuarios endpoints
  http.get('/api/usuarios', () => {
    return HttpResponse.json(mockUsers)
  }),

  http.post('/api/usuarios', () => {
    return HttpResponse.json({
      id: 3,
      nombre: 'Nuevo',
      apellido: 'Usuario',
      email: 'nuevo@test.com',
      rol: 'Orientador',
      estado: true
    })
  }),

  http.patch('/api/usuarios/:id/estado', () => {
    return HttpResponse.json({ mensaje: 'Estado actualizado correctamente' })
  }),

  // Estudiantes endpoints
  http.get('/api/estudiantes', () => {
    return HttpResponse.json(mockEstudiantes)
  }),

  http.get('/api/estudiantes/:id', ({ params }) => {
    const estudiante = mockEstudiantes.find(e => e.id === parseInt(params.id))
    return HttpResponse.json(estudiante || {})
  }),

  http.post('/api/estudiantes', () => {
    return HttpResponse.json({
      id: 3,
      nombre: 'Nuevo',
      apellido: 'Estudiante',
      rut: '11.111.111-1',
      email: 'nuevo@test.com',
      curso: '2° Medio A',
      especialidad: 'Técnico en Mecánica',
      estado: 'Activo'
    })
  }),

  // Dashboard endpoints
  http.get('/api/dashboard/resumen', () => {
    return HttpResponse.json(mockDashboard)
  }),

  // Evaluaciones endpoints
  http.post('/api/evaluaciones', () => {
    return HttpResponse.json({
      id: 1,
      mensaje: 'Evaluación guardada correctamente'
    })
  }),

  // Notificaciones endpoints
  http.get('/api/notificaciones', () => {
    return HttpResponse.json([])
  }),

  // Fallback para rutas no manejadas
  http.get('*', () => {
    return HttpResponse.json({ error: 'Ruta no encontrada' }, { status: 404 })
  })
]


