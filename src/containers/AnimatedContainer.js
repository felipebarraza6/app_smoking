import React, { memo } from "react";
import { motion } from "framer-motion";
import BreadcrumbHomeRender from "../components/home/BreadcrumbHomeRender";

const AnimatedContainer = memo(({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <BreadcrumbHomeRender />
      {children}
    </motion.div>
  );
});

export default AnimatedContainer;
