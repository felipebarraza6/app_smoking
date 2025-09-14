import React from "react";
import { Typography, Card } from "antd";

const { Title, Paragraph } = Typography;

function IndicatorsSection({ token }) {
  return (
    <>
      <Title level={3} style={{ marginTop: 24 }}>
        Resumen e Indicadores del Dashboard
      </Title>
      <Paragraph>
        El dashboard te muestra los principales indicadores de tu negocio en
        tiempo real. Aquí tienes una vista de ejemplo y la explicación de cada
        dato:
      </Paragraph>
      <Typography.Text
        type="secondary"
        style={{ display: "block", marginBottom: 12, fontSize: 15 }}
      >
        <b>Nota:</b> Los números mostrados a continuación son solo de ejemplo.
        En el dashboard real verás los datos reales de tu empresa.
      </Typography.Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "flex-start",
          margin: "32px 0",
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Ventas</div>
          <div
            style={{
              fontSize: 22,
              color: token.colorSuccess,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            $1.200.000
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            Suma total de ventas realizadas en el período seleccionado. Incluye
            solo ventas activas y pagadas.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Costo</div>
          <div
            style={{
              fontSize: 22,
              color: token.colorWarning,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            $800.000
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            Suma de los costos de los productos vendidos. Permite calcular la
            utilidad real.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>💵</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Pagos</div>
          <div
            style={{
              fontSize: 22,
              color: token.colorPrimary,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            $1.000.000
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            Total de pagos recibidos (efectivo, transferencia, etc.). Si anulas
            una venta/pedido, sus pagos se descuentan automáticamente.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>#️⃣</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Cantidad Pedidos</div>
          <div
            style={{
              fontSize: 22,
              color: token.colorInfo,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            35
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            Número total de pedidos generados en el período. Incluye aprobados,
            anulados y borradores (separados en el dashboard).
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Producto más vendido
          </div>
          <div
            style={{
              fontSize: 18,
              color: token.colorText,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            Coca-Cola 1.5L
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            El producto con mayor cantidad de unidades vendidas en el período.
            Útil para promociones y stock.
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
          <div style={{ fontSize: 32, marginBottom: 8 }}>💎</div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Producto más rentable
          </div>
          <div
            style={{
              fontSize: 18,
              color: token.colorText,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            Red Bull 250ml
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            El producto que generó mayor ganancia (utilidad) en el período.
            Ayuda a enfocar la estrategia de ventas.
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
          <div style={{ fontWeight: 700, fontSize: 18 }}>Inventario</div>
          <div
            style={{
              fontSize: 18,
              color: token.colorText,
              fontWeight: 600,
              margin: "8px 0",
            }}
          >
            120 productos
          </div>
          <Paragraph type="secondary" style={{ fontSize: 15, margin: 0 }}>
            Total de productos registrados, con/sin stock, valor total y
            ganancia potencial si se vendiera todo el inventario.
          </Paragraph>
        </Card>
      </div>
      <Paragraph type="secondary" style={{ fontSize: 15 }}>
        <b>Tip:</b> Puedes hacer click en cada indicador real del dashboard para
        ver el detalle, filtrar por sucursal o fecha, y analizar el rendimiento
        de tu negocio en tiempo real.
      </Paragraph>
    </>
  );
}

export default IndicatorsSection;
