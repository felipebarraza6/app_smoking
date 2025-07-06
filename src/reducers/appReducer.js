export const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_ALGORITHM":
      localStorage.setItem("algorithm", action.payload);
      return {
        ...state,
        algorithm: action.payload,
      };

    case "LOGIN":
      // Soporta 'access', 'token' y 'access_token'
      const token =
        action.payload.access ||
        action.payload.token ||
        action.payload.access_token;
      const user = action.payload.user || null;
      const algorithm = action.payload.algorithm || "dark";
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("algorithm", algorithm);
      return {
        ...state,
        isAuth: !!token,
        token: token,
        user: user,
        algorithm: algorithm,
      };

    case "UPDATE":
      return {
        ...state,
        isAuth: true,
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user")),
      };

    case "SET_BRANCHES":
      return {
        ...state,
        branches: action.payload,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuth: false,
        token: null,
        user: null,
        branches: [], // Limpiar sucursales al hacer logout
      };

    default:
      return state;
  }
};
