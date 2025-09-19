#!/bin/bash

# 🧪 Script de Ejecución de Tests - Sistema SIGO
# Este script ejecuta todos los tests del proyecto

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para instalar dependencias si es necesario
install_dependencies() {
    local dir=$1
    local package_manager=$2
    
    if [ -f "$dir/package.json" ]; then
        print_status "Verificando dependencias en $dir..."
        if [ ! -d "$dir/node_modules" ]; then
            print_warning "node_modules no encontrado en $dir. Instalando dependencias..."
            cd "$dir"
            $package_manager install
            cd - > /dev/null
            print_success "Dependencias instaladas en $dir"
        else
            print_success "Dependencias ya instaladas en $dir"
        fi
    fi
}

# Función para ejecutar tests del backend
run_backend_tests() {
    print_header "🧪 EJECUTANDO TESTS DEL BACKEND"
    
    cd backend
    
    # Verificar que Jest esté instalado
    if ! command_exists npx; then
        print_error "npx no está disponible. Instalando Node.js..."
        exit 1
    fi
    
    # Instalar dependencias si es necesario
    install_dependencies "." "npm"
    
    print_status "Ejecutando tests unitarios..."
    if npm run test:unit; then
        print_success "✅ Tests unitarios del backend completados"
    else
        print_error "❌ Tests unitarios del backend fallaron"
        return 1
    fi
    
    print_status "Ejecutando tests de integración..."
    if npm run test:integration; then
        print_success "✅ Tests de integración del backend completados"
    else
        print_error "❌ Tests de integración del backend fallaron"
        return 1
    fi
    
    print_status "Generando reporte de cobertura..."
    if npm run test:coverage; then
        print_success "✅ Reporte de cobertura del backend generado"
    else
        print_error "❌ Error generando reporte de cobertura del backend"
        return 1
    fi
    
    cd ..
}

# Función para ejecutar tests del frontend
run_frontend_tests() {
    print_header "🧪 EJECUTANDO TESTS DEL FRONTEND"
    
    cd sigo-frontend
    
    # Verificar que Node.js esté instalado
    if ! command_exists npm; then
        print_error "npm no está disponible. Instalando Node.js..."
        exit 1
    fi
    
    # Instalar dependencias si es necesario
    install_dependencies "." "npm"
    
    print_status "Ejecutando tests unitarios..."
    if npm run test:unit; then
        print_success "✅ Tests unitarios del frontend completados"
    else
        print_error "❌ Tests unitarios del frontend fallaron"
        return 1
    fi
    
    print_status "Ejecutando tests de integración..."
    if npm run test:integration; then
        print_success "✅ Tests de integración del frontend completados"
    else
        print_error "❌ Tests de integración del frontend fallaron"
        return 1
    fi
    
    print_status "Ejecutando tests de componentes..."
    if npm run test:components; then
        print_success "✅ Tests de componentes del frontend completados"
    else
        print_error "❌ Tests de componentes del frontend fallaron"
        return 1
    fi
    
    print_status "Generando reporte de cobertura..."
    if npm run test:coverage; then
        print_success "✅ Reporte de cobertura del frontend generado"
    else
        print_error "❌ Error generando reporte de cobertura del frontend"
        return 1
    fi
    
    cd ..
}

# Función para ejecutar tests E2E con Cypress
run_e2e_tests() {
    print_header "🧪 EJECUTANDO TESTS E2E CON CYPRESS"
    
    cd sigo-frontend
    
    # Verificar que Cypress esté instalado
    if ! command_exists npx; then
        print_error "npx no está disponible"
        exit 1
    fi
    
    print_status "Verificando instalación de Cypress..."
    if ! npx cypress verify; then
        print_warning "Cypress no está instalado. Instalando..."
        npm install cypress --save-dev
    fi
    
    print_status "Ejecutando tests E2E en modo headless..."
    if npm run test:e2e; then
        print_success "✅ Tests E2E completados"
    else
        print_error "❌ Tests E2E fallaron"
        return 1
    fi
    
    cd ..
}

# Función para ejecutar tests de rendimiento
run_performance_tests() {
    print_header "🧪 EJECUTANDO TESTS DE RENDIMIENTO"
    
    cd sigo-frontend
    
    print_status "Ejecutando tests de rendimiento..."
    if npm run test:performance; then
        print_success "✅ Tests de rendimiento completados"
    else
        print_warning "⚠️ Tests de rendimiento no disponibles o fallaron"
    fi
    
    cd ..
}

# Función para mostrar resumen de resultados
show_summary() {
    print_header "📊 RESUMEN DE TESTS"
    
    echo -e "${CYAN}Tests ejecutados:${NC}"
    echo -e "  • Backend (Unitarios + Integración)"
    echo -e "  • Frontend (Unitarios + Integración + Componentes)"
    echo -e "  • E2E (Cypress)"
    echo -e "  • Rendimiento"
    
    echo -e "\n${CYAN}Reportes generados:${NC}"
    echo -e "  • Backend: ./backend/coverage/"
    echo -e "  • Frontend: ./sigo-frontend/coverage/"
    echo -e "  • E2E: ./sigo-frontend/cypress/videos/"
    
    print_success "🎉 Todos los tests han sido ejecutados exitosamente!"
}

# Función para mostrar ayuda
show_help() {
    echo -e "${CYAN}Uso: $0 [OPCIÓN]${NC}"
    echo ""
    echo -e "${YELLOW}Opciones:${NC}"
    echo -e "  ${GREEN}all${NC}        - Ejecutar todos los tests (por defecto)"
    echo -e "  ${GREEN}backend${NC}    - Solo tests del backend"
    echo -e "  ${GREEN}frontend${NC}   - Solo tests del frontend"
    echo -e "  ${GREEN}e2e${NC}        - Solo tests E2E"
    echo -e "  ${GREEN}performance${NC} - Solo tests de rendimiento"
    echo -e "  ${GREEN}help${NC}       - Mostrar esta ayuda"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo -e "  $0              # Ejecutar todos los tests"
    echo -e "  $0 backend      # Solo backend"
    echo -e "  $0 frontend     # Solo frontend"
    echo -e "  $0 e2e          # Solo E2E"
}

# Función principal
main() {
    print_header "🚀 SISTEMA SIGO - EJECUTOR DE TESTS"
    
    # Obtener argumento (por defecto: all)
    local option=${1:-all}
    
    case $option in
        "all")
            print_status "Ejecutando todos los tests..."
            run_backend_tests
            run_frontend_tests
            run_e2e_tests
            run_performance_tests
            show_summary
            ;;
        "backend")
            run_backend_tests
            ;;
        "frontend")
            run_frontend_tests
            ;;
        "e2e")
            run_e2e_tests
            ;;
        "performance")
            run_performance_tests
            ;;
        "help"|"-h"|"--help")
            show_help
            exit 0
            ;;
        *)
            print_error "Opción desconocida: $option"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal con argumentos
main "$@" 