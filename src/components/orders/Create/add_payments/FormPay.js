import React, { useEffect, useContext } from "react";
import {
  Flex,
  Form,
  Card,
  Select,
  Button,
  Typography,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  DollarOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../../../../api/endpoints";
import { OrdersContext } from "../../../../containers/Orders";

const { Text } = Typography;

const FormPay = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(OrdersContext);

  const totalPricePayValue = () => {
    let total = 0;
    state.products.selected_products.forEach((product) => {
      total += product.price * product.quantity;
    });
    if (state.drivers.selected) {
      total += state.drivers.selected.charge_amount;
    }
    return total;
  };

  const addPaymentForm = (values) => {
    values = {
      type: (state.payments?.list || []).length + 1,
      ...values,
      order: state.order?.create_id,
      date: new Date().toISOString(),
    };
    dispatch({
      type: "add_payment",
      payload: values,
    });
    form.resetFields();
  };

  const fetchTypePayments = async () => {
    const response = await api.payments.type_payments
      .list()
      .then((response) => {
        dispatch({
          type: "add_type_payments",
          payload: response.results || [],
        });
        return response.results || [];
      });
  };

  useEffect(() => {
    fetchTypePayments();
  }, []);

  return (
    <Form form={form} onFinish={addPaymentForm} layout="inline">
      <Flex vertical gap={"small"}>
        <Flex gap="small">
          <Form.Item
            name={"amount"}
            rules={[
              { required: true, message: "Ingresa el monto" },
              { type: "number", message: "Debe ser un número válido" },
              {
                type: "number",
                min: 0,
                message: "El monto debe ser mayor a 0",
              },
            ]}
          >
            <InputNumber
              placeholder="Monto"
              addonBefore={
                <Text style={{ color: "white" }} type="secondary">
                  <DollarOutlined />
                </Text>
              }
              defaultValue={0}
              min={0}
              style={{ textAlign: "right", width: "120px" }}
            />
          </Form.Item>
          <Form.Item
            name="type_payment"
            rules={[{ required: true, message: "Selecciona una opción" }]}
          >
            <Select
              placeholder="Tipo de pago"
              style={{ width: "150px" }}
              options={(state.payments?.type_payments || []).map(
                (type_payment) => ({
                  value: type_payment.id,
                  label: type_payment.name,
                })
              )}
              allowClear
            />
          </Form.Item>
          <Button
            htmlType="submit"
            disabled={state.payments.paytotal >= totalPricePayValue()}
            type="primary"
            shape="round"
            style={{ color: "white" }}
            icon={<PlusOutlined />}
            children={"Agregar"}
          />
          <Popconfirm
            title="¿Estás seguro de reiniciar?"
            description="Se eliminarán todos los pagos agregados."
            onConfirm={() => {
              form.resetFields();
              dispatch({ type: "clear_payments" });
            }}
          >
            <Button
              shape="round"
              disabled={
                !Array.isArray(state.payments?.list) ||
                (state.payments?.list || []).length === 0
              }
              icon={<ReloadOutlined />}
              type="primary"
            >
              Reiniciar
            </Button>
          </Popconfirm>
        </Flex>
      </Flex>
    </Form>
  );
};

export default FormPay;
