import React from "react";
import { Typography, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ClientsSection({ token }) {
  return (
    <>
      <Title level={3}>
        <UserOutlined style={{ marginRight: 8 }} />
        Clientes y Contactos
      </Title>
      <Paragraph>
        Administra la base de clientes, registra nuevos contactos y consulta el
        historial de compras y pagos de cada cliente.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Registrar Cliente</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Agrega nuevos clientes con datos de contacto y preferencias.
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
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Historial de Compras
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Consulta el historial de compras, pagos y pedidos de cada cliente.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>📞</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Contactos y Seguimiento
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Lleva registro de contactos, llamadas y seguimiento comercial.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Segmenta tus clientes por preferencias y frecuencia de
        compra para campañas personalizadas.
      </Paragraph>
    </>
  );
}

export default ClientsSection;
