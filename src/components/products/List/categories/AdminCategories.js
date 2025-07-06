/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "antd";
import { css } from "@emotion/react";
import InputForm from "./InputForm";
import ModalCategories from "./ModalCategories";

const AdminCategories = () => {
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  const cardStyled = css({
    marginBottom: "10px",
  });

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
    if (widthScreen < 600) {
      setIsMobile("horizontal");
    } else {
      setIsMobile("inline");
    }
  }, [widthScreen]);

  return (
    <Card hoverable title="Categorías" size="small" css={cardStyled}>
      <Row
        justify={isMobile === "horizontal" ? "center" : "space-between"}
        gutter={[16, 8]}
      >
        <Col>
          <InputForm />
        </Col>
        <Col>
          <ModalCategories />
        </Col>
      </Row>
    </Card>
  );
};

export default AdminCategories;
