import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      retryCount: this.state.retryCount + 1
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Here you could send error to monitoring service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, retryCount, showDetails } = this.state;
      const { fallback } = this.props;

      // Custom fallback component
      if (fallback) {
        return fallback(error, this.handleRetry);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
          <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Oops! Algo salió mal
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {retryCount > 1 
                ? `Se ha intentado ${retryCount} veces sin éxito.` 
                : 'Ha ocurrido un error inesperado en la aplicación.'
              }
            </p>

            {/* Error Details (solo en desarrollo) */}
            {showDetails && error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Detalles del error:
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {error.toString()}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
              
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                <RefreshCw className="h-4 w-4" />
                Recargar Página
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                <Home className="h-4 w-4" />
                Ir al Inicio
              </button>
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showDetails ? 'Ocultar' : 'Mostrar'} detalles técnicos
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;