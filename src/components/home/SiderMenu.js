// /Users/felipebarraza/projects/smoking_app/app/src/components/home/SiderMenu.js
/** @jsxImportSource @emotion/react */
import React, {
  useEffect,
  useState,
  useContext,
  forwardRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Layout, Flex, Button } from "antd";
import { MdMenuOpen } from "react-icons/md";
import { RiMenuUnfold3Line } from "react-icons/ri";
import { AppContext } from "../../App";
import { css } from "@emotion/react";
import { useBreakpoint, RESPONSIVE_CONFIG } from "../../utils/breakpoints";
import { ConnectionContext } from "../../context/ConnectionContext";

import {
  containerSider,
  flexSider,
  menuSelectedWhite,
  menuSelectedDark,
} from "../../assets/styles/pages/home/SiderMenu";

import ToggleTheme from "./ToggleTheme";
import Logo from "./Logo";
import MenuRouters from "./MenuRouters";
import logoBlack from "../../assets/img/logo_black.png";

const { Sider } = Layout;

/**
 * Componente SiderMenu mejorado con responsive design y centrado vertical en desktop.
 *
 * - En desktop, el menú queda centrado verticalmente y separado del logo y el toggle de tema.
 * - En mobile, mantiene el diseño actual.
 * - El código está documentado para facilitar el mantenimiento y futuras modificaciones.
 *
 * Props:
 *   - mobile: boolean, indica si es mobile (Drawer)
 *   - onClose: función para cerrar el Drawer en mobile
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.Ref} ref - Referencia forwardRef
 */
const SiderMenu = memo(
  forwardRef(({ mobile = false, onClose }, ref) => {
    const [collapsed, setCollapsed] = useState(false);
    const breakpoint = useBreakpoint();
    const { state } = useContext(AppContext);
    const { isConnected } = useContext(ConnectionContext);

    // Memoizar la configuración responsive
    const sidebarConfig = useMemo(() => RESPONSIVE_CONFIG.sidebar, []);
    const shouldBeCollapsed = useMemo(
      () => sidebarConfig.collapsed[breakpoint],
      [sidebarConfig, breakpoint]
    );
    const sidebarWidth = useMemo(
      () => sidebarConfig.width[breakpoint],
      [sidebarConfig, breakpoint]
    );

    // Manejo responsive del estado collapsed
    useEffect(() => {
      if (shouldBeCollapsed && !collapsed) {
        setCollapsed(true);
      } else if (!shouldBeCollapsed && collapsed) {
        setCollapsed(false);
      }
    }, [shouldBeCollapsed, collapsed]);

    // Estilos especiales para Drawer en mobile
    const mobileDrawerStyle = useMemo(
      () =>
        mobile
          ? css({
              background: state.algorithm === "dark" ? "#1f1f1f" : "#fff",
              height: "100vh",
              padding: "24px 0 24px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              flex: 1,
            })
          : undefined,
      [mobile, state.algorithm]
    );

    // --- NUEVO: Centrado vertical en desktop ---
    // Solo aplica en desktop (no mobile)
    const desktopMenuContainerStyle = useMemo(
      () =>
        !mobile
          ? {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Centra verticalmente
              alignItems: "stretch",
              padding: "32px 0 32px 0", // Espacio arriba y abajo
            }
          : {},
      [mobile]
    );

    // Memoizar el estilo del logo para evitar re-cálculos
    const logoStyle = useMemo(
      () => ({
        width: "120px",
        marginBottom: "-34px",
        filter: state.algorithm === "dark" ? "invert(1)" : "none",
      }),
      [state.algorithm]
    );

    // Memoizar el estilo del Sider para evitar re-cálculos
    const siderStyle = useMemo(
      () => ({
        position: "fixed",
        top: 64,
        left: 0,
        height: `calc(100vh - 56px)`,
        width: sidebarWidth,
        overflowY: "auto",
        overscrollBehavior: "none",
        boxShadow: "4px 0 16px 0 rgba(0,0,0,0.15)",
      }),
      [sidebarWidth]
    );

    return mobile ? (
      <nav
        css={[
          mobileDrawerStyle,
          state.algorithm === "light" && menuSelectedWhite,
          state.algorithm === "dark" && menuSelectedDark,
        ]}
      >
        {/* Logo negro para móvil */}
        <div style={{ marginBottom: "24px" }}>
          <img src={logoBlack} alt="Logo" style={logoStyle} />
        </div>

        {/* Toggle de tema en móvil */}

        <div style={{ width: "100%", margin: "24px 0" }}>
          <MenuRouters onOptionClick={onClose} />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <ToggleTheme />
        </div>
      </nav>
    ) : (
      <Sider
        ref={ref}
        css={[
          containerSider(state.algorithm),
          state.algorithm === "light" && menuSelectedWhite,
          state.algorithm === "dark" && menuSelectedDark,
        ]}
        collapsed={collapsed}
        width={sidebarWidth}
        breakpoint="lg"
        title="Menu"
        collapsedWidth={breakpoint === "xs" ? 0 : 80}
        trigger={null}
        style={siderStyle}
      >
        {/* Contenedor centrado vertical en desktop */}
        <div style={desktopMenuContainerStyle}>
          {/* Logo solo en mobile, en desktop va en el header */}
          {/* --- Si quieres mostrar el logo aquí, descomenta la siguiente línea --- */}
          {/* <Flex vertical align="center" style={{ padding: "0 0 24px 0" }}><Logo /></Flex> */}

          {/* Menu Section */}
          <Flex vertical css={flexSider} style={{ flex: 1, marginBottom: 32 }}>
            <MenuRouters />
          </Flex>

          {/* Bottom Section */}
          <Flex vertical align="center" style={{ padding: "0 0 0 0" }}>
            <ToggleTheme />
          </Flex>
        </div>

        {/* Overlay para bloquear el menú si no hay conexión */}
        {!isConnected && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
              pointerEvents: "auto",
            }}
          >
            Sin conexión con el servidor
          </div>
        )}
      </Sider>
    );
  })
);

export default SiderMenu;
