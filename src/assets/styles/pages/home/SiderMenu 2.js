import { css } from "@emotion/react";
import { BREAKPOINTS } from "../../../../utils/breakpoints";

/**
 * Estilos para el menú lateral (SiderMenu) de la página Home.
 * Incluye ajustes responsivos, ocultamiento de scrollbars y overlay para mobile.
 */
export const containerSider = (algorithm) => {
  return css({
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "inherit",
    background: algorithm === "dark" ? "#232323" : "#fff",
    boxShadow: "4px 0 16px 0 rgba(0,0,0,0.15)",
    overflowY: "auto",
    overscrollBehavior: "none",
    scrollbarWidth: "none", // Firefox
    "&::-webkit-scrollbar": {
      display: "none", // Chrome, Safari, Opera
    },
    // --- Override para el fondo del menú de Ant Design ---
    ".ant-menu": {
      background: algorithm === "dark" ? "#232323" : "#fff",
    },

    // Responsive adjustments
    [`@media (max-width: ${BREAKPOINTS.sm - 1}px)`]: {
      position: "fixed",
      left: 0,
      top: "56px", // Posicionar debajo del header
      transition: "transform 0.3s ease",
      height: "calc(100vh - 56px)", // Ajustar altura

      "&.ant-layout-sider-collapsed": {
        transform: "translateX(-100%)",
      },
    },

    [`@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${
      BREAKPOINTS.md - 1
    }px)`]: {
      position: "fixed",
      left: 0,
      top: "56px", // Posicionar debajo del header
      height: "calc(100vh - 56px)", // Ajustar altura
    },

    [`@media (min-width: ${BREAKPOINTS.md}px)`]: {
      position: "relative",
      top: 0,
      height: "100vh",
    },
  });
};

export const flexSider = css({
  minHeight: "75vh",
  display: "flex",
  flexDirection: "column",

  // Responsive adjustments
  [`@media (max-width: ${BREAKPOINTS.sm - 1}px)`]: {
    minHeight: "calc(100vh - 56px)", // Ajustar para header
  },

  [`@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${
    BREAKPOINTS.md - 1
  }px)`]: {
    minHeight: "calc(100vh - 56px)", // Ajustar para header
  },
});

// Overlay para móviles cuando el sidebar está abierto
export const sidebarOverlay = css({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "none",

  [`@media (max-width: ${BREAKPOINTS.md - 1}px)`]: {
    display: "block",
  },
});

export const hideDrawerScrollbar = css({
  "& .ant-drawer-body": {
    scrollbarWidth: "none", // Firefox
  },
  "& .ant-drawer-body::-webkit-scrollbar": {
    display: "none", // Chrome, Safari, Opera
  },
});

// Override para el color del item seleccionado en el menú lateral cuando el tema es white
export const menuSelectedWhite = css({
  ".ant-menu-item-selected, .ant-menu-item-active, .ant-menu-item:hover, .ant-menu-submenu-selected > .ant-menu-submenu-title":
    {
      color: "white !important",
      background: "rgb(18, 3, 56) !important",
    },
  ".ant-menu-submenu-title:hover": {
    color: "#262626 !important",
  },
});

// Override para el color del item seleccionado en el menú lateral cuando el tema es dark
export const menuSelectedDark = css({
  ".ant-menu-item-selected, .ant-menu-item-active, .ant-menu-item:hover, .ant-menu-submenu-selected > .ant-menu-submenu-title":
    {
      color: "#fff !important",
      background: "#383838 !important",
    },
  ".ant-menu-submenu-title:hover": {
    color: "#fff !important",
  },
});
