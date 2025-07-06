import React from "react";
import { Typography, Card } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function PaymentMethodsSection({ token }) {
  return (
    <>
      <Title level={3}>
        <CreditCardOutlined style={{ marginRight: 8 }} />
        Métodos de Pago
      </Title>
      <Paragraph>
        Configura y administra los métodos de pago disponibles en tu sistema.
        Permite pagos en efectivo, transferencia, tarjetas y más.
      </Paragraph>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          margin: "32px 0",
          justifyContent: "flex-start",
          minWidth: 0,
          width: "100%",
        }}
      >
        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>💵</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Efectivo</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Permite registrar pagos en efectivo en el punto de venta.
          </Paragraph>
        </Card>
        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Transferencia</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Acepta pagos por transferencia bancaria y registra referencias.
          </Paragraph>
        </Card>
        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Tarjetas</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Permite pagos con tarjetas de débito y crédito.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Puedes activar o desactivar métodos de pago según la
        necesidad de tu negocio.
      </Paragraph>
    </>
  );
}

export default PaymentMethodsSection;
