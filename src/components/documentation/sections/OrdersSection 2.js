import React from "react";
import { Typography, Card, Tag, Divider, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function OrdersSection({ token }) {
  return (
    <>
      <Title level={3}>
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        Pedidos
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Crear Pedido
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Genera pedidos para clientes con productos, cantidades y datos de
            entrega.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Selecciona cliente activo
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Agrega productos al pedido
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Define tipo de entrega
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Guarda como borrador o activo
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Gestionar Pedidos
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Visualiza, edita y administra todos los pedidos del sistema.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Filtra por estado y fecha
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Edita pedidos pendientes
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Anula pedidos si es necesario
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Convierte en venta
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔄</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Estados
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Controla el flujo de trabajo de cada pedido.
          </Paragraph>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Tag color="default">Borrador</Tag>
            <Tag color="processing">Activo</Tag>
            <Tag color="success">Pagado</Tag>
            <Tag color="error">Anulado</Tag>
          </div>
        </Card>
      </div>

      <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
        Demo: Modal de Ficha de Pedido
      </Title>

      <Card
        bordered={false}
        style={{
          background: token.colorBgContainer,
          color: token.colorText,
          borderRadius: 14,
          boxShadow: token.boxShadowSecondary,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: 20,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                Pedido #P-2024-001
              </div>
              <div style={{ color: token.colorTextSecondary, fontSize: 14 }}>
                15/01/2024 - 14:30
              </div>
            </div>
            <Tag color="processing">Activo</Tag>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Cliente</div>
              <div>Juan Pérez</div>
              <div style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                +56 9 1234 5678
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Entrega</div>
              <div>Delivery</div>
              <div style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                Av. Providencia 123
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Productos</div>
            <div
              style={{
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 4,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span>Coca-Cola 1.5L</span>
                <span>2 x $1.500</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span>Pizza Margherita</span>
                <span>1 x $8.500</span>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                }}
              >
                <span>Total</span>
                <span>$11.500</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button type="primary" size="small">
              Editar
            </Button>
            <Button danger size="small">
              Anular
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default OrdersSection;
