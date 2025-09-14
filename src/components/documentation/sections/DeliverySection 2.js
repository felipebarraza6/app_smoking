import React from "react";
import { Typography, Card } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function DeliverySection({ token }) {
  return (
    <>
      <Title level={3}>
        <CarOutlined style={{ marginRight: 8 }} />
        Repartidores
      </Title>
      <Paragraph>
        Gestiona los repartidores de tu empresa, asigna pedidos y controla el
        estado de las entregas en tiempo real.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚗</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Registrar Repartidor
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Agrega nuevos repartidores con nombre y datos de contacto.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Asignar Pedidos</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Asigna pedidos a repartidores y controla el estado de cada entrega.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Seguimiento en Tiempo Real
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Visualiza la ubicación y estado de los repartidores en el mapa.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Usa la app móvil para que los repartidores actualicen el
        estado de cada entrega en tiempo real.
      </Paragraph>
    </>
  );
}

export default DeliverySection;
