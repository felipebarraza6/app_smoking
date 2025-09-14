import React from "react";
import { Typography, Card, Tag } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function SalesSection({ token }) {
  return (
    <>
      <Title level={3}>
        <ShoppingCartOutlined style={{ marginRight: 8 }} />
        Ventas
      </Title>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 32,
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Registrar Venta
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Crea ventas directas o desde pedidos aprobados con cliente.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Selecciona productos
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Elige cliente</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Registra pagos</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Emite boleta</li>
          </ol>
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📈</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Gestión de Ventas
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Administra el historial completo de ventas realizadas.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Busca por cliente o fecha
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Reimprime boletas</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Edita ventas pendientes
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Anula si es necesario
            </li>
          </ol>
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Punto de Venta
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Interfaz rápida para ventas de pasillo sin cliente.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Búsqueda rápida</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Sin selección de cliente
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Múltiples pagos</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Boleta inmediata</li>
          </ol>
        </Card>
      </div>
    </>
  );
}

export default SalesSection;
