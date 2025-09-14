import React from "react";
import { Typography, Card } from "antd";
import { ShopOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function StoresSection({ token }) {
  return (
    <>
      <Title level={3}>
        <ShopOutlined style={{ marginRight: 8 }} />
        Tiendas y Sucursales
      </Title>
      <Paragraph>
        Administra todas las sucursales o puntos de venta de tu negocio. Cada
        tienda puede tener su propia dirección, inventario y usuarios asignados.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏬</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Registrar Tienda</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Agrega nuevas sucursales con dirección y datos de contacto.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Usuarios por Tienda
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Asigna usuarios responsables a cada sucursal.
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
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Inventario por Sucursal
          </div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Controla el stock y productos disponibles en cada tienda.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Puedes filtrar ventas, pedidos e inventario por sucursal
        para obtener reportes detallados.
      </Paragraph>
    </>
  );
}

export default StoresSection;
