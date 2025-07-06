import React, { useContext } from "react";
import { Image } from "antd";
import logo_white from "../../assets/img/logo_white.png";
import logo from "../../assets/img/logo.png";
import { AppContext } from "../../App";
import { useBreakpoint } from "../../utils/breakpoints";

const Logo = () => {
  const { state } = useContext(AppContext);
  const breakpoint = useBreakpoint();

  // Define el tamaño según el breakpoint
  const width =
    breakpoint === "xs" || breakpoint === "sm"
      ? 100 // px para mobile
      : 140; // px para desktop

  return (
    <Image
      preview={false}
      src={logo_white}
      width={width}
      alt="logo"
      style={{ objectFit: "contain" }}
    />
  );
};

export default Logo;
