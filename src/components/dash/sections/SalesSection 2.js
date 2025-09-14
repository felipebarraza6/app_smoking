import React from "react";
import { Card, Typography, Row, Col, theme } from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatCLP } from "../utils/dashboardHelpers";

const { Title, Text } = Typography;

// Utiliza los arrays del backend para productos destacados
const getTopProduct = (arr) =>
  Array.isArray(arr) && arr.length > 0 ? arr[0] : null;

const SalesSection = ({ totalSummary, onCardClick, isMobile }) => {
  const { token } = theme.useToken();
  const salesData = totalSummary?.sales || {};

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
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorSuccess}08 100%)`,
        border: `1px solid ${token.colorSuccess}15`,
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
          <ShoppingCartOutlined style={{ color: token.colorSuccess }} />
          Ventas
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {/* Indicadores principales */}
        <Col xs={24}>
          <Row gutter={[12, 12]}>
            {/* Total */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("sales", "total")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                }}
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
                    color: token.colorSuccess,
                  }}
                >
                  {formatCLP(salesData.total_amount)}
                </div>
              </Card>
            </Col>
            {/* Ganancia */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("sales", "profit")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorPrimary}15`,
                }}
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
                  {formatCLP(salesData.profit)}
                </div>
              </Card>
            </Col>
            {/* Completadas */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("sales", "completed")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorInfo}15`,
                }}
              >
                <CheckCircleOutlined
                  style={{ color: token.colorInfo, fontSize: "14px" }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    marginLeft: 4,
                  }}
                >
                  Completadas
                </Text>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorInfo,
                  }}
                >
                  {salesData.count || 0}
                </div>
              </Card>
            </Col>
            {/* Anuladas */}
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card
                hoverable
                onClick={() => onCardClick("sales", "cancelled")}
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorError}15`,
                }}
              >
                <CloseCircleOutlined
                  style={{ color: token.colorError, fontSize: "14px" }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    marginLeft: 4,
                  }}
                >
                  Anuladas
                </Text>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: token.colorError,
                  }}
                >
                  {salesData.cancelled_count || 0}
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default SalesSection;
