import React, { useEffect, useState } from "react";

/**
 * Sistema de Breakpoints Responsive
 * Mobile First Approach
 */

export const BREAKPOINTS = {
  xs: 0, // Extra small devices (móviles)
  sm: 576, // Small devices (tablets pequeñas)
  md: 768, // Medium devices (tablets)
  lg: 992, // Large devices (desktops pequeños)
  xl: 1200, // Extra large devices (desktops grandes)
  xxl: 1600, // Extra extra large devices
};

export const MEDIA_QUERIES = {
  xs: `@media (max-width: ${BREAKPOINTS.sm - 1}px)`,
  sm: `@media (min-width: ${BREAKPOINTS.sm}px)`,
  md: `@media (min-width: ${BREAKPOINTS.md}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.lg}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.xl}px)`,
  xxl: `@media (min-width: ${BREAKPOINTS.xxl}px)`,
};

/**
 * Función de throttling para optimizar el resize
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Hook personalizado para detectar breakpoints optimizado
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState("lg");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 576) {
        setBreakpoint("xs");
      } else if (width < 768) {
        setBreakpoint("sm");
      } else if (width < 992) {
        setBreakpoint("md");
      } else if (width < 1200) {
        setBreakpoint("lg");
      } else {
        setBreakpoint("xl");
      }
    };

    // Establecer breakpoint inicial
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
};

/**
 * Utilidades para responsive design
 */
export const isMobile = (breakpoint) => {
  return breakpoint === "xs" || breakpoint === "sm";
};

export const isTablet = (breakpoint) => {
  return breakpoint === "md";
};

export const isDesktop = (breakpoint) => {
  return breakpoint === "lg" || breakpoint === "xl";
};

/**
 * Configuraciones responsive para componentes
 */
export const RESPONSIVE_CONFIG = {
  sidebar: {
    collapsed: {
      xs: true,
      sm: true,
      md: false,
      lg: false,
      xl: false,
      xxl: false,
    },
    width: {
      xs: 200,
      sm: 200,
      md: 250,
      lg: 250,
      xl: 250,
      xxl: 250,
    },
  },
  content: {
    padding: {
      xs: "10px",
      sm: "15px",
      md: "20px",
      lg: "20px",
      xl: "20px",
      xxl: "20px",
    },
  },
  animations: {
    duration: {
      xs: 300,
      sm: 500,
      md: 800,
      lg: 1000,
      xl: 1000,
      xxl: 1000,
    },
  },
};
