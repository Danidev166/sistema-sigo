# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para el Sistema SIGO.

## Workflows Disponibles

### 🔄 CI/CD Pipeline (`ci.yml`)
- **Trigger**: Push y Pull Requests en `main` y `develop`
- **Funciones**:
  - Linting del código
  - Ejecución de tests
  - Build de la aplicación
  - Auditoría de seguridad
  - Deploy automático a Vercel (solo en `main`)

### 📊 Test Coverage (`coverage.yml`)
- **Trigger**: Push y Pull Requests en `main` y `develop`
- **Funciones**:
  - Genera reporte de cobertura de tests
  - Sube resultados a Codecov
  - Monitorea la calidad del código

### 🔍 Dependency Check (`dependencies.yml`)
- **Trigger**: Semanal (lunes) y manual
- **Funciones**:
  - Verifica dependencias desactualizadas
  - Sugiere actualizaciones seguras
  - Mantiene el proyecto actualizado

### ⚡ Performance Audit (`performance.yml`)
- **Trigger**: Push y Pull Requests en `main`
- **Funciones**:
  - Auditoría de rendimiento con Lighthouse
  - Verifica métricas de Core Web Vitals
  - Asegura buena experiencia de usuario

## Configuración Requerida

### Secrets de GitHub
Para que los workflows funcionen correctamente, configura estos secrets:

```bash
# Para deployment en Vercel
VERCEL_TOKEN=tu_token_de_vercel
VERCEL_ORG_ID=tu_org_id
VERCEL_PROJECT_ID=tu_project_id
```

### Dependencias
- Node.js 18+
- npm ci para instalación limpia
- Lighthouse CI para auditorías de rendimiento

## Monitoreo

- **Status**: Revisa el estado de los workflows en la pestaña "Actions"
- **Cobertura**: Ve los reportes en Codecov
- **Rendimiento**: Consulta los resultados de Lighthouse en los artifacts

## Troubleshooting

### Tests Fallidos
- Revisa los logs en la pestaña "Actions"
- Ejecuta `npm run test:run` localmente
- Verifica la configuración de Vitest

### Build Fallido
- Verifica que no haya errores de TypeScript/ESLint
- Ejecuta `npm run build` localmente
- Revisa las dependencias

### Deploy Fallido
- Verifica los secrets de Vercel
- Revisa la configuración del proyecto
- Consulta los logs de Vercel

---

**Sistema Integrado de Gestión y Orientación (SIGO)**  
Desarrollado para instituciones educativas