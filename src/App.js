//Main App component
import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  Suspense,
  lazy,
} from "react";

//Ant Design components
import { Layout, ConfigProvider, App, Spin } from "antd";
import { AnimatePresence } from "framer-motion";

//Ant Design styles
import { configProvider } from "./assets/styles/AppStyles";

//React Router dom
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

//Reducers
import { appReducer } from "./reducers/appReducer";

//Controllers
import { controller } from "./controllers/app";

//Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

//Connection context
import { ConnectionProvider } from "./context/ConnectionContext";

//Lazy loaded components
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

//App context
export const AppContext = createContext();

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spin size="large" />
  </div>
);

const AppRoutes = ({ isAuth }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {isAuth ? (
          <Route path="/*" element={<Home />} />
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/app/reset-password/:token"
              element={<ResetPassword />}
            />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

const AppRender = () => {
  const initialState = {
    isAuth: false,
    token: null,
    user: null,
    algorithm: "dark",
    branches: [],
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoizar la configuración del tema para evitar recálculos
  const themeConfig = useMemo(() => configProvider(state), [state.algorithm]);

  useEffect(() => {
    controller.update_app(dispatch);
    // Si hay token y user en localStorage, actualiza el estado global
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      dispatch({ type: "UPDATE" });
    }
  }, []);

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(
      state.algorithm === "dark" ? "theme-dark" : "theme-light"
    );
  }, [state.algorithm]);

  return (
    <ConfigProvider theme={themeConfig.theme} locale={themeConfig.locale}>
      <App>
        <ConnectionProvider>
          <AppContext.Provider value={{ state, dispatch }}>
            <ErrorBoundary>
              <Layout>
                <Router>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AppRoutes isAuth={state.isAuth} />
                  </Suspense>
                </Router>
              </Layout>
            </ErrorBoundary>
          </AppContext.Provider>
        </ConnectionProvider>
      </App>
    </ConfigProvider>
  );
};

export default AppRender;
