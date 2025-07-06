import React from "react";
import { css } from "@emotion/react";
import { useBreakpoint } from "../../utils/breakpoints";

const overlayStyle = css({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  opacity: 0,
  visibility: "hidden",
  transition: "opacity 0.3s ease, visibility 0.3s ease",

  "&.visible": {
    opacity: 1,
    visibility: "visible",
  },
});

/**
 * Componente overlay para cerrar el sidebar en móviles
 * @param {boolean} visible - Si el overlay debe estar visible
 * @param {function} onClose - Función para cerrar el sidebar
 */
const SidebarOverlay = ({ visible, onClose }) => {
  const breakpoint = useBreakpoint();

  // Solo mostrar en móviles y tablets
  if (breakpoint === "lg" || breakpoint === "xl" || breakpoint === "xxl") {
    return null;
  }

  return (
    <div
      css={overlayStyle}
      className={visible ? "visible" : ""}
      onClick={onClose}
      role="button"
      tabIndex={0}
      aria-label="Cerrar menú"
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Enter") {
          onClose();
        }
      }}
    />
  );
};

export default SidebarOverlay;
