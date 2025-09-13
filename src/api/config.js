import axios from "axios";

//const BASE_URL_DEV = "http://137.184.152.245:8003/api/";
// Configuración para conectar al Django ERP de mediciones
export const DEVURL = "http://localhost:8000/api/";
//const BASE_URL_API = "https://8000-idx-apiuisalesmanangement-1744646070221.cluster-qhrn7lb3szcfcud6uanedbkjnm.cloudworkstations.dev/api/";

export const Axios = axios.create({
  baseURL: DEVURL,
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para respuestas (manejo global de errores)
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx

      // Si es error 401 (no autorizado), limpiar token y redirigir a login
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      // Si es error 500, mostrar mensaje más amigable
      if (error.response.status === 500) {
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
    } else {
      // Algo pasó al configurar la petición
    }

    return Promise.reject(error);
  }
);

// Interceptor para peticiones (logging)
Axios.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const POST_LOGIN = async (endpoint, data) => {
  try {
    const request = await Axios.post(endpoint, data);
    return request;
  } catch (error) {
    throw error;
  }
};

export const GET = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const request = await Axios.get(endpoint, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const POST = async (endpoint, data) => {
  try {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const request = await Axios.post(endpoint, data, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const PUT = async (endpoint, data) => {
  try {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const request = await Axios.put(endpoint, data, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const POST_FORM = async (endpoints, data) => {
  try {
    const token = localStorage.getItem("token");
    let formdata = new FormData();
    for (const key in data) {
      formdata.append(key, data[key]);
    }
    const options = {
      headers: {
        Authorization: `Token ${token}`,
        // No incluir content-type para que el navegador lo establezca automáticamente
      },
    };

    const request = await Axios.post(endpoints, formdata, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const PATCH = async (endpoint, data) => {
  try {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const request = await Axios.patch(endpoint, data, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const PATCH_FORM = async (endpoints, data) => {
  try {
    const token = localStorage.getItem("token");
    let formdata = new FormData();
    for (const key in data) {
      formdata.append(key, data[key]);
    }

    const options = {
      headers: {
        Authorization: `Token ${token}`,
        // No incluir content-type para que el navegador lo establezca automáticamente
      },
    };

    const request = await Axios.patch(endpoints, formdata, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const DELETE = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    const options = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const request = await Axios.delete(endpoint, options);
    return request;
  } catch (error) {
    throw error;
  }
};

export const forgot_password = async (data) => {
  try {
    // No envía token, solo el email
    const response = await POST_LOGIN("auth/users/forgot_password/", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const PING = async () => {
  // Construye la URL base del backend, pero sin el /api/
  const base = DEVURL.replace(/\/api\/?$/, "");
  return axios.get(`${base}/ping/`);
};
