import React from "react";
import { Typography, Card } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ProductsSection({ token }) {
  return (
    <>
      <Title level={3}>
        <ShoppingOutlined style={{ marginRight: 8 }} />
        Productos e Inventario
      </Title>
      <Paragraph>
        Gestiona todos los productos de tu catálogo, su stock, precios y
        categorías. Mantén tu inventario actualizado y optimiza la gestión de
        ventas.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>➕</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Agregar Producto</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Crea nuevos productos con nombre, precio, stock y categoría.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔄</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Actualizar Stock</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Modifica el stock disponible de cada producto en tiempo real.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏷️</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Categorías</div>
          <Paragraph style={{ fontSize: 15, margin: "8px 0 0 0" }}>
            Organiza tus productos en categorías para facilitar la búsqueda y
            reportes.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Usa el buscador y los filtros para encontrar productos
        rápidamente y evitar quiebres de stock.
      </Paragraph>
    </>
  );
}

export default ProductsSection;
