import React, { useRef } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const goHome = () => {
    navigate("/app/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      ref={containerRef}
    >
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que has visitado no existe."
        extra={
          <Button onClick={goHome} type={"primary"}>
            Ir al resumen
          </Button>
        }
      />
    </motion.div>
  );
};

export default NotFound;
