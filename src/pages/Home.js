/** @jsxImportSource @emotion/react */
import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { Layout, Drawer } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useBreakpoint, RESPONSIVE_CONFIG } from "../utils/breakpoints";
import { motion, AnimatePresence } from "framer-motion";

// Components
import SiderMenu from "../components/home/SiderMenu";
import HeaderUser from "../components/home/HeaderUser";
import ResponsiveHeader from "../components/home/ResponsiveHeader";

// Containers
import Users from "../containers/Users";
import Branchs from "../containers/Branchs";
import Products from "../containers/Products";
import Clients from "../containers/Clients";
import NotFound from "../containers/NotFound";
import DriversTruck from "../containers/Drivers";
import TypePayments from "../containers/TypePayments";
import Sale from "../containers/Sale";
import Orders from "../containers/Orders";
import ListOrdersManagement from "../components/orders/ListOrdersManagement/Component";
import ListSalesManagement from "../components/sale/ListSalesManagement/Component";
import Dashboard from "../components/dash/DashboardRefactored";
import MyProfile from "../pages/MyProfile";
import logo from "../assets/img/logo.png";
import Documentation from "./Documentation";
import StatusPage from "./StatusPage";

// Context
import { AppContext } from "../App";

// Hooks
import useUserBranches from "../hooks/useUserBranches";

import { contentCss } from "../assets/styles/pages/home/ContentStyles";
import { hideDrawerScrollbar } from "../assets/styles/pages/home/SiderMenu";

const { Content } = Layout;

/**
 * Componente Home principal mejorado con responsive design y header móvil
 */
const Home = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  // Cargar sucursales del usuario
  useUserBranches();

  // Obtener el ancho real del menú lateral según el breakpoint
  const sidebarWidth = RESPONSIVE_CONFIG.sidebar.width[breakpoint];

  // Estado para Drawer (sidebar en móvil)
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Refs para animaciones
  const siderRef = useRef(null);
  const layoutRef = useRef(null);

  // Redirección inicial optimizada
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/app/");
    }
  }, [location.pathname, navigate]);

  // Función optimizada para manejar el cierre del sidebar en móviles
  const handleContentClick = useCallback(() => {
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile, drawerOpen]);

  // Handler para perfil desde header responsive
  const handleProfileClick = useCallback(() => {
    navigate("/app/my-profile");
  }, [navigate]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        paddingLeft: isMobile ? 0 : sidebarWidth,
        paddingTop: 56,
      }}
    >
      {/* Header responsive solo en móvil/tablet */}
      {isMobile && (
        <ResponsiveHeader
          onMenuClick={() => setDrawerOpen(true)}
          onProfileClick={handleProfileClick}
        />
      )}

      {/* Sidebar: Drawer en móvil/tablet, sidebar normal en desktop */}
      {isMobile ? (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          bodyStyle={{ padding: 0 }}
          title={null}
          closable={false}
          icon={<img src={logo} alt="Logo" style={{ width: 100 }} />}
          width={220}
          css={hideDrawerScrollbar}
        >
          <SiderMenu mobile onClose={() => setDrawerOpen(false)} />
        </Drawer>
      ) : (
        <div ref={siderRef}>
          <SiderMenu />
        </div>
      )}

      <Layout>
        {/* Header normal solo en desktop */}
        {!isMobile && (
          <div ref={layoutRef}>
            <HeaderUser />
          </div>
        )}

        {/* Contenido principal con animación entre rutas */}
        <Content
          css={contentCss(state.algorithm, breakpoint)}
          style={{
            background: "transparent",
            overflow: "auto",
            height: "100%",
          }}
          onClick={handleContentClick}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/app/"
                element={
                  <PageFade>
                    <Dashboard />
                  </PageFade>
                }
              />
              <Route
                path="/app/users"
                element={
                  <PageFade>
                    <Users />
                  </PageFade>
                }
              />
              <Route
                path="/app/branchs"
                element={
                  <PageFade>
                    <Branchs />
                  </PageFade>
                }
              />
              <Route
                path="/app/products"
                element={
                  <PageFade>
                    <Products />
                  </PageFade>
                }
              />
              <Route
                path="/app/clients"
                element={
                  <PageFade>
                    <Clients />
                  </PageFade>
                }
              />
              <Route
                path="/app/drivers"
                element={
                  <PageFade>
                    <DriversTruck />
                  </PageFade>
                }
              />
              <Route
                path="/app/type-payments"
                element={
                  <PageFade>
                    <TypePayments />
                  </PageFade>
                }
              />
              <Route
                path="/app/sale"
                element={
                  <PageFade>
                    <Sale />
                  </PageFade>
                }
              />
              <Route
                path="/app/orders-create"
                element={
                  <PageFade>
                    <Orders />
                  </PageFade>
                }
              />
              <Route
                path="/app/orders-management"
                element={
                  <PageFade>
                    <ListOrdersManagement />
                  </PageFade>
                }
              />
              <Route
                path="/app/sales-management"
                element={
                  <PageFade>
                    <ListSalesManagement />
                  </PageFade>
                }
              />
              <Route
                path="/app/my-profile"
                element={
                  <PageFade>
                    <MyProfile />
                  </PageFade>
                }
              />
              <Route
                path="/app/documentation"
                element={
                  <PageFade>
                    <Documentation />
                  </PageFade>
                }
              />
              <Route
                path="/app/status"
                element={
                  <PageFade>
                    <StatusPage />
                  </PageFade>
                }
              />
              <Route
                path="*"
                element={
                  <PageFade>
                    <NotFound />
                  </PageFade>
                }
              />
            </Routes>
          </AnimatePresence>
        </Content>
      </Layout>
    </Layout>
  );
};

// Componente de animación para transiciones entre páginas
const PageFade = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default Home;
