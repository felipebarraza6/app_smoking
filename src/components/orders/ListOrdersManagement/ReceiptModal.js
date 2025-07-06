import React, { useState, useRef } from "react";
import {
  Modal,
  Typography,
  Divider,
  Flex,
  Tag,
  Button,
  Space,
  theme,
  message,
  Table,
  List,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  WhatsAppOutlined,
  CloseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { formatCLP } from "./renderColumn";

const { Title, Text } = Typography;

/** @jsxImportSource @emotion/react */

const ReceiptModal = ({ visible, onClose, orderData, type = "pedido" }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const receiptRef = useRef(null);
  const {
    token: { colorPrimary, colorText },
  } = theme.useToken();
  const isDark = colorText === "#fff" || colorText === "#ffffff";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

  if (!orderData) return null; // Protección contra null

  const label = type === "boleta" ? "Boleta" : "Pedido";
  const icon = type === "boleta" ? <FileTextOutlined /> : <PrinterOutlined />;

  const receiptStyles = css`
    .receipt-container {
      background: #f0f2f5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: auto;
    }
    .receipt-header {
      text-align: center;
      padding: 10px;
      border-radius: 0px 0px 20px 20px;
      background: black;
      margin-bottom: 20px;
    }
    .receipt-title {
      font-size: 18px;
      font-weight: bold;
      padding: 10px;
      margin-bottom: 5px;
    }
    .receipt-subtitle {
      font-size: 14px;
      color: white;
    }
    .receipt-info {
      margin-bottom: 15px;
      padding: 10px;
    }
    .receipt-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .receipt-info-row-id {
      display: flex;
      justify-content: center;
      margin-bottom: 5px;
    }
    .receipt-divider {
      margin: 15px 0;
      border-top: 5px dashed #ccc;
    }
    .receipt-total {
      font-size: 16px;
      font-weight: bold;
      text-align: right;
      margin-top: 10px;
      color: #222;
    }
    .receipt-footer {
      text-align: center;
      background: black;
      padding: 10px;
      border-radius: 0px 0px 0px 0px;
      margin-top: 20px;
      font-size: 12px;
    }
    @media print {
      .receipt-container {
        box-shadow: none;
        max-width: none;
      }
      .modal-actions {
        display: none;
      }
    }
  `;

  const handlePrint = () => {
    window.print();
  };

  // Calcular totales
  const calculateTotals = () => {
    if (!orderData?.registers) return { subtotal: 0, delivery: 0, total: 0 };
    const subtotal = orderData.registers.reduce((total, product) => {
      const price = typeof product.price === "number" ? product.price : 0;
      const quantity =
        typeof product.quantity === "number" ? Math.abs(product.quantity) : 0;
      return total + price * quantity;
    }, 0);
    // Usar driver.amount como monto de reparto si is_delivery es true
    const delivery =
      orderData.is_delivery &&
      orderData.driver &&
      typeof orderData.driver.amount === "number"
        ? Math.abs(orderData.driver.amount)
        : 0;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  };
  const totals = calculateTotals();

  // Función para obtener color y label del estado
  const getEstadoFicha = () => {
    if (!orderData) return { color: "default", label: "-" };
    if (orderData.is_null) return { color: "red", label: "Anulada" };
    if (orderData.is_pay) return { color: "green", label: "Completado" };
    if (orderData.is_active === false || orderData.is_active === null)
      return { color: "default", label: "Borrador" };
    if (!orderData.is_pay)
      return { color: "orange", label: "Pagos Pendientes" };
    return { color: "default", label: "Desconocido" };
  };
  const estadoFicha = getEstadoFicha();

  // Obtener nombre de sucursal robusto
  let branchObj = null;
  if (orderData?.is_sale && orderData?.branch_only_sale) {
    branchObj = orderData.branch_only_sale;
  } else if (orderData?.client && orderData.client.branch) {
    branchObj = orderData.client.branch;
  } else if (orderData?.branch) {
    branchObj = orderData.branch;
  }
  const branchName =
    branchObj?.business_name || branchObj?.name || "Sin sucursal";

  const payments = Array.isArray(orderData.payments) ? orderData.payments : [];

  return (
    <Modal
      title={
        <Flex align="center" gap="small">
          {icon}
          <span>Ficha de {label}</span>
        </Flex>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100vw" : 500}
      centered
      style={{ top: 0, padding: 0 }}
      bodyStyle={{ padding: 0, background: "transparent" }}
    >
      <div css={receiptStyles}>
        <div
          className="receipt-container"
          ref={receiptRef}
          style={{
            background: "#fff",
            borderRadius: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            maxWidth: 500,
            margin: "auto",
          }}
        >
          {/* Encabezado de la ficha */}
          <div className="receipt-header">
            <div className="receipt-subtitle">
              <b>{branchName}</b>
            </div>
            <div className="receipt-subtitle">{branchObj?.dni || "N/A"}</div>
            <div className="receipt-subtitle">
              {branchObj?.address || "Dirección del negocio"} / +56 9{" "}
              {branchObj?.phone || "N/A"}
            </div>
          </div>

          {/* Información del pedido/boleta */}
          <div className="receipt-info">
            <div className="receipt-info-row-id">
              <Tag color="green">{orderData?.id || "N/A"}</Tag>
            </div>
            <div className="receipt-info-row">
              <Text style={{ color: "#444" }}>Fecha:</Text>
              <Text style={{ color: "#222", fontWeight: "bold" }}>
                {orderData?.date
                  ? new Date(orderData.date).toLocaleDateString("es-CL")
                  : new Date().toLocaleDateString("es-CL")}
              </Text>
            </div>
            <div className="receipt-info-row">
              <Text style={{ color: "#444" }}>Hora:</Text>
              <Text style={{ color: "#222", fontWeight: "bold" }}>
                {orderData?.date
                  ? new Date(orderData.date).toLocaleTimeString("es-CL")
                  : new Date().toLocaleTimeString("es-CL")}
              </Text>
            </div>
            {orderData?.client && (
              <>
                <div className="receipt-info-row">
                  <Text style={{ color: "#444" }}>Cliente:</Text>
                  <Text style={{ color: "#222", fontWeight: "bold" }}>
                    {orderData.client.name}
                  </Text>
                </div>
                {orderData.client.phone_number && (
                  <div className="receipt-info-row">
                    <Text style={{ color: "#444" }}>Teléfono:</Text>
                    <Text style={{ color: "#222", fontWeight: "bold" }}>
                      +56 9 {orderData.client.phone_number}
                    </Text>
                  </div>
                )}
              </>
            )}
            {/* Mostrar reparto solo si is_delivery es true */}
            {orderData.is_delivery && orderData.driver && (
              <div className="receipt-info-row">
                <Text style={{ color: "#444" }}>Reparto:</Text>
                <Text style={{ color: "#222", fontWeight: "bold" }}>
                  {orderData.driver.name}
                </Text>
              </div>
            )}
            <div className="receipt-info-row">
              <Tag
                color={estadoFicha.color}
                style={{
                  fontWeight: 500,
                  fontSize: 13,
                  borderRadius: 6,
                  padding: "2px 10px",
                  marginBottom: 4,
                  border: "none",
                  background:
                    estadoFicha.color === "default" ? "#f5f5f5" : undefined,
                }}
              >
                {estadoFicha.label}
              </Tag>
              {/* Mostrar cuotas pagadas de cuotas totales */}
              {(() => {
                const payments = Array.isArray(orderData.payments)
                  ? orderData.payments
                  : [];
                const cuotasPagadas = payments.length;
                const cuotasTotales = orderData.payment_fees || 0;
                if (orderData.is_pay) {
                  return (
                    <Tag color="green">
                      {`${cuotasPagadas} de ${cuotasTotales} pagos`}
                    </Tag>
                  );
                }
                if (orderData.is_null) {
                  return <></>;
                }
                return (
                  <Tag color={estadoFicha.color}>
                    {`${cuotasPagadas} de ${cuotasTotales} pagos`}
                  </Tag>
                );
              })()}
            </div>
          </div>

          <Divider className="receipt-divider" />

          {/* Productos */}
          <div
            style={{
              marginBottom: "15px",
              background: "#fff",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <List
              dataSource={
                orderData?.registers?.map((p) => ({
                  ...p,
                  name: p.product?.name || p.name || "Producto",
                  quantity: Math.abs(p.quantity),
                  price: p.price || 0,
                })) || []
              }
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: "6px 0",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fff",
                  }}
                >
                  <span style={{ color: "#222", fontWeight: 500 }}>
                    {item.name}
                  </span>
                  <span style={{ color: "#444", fontSize: 13 }}>
                    {item.quantity} x ${item.price.toLocaleString("es-CL")}
                  </span>
                </List.Item>
              )}
              style={{ background: "#fff", borderRadius: 8, marginTop: 8 }}
              split={false}
            />
          </div>

          <Divider className="receipt-divider" />

          {/* Totales */}
          <div className="receipt-info">
            <div className="receipt-info-row">
              <Text style={{ color: "#222" }}>Subtotal:</Text>
              <Text style={{ color: "#222", fontWeight: "bold" }}>
                {totals.subtotal.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </Text>
            </div>
            {/* Mostrar reparto solo si is_delivery es true */}
            {orderData.is_delivery && totals.delivery > 0 && (
              <div className="receipt-info-row">
                <Text style={{ color: "#222" }}>Reparto:</Text>
                <Text style={{ color: "#222", fontWeight: "bold" }}>
                  {totals.delivery.toLocaleString("es-CL", {
                    style: "currency",
                    currency: "CLP",
                  })}
                </Text>
              </div>
            )}
            <div className="receipt-total">
              <Text
                style={{ fontSize: "18px", color: "#222", fontWeight: "bold" }}
              >
                TOTAL:{" "}
                {totals.total.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </Text>
            </div>
          </div>

          {/* En la sección de pagos, mostrar referencia si existe */}
          {payments.length > 0 && (
            <>
              <Divider className="receipt-divider" />
              <div className="receipt-info">
                <Text strong style={{ fontSize: "14px", color: "#222" }}>
                  Formas de Pago:
                </Text>
                {payments.map((payment, index) => {
                  let typePayment =
                    payment.type_payment_name || payment.type_payment || "N/A";
                  if (typeof typePayment === "object" && typePayment.name)
                    typePayment = typePayment.name;
                  const amount =
                    typeof payment.amount === "number"
                      ? payment.amount
                      : payment.amount &&
                        typeof payment.amount === "object" &&
                        payment.amount.amount
                      ? payment.amount.amount
                      : 0;
                  const fechaHora =
                    payment.date_payment || payment.created
                      ? (() => {
                          const d = new Date(
                            payment.date_payment || payment.created
                          );
                          const day = String(d.getDate()).padStart(2, "0");
                          const month = String(d.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const year = String(d.getFullYear()).slice(-2);
                          const hour = String(d.getHours()).padStart(2, "0");
                          const min = String(d.getMinutes()).padStart(2, "0");
                          return `${day}-${month}-${year} ${hour}:${min}`;
                        })()
                      : "";
                  return (
                    <div
                      key={index}
                      className="receipt-info-row"
                      style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "#222", fontSize: 13 }}>
                          {fechaHora}
                        </span>
                        <span style={{ color: "#222", fontWeight: 500 }}>
                          {formatCLP(amount)}
                        </span>
                      </div>
                      <span
                        style={{ color: "#222", fontSize: 13, marginTop: 2 }}
                      >
                        {typePayment}
                      </span>
                      {payment.reference && (
                        <span
                          style={{ color: "#888", fontSize: 12, marginTop: 2 }}
                        >
                          Ref: {payment.reference}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer negro con letra blanca, igual que boleta */}
          <div
            className="receipt-footer"
            style={{
              background: "black",
              textAlign: "center",
              padding: 10,
              borderRadius: 0,
              border: "none",
              marginTop: 20,
              fontSize: 12,
              color: "white",
            }}
          >
            <div style={{ color: "white", fontSize: 13, fontWeight: 500 }}>
              ¡Gracias por su preferencia!
              <br />
              Conserve esta ficha
              <br />
              Válida para seguimiento y reclamos
            </div>
            <div
              style={{
                marginTop: 10,
                color: "#eee",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Powered by Smoking ERP
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div
          className="modal-actions"
          style={{ marginTop: "20px", textAlign: "center" }}
        >
          <Space>
            <Button
              type="primary"
              shape="circle"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            ></Button>
            <Button
              icon={<CloseOutlined />}
              onClick={onClose}
              type="primary"
              shape="circle"
            ></Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
