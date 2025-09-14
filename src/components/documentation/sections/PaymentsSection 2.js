import React from "react";
import {
  Typography,
  Card,
  Tag,
  Divider,
  Select,
  InputNumber,
  Input,
  Button,
} from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function PaymentsSection({ token }) {
  return (
    <>
      <Title level={3}>
        <DollarCircleOutlined style={{ marginRight: 8 }} />
        Pagos
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Registrar Pago
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Gestiona pagos para pedidos y ventas con múltiples métodos.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Selecciona método</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Ingresa monto</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Agrega referencia</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Confirma pago</li>
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
            Métodos Disponibles
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Configura y usa diferentes formas de pago.
          </Paragraph>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Tag color="green">Efectivo</Tag>
            <Tag color="blue">Transferencia</Tag>
            <Tag color="purple">Débito</Tag>
            <Tag color="orange">Crédito</Tag>
          </div>
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Historial
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Revisa y gestiona todos los pagos registrados.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Filtra por método</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Busca por fecha</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Anula pagos</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Edita referencias</li>
          </ol>
        </Card>
      </div>

      <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
        Demo: Modal de Registro de Pago
      </Title>

      <Card
        hoverable
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
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Pedido/Venta</div>
            <div
              style={{
                padding: 12,
                background: token.colorBgLayout,
                borderRadius: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Venta #V-2024-001</span>
                <span style={{ fontWeight: 600 }}>$11.500</span>
              </div>
              <div style={{ color: token.colorTextSecondary, fontSize: 13 }}>
                Juan Pérez - 15/01/2024
              </div>
            </div>
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
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Método de Pago
              </div>
              <Select
                style={{ width: "100%" }}
                defaultValue="efectivo"
                options={[
                  { label: "Efectivo", value: "efectivo" },
                  { label: "Transferencia", value: "transferencia" },
                  { label: "Débito", value: "debito" },
                  { label: "Crédito", value: "credito" },
                ]}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Monto</div>
              <InputNumber
                style={{ width: "100%" }}
                defaultValue={11500}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Referencia (opcional)
            </div>
            <Input placeholder="Número de transferencia, etc." />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <Button type="primary">Guardar Pago</Button>
            <Button>Cancelar</Button>
          </div>
        </div>
      </Card>
    </>
  );
}

export default PaymentsSection;
