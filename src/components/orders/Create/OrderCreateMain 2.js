import React, { useState, useEffect } from "react";
import { useBreakpoint, isMobile } from "../../../utils/breakpoints";
import OrderCreateDesktop from "./OrderCreateDesktop";
import OrderCreateMobile from "./OrderCreateMobile";

const OrderCreateMain = () => {
  const breakpoint = useBreakpoint();
  const [show, setShow] = useState(false);
  const mobile = isMobile(breakpoint);

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(timeout);
  }, [mobile]);

  return (
    <div style={{ opacity: show ? 1 : 0, transition: "opacity 0.2s" }}>
      {mobile ? <OrderCreateMobile /> : <OrderCreateDesktop />}
    </div>
  );
};

export default OrderCreateMain;
