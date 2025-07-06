import React, { useContext, useState } from "react";
import { OrdersContext } from "../../../../containers/Orders";
import {
  Button,
  Flex,
  Divider,
  Card,
  Form,
  App,
  InputNumber,
  Tag,
  DatePicker,
} from "antd";
import { FaPencil, FaFileCircleCheck } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { DollarCircleFilled } from "@ant-design/icons";

import { FaMoneyCheckAlt } from "react-icons/fa";
import dayjs from "dayjs";

import api from "../../../../api/endpoints";

const Payments = ({ mobile }) => {
  const { state, dispatch } = useContext(OrdersContext);
  const [paymentFees, setPaymentFees] = useState(1);
  const [date, setDate] = useState(dayjs());
  const [setQuantity, setSetQuantity] = useState(true);

  const [form] = Form.useForm();
  const total_pay = state.products.selected_products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const driver_amount = state.drivers.selected
    ? state.drivers.selected.amount || 0
    : 0;

  const totalPayWidthFees = () =>
    parseInt((total_pay + driver_amount) / paymentFees).toLocaleString(
      "es-CL",
      {
        style: "currency",
        currency: "CLP",
      }
    );

  const { notification } = App.useApp();

  const onFinish = async (values) => {
    try {
      await api.orders.update(state.order.create_id, {
        is_checked_order: setQuantity,
        is_active: true,
        date: dayjs(values.date).format("YYYY-MM-DD"),
        payment_fees: values.payment_fees,
        day_pay_fees: values.day_pay_fees,
      });
      notification.success({
        message: "Pedido realizado.",
      });
      dispatch({ type: "reset_all" });
    } catch (error) {

    }
  };

  return (
    <Flex vertical gap={"large"} style={{ width: "100%" }}>
      <Card
        title={"Establece las condiciones de pago..."}
        style={{ width: "100%" }}
        extra={<FaMoneyCheckAlt style={{ fontSize: "25px" }} />}
      >
        <Flex gap={"small"}></Flex>
        <Divider type="horizontal" variant="dotted" />
        <Form
          layout="inline"
          form={form}
          initialValues={{
            payment_fees: 1, // Valor predeterminado para cuotas
            day_pay_fees: 1, // Valor predeterminado para días de pago
            date: dayjs(), // Fecha predeterminada: hoy˝
          }}
          onFinish={(values) => {
            onFinish(values);
          }}
        >
          <Flex gap="small" justify="space-between" wrap={mobile}>
            <Form.Item
              label="Cuotas"
              name="payment_fees"
              rules={[
                {
                  required: true,
                  message: " Obligatorio",
                },
              ]}
            >
              <InputNumber
                min={1}
                max={12}
                onChange={(e) => {
                  setPaymentFees(e);
                  form.setFieldValue("payment_fees", e);
                }}
              />
            </Form.Item>
            <Form.Item
              label="Día de pago"
              name="day_pay_fees"
              rules={[
                {
                  required: true,
                  message: " Obligatorio",
                },
              ]}
            >
              <InputNumber min={1} max={31} />
            </Form.Item>
            <Form.Item
              label="Fecha de pedido"
              name="date"
              rules={[
                {
                  required: true,
                  message: " Obligatorio",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD-MM-YYYY"
                defaultValue={dayjs()} // Fecha predeterminada: hoy
                onChange={(date) => {
                  setDate(date);
                }}
              />
            </Form.Item>
            <Form.Item style={{ width: "100%" }}>
              <Flex
                style={{ width: "100%" }}
                gap="small"
                aligngn="end"
                vertical={mobile}
                wrap={mobile}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={state.drivers.selected}
                  icon={<FaFileCircleCheck />}
                  onClick={() => {
                    setSetQuantity(true); // Crear y entregar
                  }}
                >
                  Crear y entregar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!state.clients.selected}
                  icon={<ImProfile />}
                  onClick={() => {
                    setSetQuantity(false); // Crear Pedido
                  }}
                >
                  Crear Pedido
                </Button>
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
              </Flex>
            </Form.Item>
          </Flex>
        </Form>
        <Tag
          icon={<DollarCircleFilled />}
          style={{
            fontSize: "15px",
            padding: "5px",
            marginTop: mobile ? "10px" : "-30px",
          }}
        >
          Cuotas de: {totalPayWidthFees()} pesos
        </Tag>
        <Divider type="horizontal" variant="dotted" />
      </Card>
    </Flex>
  );
};

export default Payments;
