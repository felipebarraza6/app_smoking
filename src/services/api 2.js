/**
 * Servicio base de API para el frontend.
 * Proporciona métodos centralizados para todas las operaciones HTTP.
 */

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
    this.token = localStorage.getItem("token");
  }

  /**
   * Realizar una petición HTTP genérica.
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise} - Respuesta de la API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Token ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Realizar petición GET.
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} params - Parámetros de query
   * @returns {Promise} - Respuesta de la API
   */
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  /**
   * Realizar petición POST.
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Respuesta de la API
   */
  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Realizar petición PUT.
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Respuesta de la API
   */
  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Realizar petición PATCH.
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Respuesta de la API
   */
  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * Realizar petición DELETE.
   * @param {string} endpoint - Endpoint de la API
   * @returns {Promise} - Respuesta de la API
   */
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  /**
   * Actualizar el token de autenticación.
   * @param {string} token - Nuevo token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  /**
   * Obtener el token actual.
   * @returns {string|null} - Token actual
   */
  getToken() {
    return this.token;
  }

  /**
   * Verificar si el usuario está autenticado.
   * @returns {boolean} - True si está autenticado
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Cerrar sesión.
   */
  logout() {
    this.setToken(null);
  }
}

// Instancia singleton del servicio
const apiService = new ApiService();

export default apiService;
