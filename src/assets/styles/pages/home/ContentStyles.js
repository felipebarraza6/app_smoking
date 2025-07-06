import { css } from "@emotion/react";
import { BREAKPOINTS, RESPONSIVE_CONFIG } from "../../../../utils/breakpoints";

/**
 * Estilos principales para el contenedor de contenido de la página Home.
 * Incluye ajustes responsivos, ocultamiento de scrollbars y mejoras de performance.
 * @param {string} algorithm - Tema actual ('dark' o 'light')
 * @param {string} breakpoint - Breakpoint actual para responsividad
 * @returns {object} Estilos CSS generados dinámicamente
 */
export const contentCss = (algorithm, breakpoint = "lg") => {
  const contentConfig = RESPONSIVE_CONFIG.content;
  const padding = contentConfig.padding[breakpoint];

  return css({
    overflow: "auto",
    width: "100%",
    height: "100%",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    padding: padding,
    scrollbarWidth: "none", // For Firefox
    "&::-webkit-scrollbar": {
      display: "none", // For Chrome, Safari, and Opera
    },

    // Responsive adjustments
    [`@media (max-width: ${BREAKPOINTS.sm - 1}px)`]: {
      padding: "8px",
      height: "calc(100vh - 56px)", // Ajustar para header móvil de 56px
      marginTop: "0px", // Espacio para header fijo
    },

    [`@media (min-width: ${BREAKPOINTS.sm}px) and (max-width: ${
      BREAKPOINTS.md - 1
    }px)`]: {
      padding: "12px",
      marginLeft: "0", // Sin margen cuando sidebar está fijo
      marginTop: "56px", // Espacio para header fijo
      height: "calc(100vh - 56px)", // Ajustar altura
    },

    [`@media (min-width: ${BREAKPOINTS.md}px)`]: {
      padding: "20px",
      marginLeft: "0", // El sidebar se maneja automáticamente
      marginTop: "0px", // Espacio para header fijo
      height: "calc(100vh - 56px)", // Ajustar altura
    },

    // Mejoras de performance
    willChange: "auto",
    transform: "translateZ(0)", // Force hardware acceleration

    // Mejoras de accesibilidad
    "&:focus": {
      outline: "none",
    },

    // Mejoras de UX
    transition: "padding 0.3s ease",
  });
};

// Estilos adicionales para contenedores de contenido
export const contentContainer = css({
  maxWidth: "100%",
  margin: "0 auto",

  [`@media (min-width: ${BREAKPOINTS.lg}px)`]: {
    maxWidth: "1200px",
  },

  [`@media (min-width: ${BREAKPOINTS.xl}px)`]: {
    maxWidth: "1400px",
  },
});

// Estilos para secciones de contenido
export const contentSection = css({
  marginBottom: "24px",

  [`@media (max-width: ${BREAKPOINTS.sm - 1}px)`]: {
    marginBottom: "16px",
  },
});

// Estilos globales para el menú de documentación en modo dark
export const docMenuDark = css`
  .doc-menu-dark .ant-menu,
  .doc-menu-dark .ant-menu-sub,
  .doc-menu-dark .ant-menu-item,
  .doc-menu-dark .ant-menu-submenu,
  .doc-menu-dark .ant-menu-submenu-title {
    background: #181818 !important;
    color: #fff !important;
  }
  .doc-menu-dark .ant-menu-item-selected,
  .doc-menu-dark .ant-menu-item-active,
  .doc-menu-dark .ant-menu-item:hover,
  .doc-menu-dark .ant-menu-submenu-selected > .ant-menu-submenu-title {
    background: #a72863 !important;
    color: #fff !important;
  }
`;
