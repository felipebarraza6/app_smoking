import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Divider,
  Table,
  List,
  Flex,
  Tag,
  Button,
  Space,
} from "antd";
import {
  PrinterOutlined,
  DownloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { SaleContext } from "../../../../containers/Sale";
import { css } from "@emotion/react";
import { theme } from "antd";
import { formatCLP } from "../../../orders/ListOrdersManagement/renderColumn";

const { Title, Text } = Typography;

/** @jsxImportSource @emotion/react */

const ReceiptModal = ({ visible, onClose, saleData }) => {
  // Siempre llama a useContext al inicio
  const saleContext = useContext(SaleContext);

  // Si hay contexto, úsalo; si no, usa saleData
  const state = saleContext || {};

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  // Actualizar hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Usar datos del contexto si existen, si no, usar saleData
  const branch = state?.branchs?.selected || saleData?.branch || {};
  const client = state?.clients?.selected || saleData?.client || {};
  const driver = state?.drivers?.selected || saleData?.driver || {};
  const products =
    state?.products?.selected_products || saleData?.registers || [];
  const payments = state?.payments?.list || saleData?.payments || [];
  const paytotal = state?.payments?.paytotal || saleData?.paytotal || 0;
  const is_delivery = state?.drivers?.selected || saleData?.is_delivery;
  const is_pay = state?.order?.is_pay ?? saleData?.is_pay;
  const is_null = state?.order?.is_null ?? saleData?.is_null;
  const is_active = state?.order?.is_active ?? saleData?.is_active;

  // Obtener fecha y hora de creación
  const createdDate = saleData?.created
    ? new Date(saleData.created)
    : new Date();
  const fechaStr = createdDate.toLocaleDateString("es-CL");
  const horaStr = createdDate.toLocaleTimeString("es-CL");

  // Obtener nombre de sucursal robusto
  let branchObj = null;
  if (saleData?.is_sale && saleData?.branch_only_sale) {
    branchObj = saleData.branch_only_sale;
  } else if (client && client.branch) {
    branchObj = client.branch;
  } else if (branch) {
    branchObj = branch;
  } else if (saleData?.branch) {
    branchObj = saleData.branch;
  }

  // Si aún no tenemos sucursal, usar la del estado
  if (!branchObj && state?.branchs?.selected) {
    branchObj = state.branchs.selected;
  }

  const branchName =
    branchObj?.business_name || branchObj?.name || "Sin sucursal";

  // Función para obtener color y label del estado
  const getEstadoFicha = () => {
    if (!saleData) return { color: "default", label: "-" };
    if (saleData.is_null) return { color: "red", label: "Anulada" };
    if (saleData.is_pay) return { color: "green", label: "Completado" };
    if (saleData.is_active === false || saleData.is_active === null)
      return { color: "default", label: "Borrador" };
    if (!saleData.is_pay) return { color: "orange", label: "Pagos Pendientes" };
    return { color: "default", label: "Desconocido" };
  };
  const estadoFicha = getEstadoFicha();

  // Calcular totales
  const calculateTotals = () => {
    if (!products) return { subtotal: 0, delivery: 0, total: 0 };
    const subtotal = products.reduce((total, product) => {
      const price = typeof product.price === "number" ? product.price : 0;
      const quantity =
        typeof product.quantity === "number" ? Math.abs(product.quantity) : 0;
      return total + price * quantity;
    }, 0);
    // Usar driver.amount como monto de reparto si is_delivery es true
    const delivery =
      is_delivery && driver && typeof driver.amount === "number"
        ? Math.abs(driver.amount)
        : 0;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  };
  const totals = calculateTotals();

  // Estilos para la boleta
  const receiptStyles = css`
    .receipt-container {
      background: #f0f2f5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      padding: 0px;
      margin: 0px;
      border-radius: 0px;
    }
    .receipt-header {
      text-align: center;
      padding: 10px;
      border-radius: 0px;
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
      background-color: black;
      padding: 10px;
      border-radius: 0px;
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

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };

  // Función para descargar como PDF (simulada)
  const handleDownload = () => {
    const receiptContent =
      document.querySelector(".receipt-container").innerText;
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boleta_${saleData?.id || "venta"}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const {
    token: { colorPrimary, colorText },
  } = theme.useToken();
  const isDark = colorText === "#fff" || colorText === "#ffffff";

  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

  return (
    <Modal
      title={
        <Flex align="center" gap="small">
          <PrinterOutlined />
          <span>Boleta de Venta</span>
        </Flex>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100vw" : 320}
      centered
      style={{ top: 0, padding: 0, borderRadius: 0 }}
      bodyStyle={{ padding: 0, background: "transparent", borderRadius: 0 }}
    >
      <div css={receiptStyles} style={{ borderRadius: 0 }}>
        <div
          className="receipt-container"
          style={{
            background: "#fff",
            borderRadius: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            maxWidth: 320,
            margin: "auto",
          }}
        >
          {/* Encabezado de la boleta */}
          <div className="receipt-header">
            <div className="receipt-title" style={{ color: "white" }}>
              {branchName}
            </div>
            <div className="receipt-subtitle" style={{ color: "white" }}>
              {branchObj?.address || "Dirección del negocio"}
            </div>
            <div className="receipt-subtitle" style={{ color: "white" }}>
              Tel: {branchObj?.phone || "N/A"}
            </div>
          </div>

          {/* Información de la venta */}
          <div className="receipt-info">
            <div className="receipt-info-row">
              <Text
                style={{
                  color: "green",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                {saleData?.id || "N/A"}
              </Text>
            </div>
            <div className="receipt-info-row">
              <Text style={{ color: "#444" }}>Fecha:</Text>
              <Text style={{ color: "#222", fontWeight: "bold" }}>
                {fechaStr}
              </Text>
            </div>
            <div className="receipt-info-row">
              <Text style={{ color: "#444" }}>Hora:</Text>
              <Text style={{ color: "#222", fontWeight: "bold" }}>
                {horaStr}
              </Text>
            </div>
            {client && client.name && (
              <>
                <div className="receipt-info-row">
                  <Text style={{ color: "#444" }}>Cliente:</Text>
                  <Text style={{ color: "#222", fontWeight: "bold" }}>
                    {client.name}
                  </Text>
                </div>
                {client.phone_number && (
                  <div className="receipt-info-row">
                    <Text style={{ color: "#444" }}>Teléfono:</Text>
                    <Text style={{ color: "#222", fontWeight: "bold" }}>
                      +56 9 {client.phone_number}
                    </Text>
                  </div>
                )}
              </>
            )}
            {/* Mostrar reparto solo si is_delivery es true */}
            {is_delivery && driver && driver.name && (
              <div className="receipt-info-row">
                <Text style={{ color: "#444" }}>Reparto:</Text>
                <Text style={{ color: "#222", fontWeight: "bold" }}>
                  {driver.name}
                </Text>
              </div>
            )}
            <div className="receipt-info-row">
              <Text style={{ color: "#444" }}>Estado:</Text>
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
                saleData?.registers?.map((p) => ({
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
                ${totals.subtotal.toLocaleString("es-CL")}
              </Text>
            </div>
            {/* Mostrar reparto solo si is_delivery es true */}
            {is_delivery && totals.delivery > 0 && (
              <div className="receipt-info-row">
                <Text style={{ color: "#222" }}>Reparto:</Text>
                <Text style={{ color: "#222", fontWeight: "bold" }}>
                  ${totals.delivery.toLocaleString("es-CL")}
                </Text>
              </div>
            )}
            <div className="receipt-total">
              <Text
                style={{ fontSize: "18px", color: "#222", fontWeight: "bold" }}
              >
                TOTAL: ${totals.total.toLocaleString("es-CL")}
              </Text>
            </div>
          </div>

          {/* Información de pagos */}
          {payments.length > 0 && (
            <>
              <Divider className="receipt-divider" />
              <div className="receipt-info">
                <Text strong style={{ fontSize: "14px", color: "black" }}>
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
                  const date_payment =
                    typeof payment.created === "string"
                      ? payment.created
                      : payment.created &&
                        typeof payment.date_payment === "object" &&
                        payment.date_payment.created
                      ? payment.date_payment.created
                      : "";
                  return (
                    <div key={index} className="receipt-info-row">
                      <Flex vertical gap="0px">
                        {date_payment && (
                          <Text style={{ color: "black" }}>
                            {(() => {
                              const d = new Date(date_payment);
                              const day = String(d.getDate()).padStart(2, "0");
                              const month = String(d.getMonth() + 1).padStart(
                                2,
                                "0"
                              );
                              const year = String(d.getFullYear()).slice(-2);
                              const hour = String(d.getHours()).padStart(
                                2,
                                "0"
                              );
                              const min = String(d.getMinutes()).padStart(
                                2,
                                "0"
                              );
                              return `${day}-${month}-${year} ${hour}:${min}`;
                            })()}
                          </Text>
                        )}
                        <Text style={{ color: "black" }}>
                          {typePayment.toUpperCase()}
                        </Text>
                      </Flex>

                      <span style={{ color: "#222", fontWeight: 500 }}>
                        {formatCLP(amount)}
                      </span>

                      {payment.reference && (
                        <Text
                          style={{ marginLeft: 8, color: "#888", fontSize: 12 }}
                        >
                          Ref: {payment.reference}
                        </Text>
                      )}
                    </div>
                  );
                })}
                {paytotal > totals.total && (
                  <div className="receipt-info-row">
                    <Text>Vuelto:</Text>
                    <Text>
                      ${(paytotal - totals.total).toLocaleString("es-CL")}
                    </Text>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pie de la boleta */}
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
              ¡Gracias por su compra!
              <br />
              Conserve esta boleta
              <br />
              Válida para cambios y devoluciones
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
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>

            <Button icon={<CloseOutlined />} onClick={onClose}>
              Cerrar
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
