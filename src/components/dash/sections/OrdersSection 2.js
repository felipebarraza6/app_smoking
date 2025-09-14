import React from "react";
import { Card, Typography, Row, Col, theme } from "antd";
import {
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatCLP } from "../utils/dashboardHelpers";

const { Title, Text } = Typography;

// Utiliza los arrays del backend para productos destacados
const getTopProduct = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr[0] : null;

const OrdersSection = ({ totalSummary, onCardClick, isMobile }) => {
  const { token } = theme.useToken();
  const ordersData = totalSummary?.orders || {};

  // Extraer el top 1 de cada métrica
  const bestSelling = getTopProduct(totalSummary?.best_selling_products);
  const mostProfitable = getTopProduct(totalSummary?.most_profitable_products);
  const leastSelling = getTopProduct(totalSummary?.least_selling_products);
  const leastProfitable = getTopProduct(
    totalSummary?.least_profitable_products
  );

  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorInfo}08 100%)`,
        border: `1px solid ${token.colorInfo}15`,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: isMobile ? 16 : 24 }}
    >
      {/* Header de la sección */}
      <div style={{ marginBottom: 20 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: token.colorText,
            fontSize: "20px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ShoppingOutlined style={{ color: token.colorInfo }} />
          Pedidos
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {/* Indicadores principales - 4 cuadros arriba */}
        <Col xs={24}>
          <Row gutter={[12, 12]}>
            {/* Total */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("orders", "total")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorInfo}15`,
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Text
                  style={{ fontSize: "12px", color: token.colorTextSecondary }}
                >
                  Total
                </Text>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorInfo,
                  }}
                >
                  {formatCLP(ordersData.total_amount)}
                </div>
                <Text
                  style={{
                    fontSize: "10px",
                    color: token.colorTextTertiary,
                    fontStyle: "italic",
                  }}
                >
                  Haz click para detalles
                </Text>
              </Card>
            </Col>

            {/* Ganancia */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("orders", "profit")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorPrimary}15`,
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 16 }}
              >
                <Text
                  style={{ fontSize: "12px", color: token.colorTextSecondary }}
                >
                  Ganancia
                </Text>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorPrimary,
                  }}
                >
                  {formatCLP(ordersData.profit)}
                </div>
                <Text
                  style={{
                    fontSize: "10px",
                    color: token.colorTextTertiary,
                    fontStyle: "italic",
                  }}
                >
                  Haz click para detalles
                </Text>
              </Card>
            </Col>

            {/* Completados */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("orders", "completed")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  <CheckCircleOutlined
                    style={{ color: token.colorSuccess, fontSize: "14px" }}
                  />
                  <Text
                    style={{
                      fontSize: "12px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    Completados
                  </Text>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorSuccess,
                  }}
                >
                  {ordersData.completed || 0}
                </div>
                <Text
                  style={{
                    fontSize: "10px",
                    color: token.colorTextTertiary,
                    fontStyle: "italic",
                  }}
                >
                  Haz click para ver lista
                </Text>
              </Card>
            </Col>

            {/* Anulados */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("orders", "cancelled")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorError}15`,
                  cursor: "pointer",
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  <CloseCircleOutlined
                    style={{ color: token.colorError, fontSize: "14px" }}
                  />
                  <Text
                    style={{
                      fontSize: "12px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    Anulados
                  </Text>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorError,
                  }}
                >
                  {ordersData.cancelled || 0}
                </div>
                <Text
                  style={{
                    fontSize: "10px",
                    color: token.colorTextTertiary,
                    fontStyle: "italic",
                  }}
                >
                  Haz click para ver lista
                </Text>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default OrdersSection;
