import React from "react";
import { useBreakpoint, isMobile } from "../../../utils/breakpoints";
import SaleCreateDesktop from "./SaleCreateDesktop";
import SaleCreateMobile from "./SaleCreateMobile";

const CreateUpdate = () => {
  const breakpoint = useBreakpoint();
  const mobile = isMobile(breakpoint);
  return mobile ? <SaleCreateMobile /> : <SaleCreateDesktop />;
};

export default CreateUpdate;
