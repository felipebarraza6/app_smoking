import React from "react";
import { Card, Typography, Progress, Row, Col, theme, Space } from "antd";
import {
  CreditCardOutlined,
  DollarOutlined,
  BankOutlined,
  MobileOutlined,
  WalletOutlined,
  PayCircleOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import { formatCLP } from "../utils/dashboardHelpers";

const { Text, Title } = Typography;

const iconMap = {
  Efectivo: <DollarOutlined />,
  Tarjeta: <CreditCardOutlined />,
  Transferencia: <BankOutlined />,
  QR: <QrcodeOutlined />,
  default: <DollarOutlined />,
};

const PaymentsSection = ({
  title,
  payments = { total: 0, by_type: {} },
  isMobile,
  onCardClick,
}) => {
  const { token } = theme.useToken();
  const paymentTypes = payments?.by_type
    ? Object.entries(payments.by_type)
    : [];

  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorFillQuaternary} 100%)`,
        border: `1px solid ${token.colorWarning}20`,
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
          <WalletOutlined style={{ color: token.colorWarning }} />
          Pagos
        </Title>
        <Text type="secondary" style={{ marginTop: 4 }}>
          Total y desglose de los métodos de pago registrados.
        </Text>
      </div>

      <Row gutter={[24, 16]} align="middle">
        {/* Total General */}
        <Col xs={24} md={8}>
          <Card
            hoverable
            onClick={() => onCardClick("payments", "total")}
            style={{
              background: token.colorPrimary,
              color: "#fff",
              textAlign: "center",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Text style={{ fontSize: "1rem", color: "#fff" }}>
              Total Recaudado
            </Text>
            <Title level={2} style={{ color: "#fff", margin: 0 }}>
              {formatCLP(payments?.total || 0)}
            </Title>
          </Card>
        </Col>

        {/* Desglose por tipo */}
        <Col xs={24} md={16}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${
                isMobile ? "120px" : "150px"
              }, 1fr))`,
              gap: 16,
            }}
          >
            {paymentTypes.length > 0 ? (
              paymentTypes.map(([type, amount]) => (
                <Card
                  key={type}
                  size="small"
                  style={{
                    textAlign: "center",
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                  bodyStyle={{ padding: "12px 8px" }}
                >
                  <Space size={8}>
                    {iconMap[type] || iconMap.default}
                    <Text
                      style={{
                        fontSize: "0.8rem",
                        color: token.colorTextSecondary,
                      }}
                    >
                      {type}
                    </Text>
                  </Space>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      marginTop: 4,
                    }}
                  >
                    {formatCLP(amount)}
                  </div>
                </Card>
              ))
            ) : (
              <Text
                type="secondary"
                style={{ textAlign: "center", width: "100%" }}
              >
                No hay desglose de pagos disponible.
              </Text>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PaymentsSection;
