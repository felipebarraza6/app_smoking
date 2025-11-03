// /Users/felipebarraza/projects/smoking_app/app/src/components/home/HeaderUser.js
/** @jsxImportSource @emotion/react */
import React, {
  useContext,
  useEffect,
  useState,
  forwardRef,
  useCallback,
} from "react"; // Importar forwardRef
import { Layout, Button, Flex, Popconfirm, theme } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { FaUserAstronaut } from "react-icons/fa";
import { LogoutOutlined, RocketOutlined } from "@ant-design/icons";
import { magenta, purple } from "@ant-design/colors";
import Logo from "./Logo";
import { css } from "@emotion/react";
import { SiGoogledocs } from "react-icons/si";
import { ConnectionContext } from "../../context/ConnectionContext";

const { Header } = Layout;

// Envuelve el componente con forwardRef
const HeaderUser = React.memo(
  forwardRef((props, ref) => {
    // Recibe props y ref
    const { dispatch, state } = useContext(AppContext);
    const [widthScreen, setWidthScreen] = useState(window.innerWidth);
    const { isConnected } = useContext(ConnectionContext);
    const { token } = theme.useToken();

    const navigate = useNavigate();
    const location = useLocation();

    const navigateMyProfile = useCallback(() => {
      navigate("/app/my-profile");
    }, [navigate]);

    const navigateDocumentation = useCallback(() => {
      navigate("/app/documentation");
    }, [navigate]);

    const handleStatus = useCallback(() => {
      navigate("/app/status");
    }, [navigate]);

    const handleLogout = useCallback(() => {
      dispatch({ type: "LOGOUT", useNavigate: navigate });
    }, [dispatch, navigate]);

    const cssFlex = css({
      height: "100%",
    });

    const headerBg = state.algorithm === "dark" ? magenta[8] : purple[9];

    // Optimizar el event listener con useCallback
    const handleResize = useCallback(() => {
      setWidthScreen(window.innerWidth);
    }, []);

    useEffect(() => {
      window.addEventListener("resize", handleResize);

      return () => {
        // Función de limpieza para remover el event listener
        window.removeEventListener("resize", handleResize);
      };
    }, [handleResize]);

    // Función para determinar si un botón debe estar activo
    const isActiveRoute = useCallback(
      (route) => {
        return location.pathname === route;
      },
      [location.pathname]
    );

    // Memoizar el nombre de usuario para evitar re-renderizaciones
    const displayUsername =
      widthScreen > 700
        ? state.user?.username?.slice(0, 13).toLowerCase() || ""
        : "";

    return (
      <Header
        ref={ref}
        style={{
          background: headerBg,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Flex align="center" justify="space-between" css={cssFlex}>
          {/* Logo a la izquierda */}
          <Flex align="center" style={{ height: "100%" }}>
            <Logo />
          </Flex>
          {/* Botones a la derecha */}
          <Flex align="center" gap={16} style={{ height: "100%" }}>
            <Button
              type={isActiveRoute("/app/my-profile") ? "primary" : "text"}
              icon={<FaUserAstronaut />}
              shape="round"
              onClick={navigateMyProfile}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                background: isActiveRoute("/app/my-profile")
                  ? "white"
                  : "transparent",
                color: isActiveRoute("/app/my-profile") ? "black" : "white",
              }}
              disabled={!isConnected}
            >
              {displayUsername}
            </Button>
            <Button
              type={isActiveRoute("/app/documentation") ? "primary" : "text"}
              icon={<SiGoogledocs />}
              shape="round"
              onClick={navigateDocumentation}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                background: isActiveRoute("/app/documentation")
                  ? "white"
                  : "transparent",
                color: isActiveRoute("/app/documentation") ? "black" : "white",
              }}
            >
              Documentación
            </Button>
            <Button
              type={isActiveRoute("/app/status") ? "primary" : "text"}
              icon={
                <RocketOutlined
                  style={{
                    color: isConnected ? token.colorSuccess : "#ff4d4f",
                    filter: isConnected
                      ? `drop-shadow(0 0 8px ${token.colorSuccess}88)`
                      : undefined,
                  }}
                />
              }
              shape="round"
              onClick={handleStatus}
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                background: isActiveRoute("/app/status")
                  ? "white"
                  : "transparent",
                color: isActiveRoute("/app/status") ? "black" : "white",
                boxShadow: isConnected
                  ? `0 0 0 0 ${token.colorSuccess}44`
                  : undefined,
                animation: isConnected
                  ? "pulseGlow 1.2s infinite alternate"
                  : "none",
                border: isConnected
                  ? `1.5px solid ${token.colorSuccess}`
                  : undefined,
              }}
            >
              Status
              <style>{`
                @keyframes pulseGlow {
                  0% { box-shadow: 0 0 0 0 ${token.colorSuccess}44; }
                  100% { box-shadow: 0 0 16px 4px ${token.colorSuccess}88; }
                }
              `}</style>
            </Button>
            <Popconfirm
              title="Estas seguro de cerrar sesión?"
              onConfirm={handleLogout}
              cancelButtonProps={{ type: "primary" }}
            >
              <Button icon={<LogoutOutlined />} shape={"circle"}></Button>
            </Popconfirm>
          </Flex>
        </Flex>
      </Header>
    );
  })
); // Cierra forwardRef y memo

export default HeaderUser;
