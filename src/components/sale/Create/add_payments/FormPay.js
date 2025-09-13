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
import { SaleContext } from "../../../../containers/Sale";

const { Text } = Typography;

const FormPay = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(SaleContext);

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
    // Estructura para sistema unificado
    const paymentData = {
      // Campos para sistema unificado
      payment_method_id: values.type_payment, // ID del PaymentMethod
      order_id: state.order?.create_id,
      amount: values.amount.toString(), // Convertir a string para decimal
      reference: values.reference || "",
      notes: values.notes || "",
      branch_id: state.branchs.selected?.id,
      
      // Campos legacy para compatibilidad temporal
      type: (state.payments?.list || []).length + 1,
      type_payment: values.type_payment, // Para compatibilidad legacy
      order: state.order?.create_id,
      date: new Date().toISOString(),
      ...values
    };
    
    dispatch({
      type: "add_payment",
      payload: paymentData,
    });
    form.resetFields();
  };

  const fetchTypePayments = async () => {
    try {
      // Usar sistema unificado de payment methods
      const response = await api.finance.payment_methods.list_active({
        branch: state.branchs.selected?.id
      });
      
      dispatch({
        type: "add_type_payments",
        payload: response.results || response || [],
      });
      
      return response.results || response || [];
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      
      // Fallback a sistema legacy si falla
      try {
        const legacyResponse = await api.finance.legacy_type_payments.list({
          branch: state.branchs.selected?.id
        });
        
        dispatch({
          type: "add_type_payments", 
          payload: legacyResponse.results || [],
        });
        
        return legacyResponse.results || [];
      } catch (legacyError) {
        console.error("Error fetching legacy payment methods:", legacyError);
        return [];
      }
    }
  };

  useEffect(() => {
    fetchTypePayments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form
      form={form}
      onFinish={addPaymentForm}
      layout="vertical"
      style={{ marginTop: "20px" }}
    >
      <Flex wrap="wrap" gap="small">
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
    </Form>
  );
};

export default FormPay;
