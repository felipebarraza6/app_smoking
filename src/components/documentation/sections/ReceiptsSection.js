import React from "react";
import { Typography, Card, Tag, Divider } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function ReceiptsSection({ token }) {
  return (
    <>
      <Title level={3}>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Boletas y Comprobantes
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧾</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Boleta Electrónica
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Documento legal para ventas menores a $45.000 sin IVA.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Se genera automáticamente
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Numeración única</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Formato legal SII</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Reposición disponible
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Comprobante de Pedido
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Documento para pedidos pendientes de pago.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Datos del cliente</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Lista de productos
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Total pendiente</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Fecha de vencimiento
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🖨️</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Impresión
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Opciones de impresión y envío de documentos.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Impresión inmediata
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Reimpresión desde historial
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Envío por correo</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Descarga PDF</li>
          </ol>
        </Card>
      </div>

      <Title level={4} style={{ marginTop: 32, marginBottom: 16 }}>
        Demo: Modal de Boleta
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
            maxWidth: 320,
            margin: "auto",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            border: "2px solid #eee",
            padding: 0,
          }}
        >
          {/* Encabezado de la boleta */}
          <div
            style={{
              textAlign: "center",
              padding: 10,
              borderRadius: "0px 0px 20px 20px",
              background: "black",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
                padding: 10,
                marginBottom: 5,
              }}
            >
              EMPRESA EJEMPLO SPA
            </div>
            <div style={{ color: "white", fontSize: 14 }}>
              Av. Providencia 123, Santiago
            </div>
            <div style={{ color: "white", fontSize: 14 }}>
              Tel: +56 2 2345 6789
            </div>
          </div>
          {/* Información de la venta */}
          <div style={{ marginBottom: 15, padding: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  color: "green",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                V-2024-001
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#444" }}>Fecha:</span>
              <span style={{ color: "#222", fontWeight: "bold" }}>
                15/01/2024
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#444" }}>Hora:</span>
              <span style={{ color: "#222", fontWeight: "bold" }}>14:30</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#444" }}>Cliente:</span>
              <span style={{ color: "#222", fontWeight: "bold" }}>
                Juan Pérez
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#444" }}>Estado:</span>
              <span
                style={{
                  background: "#52c41a",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 14,
                  borderRadius: 4,
                  padding: "0 8px",
                }}
              >
                Pagado
              </span>
            </div>
          </div>
          <Divider style={{ margin: "15px 0", borderTop: "5px dashed #ccc" }} />
          {/* Productos */}
          <div style={{ marginBottom: 15, padding: "0 10px" }}>
            <span style={{ fontWeight: "bold", fontSize: 14, color: "#222" }}>
              Productos:
            </span>
            <div style={{ marginTop: 10, background: "#fff" }}>
              <div
                style={{
                  color: "#222",
                  fontWeight: "bold",
                  background: "#fff",
                  padding: 4,
                  borderRadius: 4,
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
                  color: "#222",
                  fontWeight: "bold",
                  background: "#fff",
                  padding: 4,
                  borderRadius: 4,
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
          <Divider style={{ margin: "15px 0", borderTop: "5px dashed #ccc" }} />
          {/* Totales */}
          <div style={{ padding: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ color: "#222" }}>Subtotal:</span>
              <span style={{ color: "#222", fontWeight: "bold" }}>$11.500</span>
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#222",
                fontWeight: "bold",
                textAlign: "right",
                marginTop: 10,
              }}
            >
              TOTAL: $11.500
            </div>
          </div>
          {/* Información de pagos */}
          <Divider style={{ margin: "15px 0", borderTop: "5px dashed #ccc" }} />
          <div style={{ padding: 10 }}>
            <span style={{ fontWeight: "bold", fontSize: 14 }}>
              Formas de Pago:
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <span>Efectivo:</span>
              <span>$11.500</span>
            </div>
          </div>
          {/* Pie de la boleta */}
          <div
            style={{
              textAlign: "center",
              background: "black",
              padding: 10,
              borderRadius: "0px 0px 12px 12px",
              marginTop: 20,
              fontSize: 12,
              color: "#fff",
            }}
          >
            <div>¡Gracias por su compra!</div>
            <div>Conserve esta boleta</div>
            <div>Válida para cambios y devoluciones</div>
            <div
              style={{
                marginTop: 10,
                color: "#bbb",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Powered by Smoking ERP
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default ReceiptsSection;
