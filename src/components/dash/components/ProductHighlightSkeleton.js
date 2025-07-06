import React from "react";
import { Card, Typography, theme, Row, Col, Divider } from "antd";
import { TrophyOutlined, CrownOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const ProductHighlightSkeleton = ({ title, icon, type }) => {
  const { token } = theme.useToken();

  const isProfitable = title === "Más Rentable";
  const borderColor = isProfitable ? token.colorWarning : token.colorPrimary;

  return (
    <Card
      style={{
        height: "100%",
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillQuaternary} 100%)`,
        border: `3px solid ${borderColor}20`,
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        opacity: 0.7,
      }}
      bodyStyle={{
        padding: 24,
        minHeight: 180,
      }}
    >
      <Row align="middle" style={{ height: "100%" }}>
        {/* Columna izquierda - Ícono y título */}
        <Col span={8}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${borderColor}08 0%, ${borderColor}15 100%)`,
                borderRadius: "50%",
                width: 60,
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto",
              }}
            >
              {React.cloneElement(icon, {
                style: {
                  fontSize: 28,
                  color: `${borderColor}60`,
                },
              })}
            </div>

            <Title
              level={5}
              style={{
                fontSize: "16px",
                color: token.colorTextTertiary,
                marginBottom: 0,
                fontWeight: "700",
                lineHeight: "1.2",
              }}
            >
              {title}
            </Title>
          </div>
        </Col>

        {/* Divider vertical */}
        <Col span={1}>
          <Divider
            type="vertical"
            style={{ height: "120px", margin: 0, opacity: 0.3 }}
          />
        </Col>

        {/* Columna derecha - Información del producto */}
        <Col span={15}>
          <div style={{ paddingLeft: 16 }}>
            <Title
              level={4}
              style={{
                fontSize: "18px",
                color: token.colorTextTertiary,
                marginBottom: 12,
                fontWeight: "600",
              }}
            >
              Sin datos disponibles
            </Title>

            <Text
              style={{
                display: "block",
                fontSize: "14px",
                color: token.colorTextQuaternary,
                fontStyle: "italic",
                lineHeight: "1.6",
                marginBottom: 8,
              }}
            >
              Los datos aparecerán cuando haya {type.toLowerCase()} registradas
            </Text>

            <div style={{ opacity: 0.5 }}>
              <Text
                style={{
                  fontSize: "13px",
                  color: token.colorTextQuaternary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                📊 Información de stock
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: token.colorTextQuaternary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                🏷️ Categoría del producto
              </Text>
              <Text
                style={{
                  fontSize: "13px",
                  color: token.colorTextQuaternary,
                  display: "block",
                }}
              >
                📈 Estadísticas de ventas
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductHighlightSkeleton;
