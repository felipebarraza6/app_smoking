import React, { useContext, useEffect, useState } from "react";
import { SaleContext } from "../../../../containers/Sale";
import {
  Button,
  Flex,
  Divider,
  Card,
  Tag,
  Table,
  Input,
  App,
  Statistic,
} from "antd";
import { IoBagCheckSharp } from "react-icons/io5";
import { DollarOutlined } from "@ant-design/icons";
import { BsCartCheckFill } from "react-icons/bs";
import { FaTruckFast } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import FormPay from "./FormPay";
import { FaMoneyBills } from "react-icons/fa6";
import { FaCheckDouble } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6";
import { DeleteOutlined } from "@ant-design/icons";
import ReceiptModal from "./ReceiptModal";
import api from "../../../../api/endpoints";
import { useBreakpoint, isMobile } from "../../../../utils/breakpoints";

const Payments = () => {
  const { state, dispatch } = useContext(SaleContext);
  const { notification } = App.useApp();
  const breakpoint = useBreakpoint();
  const mobile = isMobile(breakpoint);

  // Estado para controlar el modal de boleta
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [completedSaleData, setCompletedSaleData] = useState(null);

  const totalPricePay = () => {
    let total = 0;
    state.products.selected_products.forEach((product) => {
      total += product.price * product.quantity;
    });
    if (state.drivers.selected) {
      total += state.drivers.selected.charge_amount;
    }

    return total.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  const totalPricePayValue = () => {
    let total = 0;
    state.products.selected_products.forEach((product) => {
      total += product.price * product.quantity;
    });
    if (state.drivers.selected) {
      total += state.drivers.selected.quantity;
    }
    return total;
  };

  const totalPriceProduct = () => {
    let total = 0;
    state.products.selected_products.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
    });
  };

  const priceDriver = () => {
    if (state.drivers.selected) {
      return state.drivers.selected.charge_amount.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
      });
    } else {
      return "Sin reparto";
    }
  };

  const fetchTypePayments = async () => {
    const response = await api.payments.type_payments
      .list()
      .then((response) => {
        dispatch({
          type: "add_type_payments",
          payload: response.results,
        });
        return response.results;
      });
  };

  useEffect(() => {
    fetchTypePayments();
  }, []);

  // Función para finalizar venta y mostrar boleta
  const handleFinishSale = async () => {
    try {
      // Crear los pagos
      await api.payments.bulk.create(state.payments.list);

      // Actualizar la orden como pagada
      const updatedOrder = await api.orders.update(state.order.create_id, {
        is_pay: true,
        is_active: true,
      });

      // Preparar datos completos para la boleta
      const saleDataForReceipt = {
        id: state.order.create_id,
        ...updatedOrder.data,
        // Asegurar que se incluyan los datos del contexto si no están en la respuesta del backend
        branch: state.branchs.selected,
        client: state.clients.selected,
        driver: state.drivers.selected,
        registers: state.products.selected_products,
        payments: state.payments.list,
        paytotal: state.payments.paytotal,
        is_delivery: !!state.drivers.selected,
        is_sale: true,
        is_pay: true,
        is_active: true,
        // Si no hay cliente, incluir branch_only_sale
        ...(state.clients.selected
          ? {}
          : {
              branch_only_sale: state.branchs.selected,
            }),
      };

      // Guardar datos de la venta completada para la boleta
      setCompletedSaleData(saleDataForReceipt);

      // Mostrar notificación de éxito
      notification.success({
        message: "Venta finalizada exitosamente",
        description: "La boleta se mostrará en un momento...",
      });

      // Mostrar el modal de boleta
      setReceiptModalVisible(true);
    } catch (error) {

      notification.error({
        message: "Error al finalizar la venta",
        description: "Por favor, inténtelo nuevamente.",
      });
    }
  };

  // Función para cerrar el modal de boleta y resetear
  const handleCloseReceipt = () => {
    setReceiptModalVisible(false);
    setCompletedSaleData(null);
    dispatch({ type: "reset_all" });
  };

  // Estadísticas de pago (2x2 grid en mobile)
  const PaymentStatsMobile = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
        width: "100%",
        marginBottom: 16,
      }}
    >
      {[
        {
          title: "Total",
          value: totalPricePay(),
          icon: <FaMoneyBills style={{ marginRight: 4 }} />,
        },
        {
          title: "Por pagar",
          value: (totalPricePayValue() - state.payments.paytotal > 0
            ? totalPricePayValue() - state.payments.paytotal
            : 0
          ).toLocaleString("es-CL", { style: "currency", currency: "CLP" }),
          icon: <FaMoneyBillTrendUp style={{ marginRight: 4 }} />,
        },
        {
          title: "Pagado",
          value: state.payments.paytotal.toLocaleString("es-CL", {
            style: "currency",
            currency: "CLP",
          }),
          icon: <FaCheckDouble style={{ marginRight: 4 }} />,
        },
        {
          title: "Vuelto",
          value:
            parseInt(state.payments.paytotal) - totalPricePayValue() > 0
              ? (
                  parseInt(state.payments.paytotal) - totalPricePayValue()
                ).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })
              : (0).toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }),
          icon: <GiReceiveMoney style={{ marginRight: 4 }} />,
        },
      ].map((stat) => (
        <div
          key={stat.title}
          style={{
            background: "#18181a",
            borderRadius: 8,
            padding: "10px 0 6px 0",
            textAlign: "center",
            minWidth: 0,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 13, marginBottom: 2 }}>{stat.title}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {stat.icon} {stat.value}
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>CLP</div>
        </div>
      ))}
    </div>
  );

  // Estadísticas desktop (vertical)
  const PaymentStatsDesktop = (
    <Flex
      vertical
      gap="small"
      style={{ width: "20%", marginBottom: 0 }}
      justify="space-around"
    >
      <Statistic
        title="Total"
        value={totalPricePay()}
        valueStyle={{ fontSize: "15px" }}
        prefix={<FaMoneyBills style={{ marginRight: "10px" }} />}
        suffix="CLP"
      />
      <Statistic
        title="Por pagar"
        value={(totalPricePayValue() - state.payments.paytotal > 0
          ? totalPricePayValue() - state.payments.paytotal
          : 0
        ).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
        valueStyle={{ fontSize: "15px" }}
        prefix={<FaMoneyBillTrendUp style={{ marginRight: "10px" }} />}
        suffix="CLP"
      />
      <Statistic
        title="Pagado"
        value={state.payments.paytotal.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        })}
        valueStyle={{ fontSize: "15px" }}
        suffix="CLP"
        prefix={<FaCheckDouble style={{ marginRight: "10px" }} />}
      />
      <Statistic
        title="Vuelto"
        value={
          parseInt(state.payments.paytotal) - totalPricePayValue() > 0
            ? (
                parseInt(state.payments.paytotal) - totalPricePayValue()
              ).toLocaleString("es-CL", { style: "currency", currency: "CLP" })
            : (0).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })
        }
        valueStyle={{ fontSize: "15px" }}
        prefix={<GiReceiveMoney style={{ marginRight: "10px" }} />}
      />
    </Flex>
  );

  // Header reparto mobile
  const RepartoHeaderMobile = (
    <Flex
      align="center"
      gap={8}
      style={{ width: "100%", justifyContent: "space-between" }}
    >
      <span style={{ fontWeight: 600, fontSize: 15 }}>Reparto</span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        {state.drivers.selected ? (
          <FaTruckFast style={{ marginRight: 6 }} />
        ) : (
          <FaTruck style={{ marginRight: 6 }} />
        )}
        {priceDriver()}
      </span>
    </Flex>
  );

  return (
    <Flex vertical gap={"large"} style={{ width: "100%" }}>
      <Card
        hoverable
        size={mobile ? "small" : undefined}
        title={mobile ? RepartoHeaderMobile : <FormPay />}
        style={{ width: "100%" }}
        bodyStyle={{ padding: mobile ? 12 : 24 }}
      >
        {mobile ? (
          <>
            {PaymentStatsMobile}
            <div style={{ width: "100%", margin: "10px" }}>
              <FormPay />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <Button
                  type="primary"
                  onClick={handleFinishSale}
                  disabled={state.payments.paytotal < totalPricePayValue()}
                  icon={<BsCartCheckFill />}
                  style={{ width: "100%" }}
                >
                  Finalizar Venta
                </Button>
                <Button
                  icon={<FaPencil />}
                  style={{ width: "100%" }}
                  onClick={() => {
                    dispatch({ type: "reset_all" });
                    notification.success({
                      message: "Borrador guardado correctamente.",
                    });
                  }}
                >
                  Guardar Borrador
                </Button>
              </div>
            </div>
            <Table
              dataSource={state.payments?.list || []}
              bordered
              style={{ width: "100%" }}
              pagination={{
                pageSize: (state.payments?.list || []).length,
              }}
              size="small"
              columns={[
                {
                  title: "Monto ($)",
                  render: (value) =>
                    parseInt(value).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    }),
                  name: "amount",
                  dataIndex: "amount",
                },
                {
                  title: "Tipo de pago",
                  name: "type_payment",
                  dataIndex: "type_payment",
                  render: (value) => {
                    const filter_type_payment_for_id = (
                      state.payments?.type_payments || []
                    ).find((tp) => tp.id === value);
                    return filter_type_payment_for_id
                      ? filter_type_payment_for_id.name
                      : value;
                  },
                },
                {
                  title: "Referencia",
                  dataIndex: "reference",
                  name: "reference",
                },
                {
                  title: "Acción",
                  render: (record) => (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={() => {
                        dispatch({
                          type: "delete_payment",
                          payload: record.key,
                        });
                      }}
                    />
                  ),
                },
              ]}
            />
          </>
        ) : (
          <Flex gap={"small"}>
            {PaymentStatsDesktop}
            <Table
              dataSource={state.payments?.list || []}
              bordered
              style={{ width: "100%" }}
              pagination={{
                pageSize: (state.payments?.list || []).length,
              }}
              size="small"
              columns={[
                {
                  title: "Monto ($)",
                  render: (value) =>
                    parseInt(value).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    }),
                  name: "amount",
                  dataIndex: "amount",
                },
                {
                  title: "Tipo de pago",
                  name: "type_payment",
                  dataIndex: "type_payment",
                  render: (value) => {
                    const filter_type_payment_for_id = (
                      state.payments?.type_payments || []
                    ).find((tp) => tp.id === value);
                    return filter_type_payment_for_id
                      ? filter_type_payment_for_id.name
                      : value;
                  },
                },
                {
                  title: "Referencia",
                  dataIndex: "reference",
                  name: "reference",
                },
                {
                  title: "Acción",
                  render: (record) => (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={() => {
                        dispatch({
                          type: "delete_payment",
                          payload: record.key,
                        });
                      }}
                    />
                  ),
                },
              ]}
            />
          </Flex>
        )}

        {/* Botones de acción para desktop */}
        {!mobile && (
          <Flex
            gap="small"
            style={{ marginTop: 16, justifyContent: "flex-end" }}
          >
            <Button
              icon={<FaPencil />}
              onClick={() => {
                dispatch({ type: "reset_all" });
                notification.success({
                  message: "Borrador guardado correctamente.",
                });
              }}
            >
              Guardar Borrador
            </Button>
            <Button
              type="primary"
              onClick={handleFinishSale}
              disabled={state.payments.paytotal < totalPricePayValue()}
              icon={<BsCartCheckFill />}
            >
              Finalizar Venta
            </Button>
          </Flex>
        )}
      </Card>

      {/* Modal de Boleta */}
      <ReceiptModal
        visible={receiptModalVisible}
        onClose={handleCloseReceipt}
        saleData={completedSaleData}
      />
    </Flex>
  );
};

export default Payments;
