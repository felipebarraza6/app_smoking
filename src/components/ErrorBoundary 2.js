import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente renderizado muestre la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service

    // Determinar el tipo de error
    let errorType = "Desconocido";
    let errorMessage = "Ha ocurrido un error inesperado";

    if (error.message.includes("Network Error")) {
      errorType = "Error de Conexión";
      errorMessage =
        "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
    } else if (error.message.includes("timeout")) {
      errorType = "Error de Tiempo de Espera";
      errorMessage =
        "La petición tardó demasiado en responder. Intenta nuevamente.";
    } else if (error.response?.status === 500) {
      errorType = "Error del Servidor";
      errorMessage = "Error interno del servidor. Contacta al administrador.";
    } else if (error.response?.status === 404) {
      errorType = "Recurso No Encontrado";
      errorMessage = "El recurso solicitado no existe.";
    } else if (error.response?.status === 403) {
      errorType = "Acceso Denegado";
      errorMessage = "No tienes permisos para acceder a este recurso.";
    } else if (error.response?.status === 401) {
      errorType = "No Autorizado";
      errorMessage =
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorType: errorType,
      errorMessage: errorMessage,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "500px",
            }}
          >
            <h1 style={{ color: "#e6007a", marginBottom: "10px" }}>
              {this.state.errorType || "Error"}
            </h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              {this.state.errorMessage}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#e6007a",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                🔄 Recargar página
              </button>
              <button
                onClick={() => (window.location.href = "/login")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#1890ff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🔐 Ir al login
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={{ marginTop: "20px", textAlign: "left" }}>
                <summary style={{ cursor: "pointer", color: "#666" }}>
                  🔍 Detalles del error (solo desarrollo)
                </summary>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    borderRadius: "4px",
                    overflow: "auto",
                    maxWidth: "100%",
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  <strong>Error:</strong>{" "}
                  {this.state.error && this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong> {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
