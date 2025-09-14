import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Table,
  Flex,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { TbPigMoney } from "react-icons/tb";
import { TbCreditCardPay } from "react-icons/tb";

import api from "../../../api/endpoints";
import { HiCheckBadge } from "react-icons/hi2";

import { DeleteOutlined } from "@ant-design/icons";

const formatCLP = (value) => {
  return (
    value?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) || "-"
  );
};

const RenderColumn = ({ record, setUpdate, update }) => {
  // Current date for payment
  const today = new Date().toLocaleDateString("es-CL");
  const [types, setTypes] = useState([]);
  useEffect(() => {
    api.payments.type_payments
      .list()
      .then((data) => {
        // backend may return { results: [...] } or direct array
        if (Array.isArray(data)) {
          setTypes(data);
        } else if (Array.isArray(data.results)) {
          setTypes(data.results);
        } else {
          setTypes([]);
        }
      })
      .catch(() => setTypes([]));
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedPayment, setSelectedPayment] = useState(null);

  const productColumns = [
    { title: "Nombre", dataIndex: "name", key: "name", align: "center" },
    { title: "Cantidad", dataIndex: "quantity", key: "quantity", align: "end" },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (value) => formatCLP(value),
      align: "end",
    },

    {
      title: "Costo",
      dataIndex: "price_internal",
      key: "price_internal",
      align: "end",
      render: (value) => formatCLP(value),
    },
    {
      title: "Total",
      key: "total",
      align: "end",
      render: (text, record) => formatCLP(record.price * record.quantity),
    },
  ];

  const titleColumn = ({ record }) => (
    <Flex gap="small" justify="center">
      <i style={{ fontWeight: "bold", fontSize: "11px" }}>#{record.id}</i>
    </Flex>
  );

  const productData = Array.isArray(record.registers)
    ? record.registers
        .filter((r) => r.product)
        .map((r, idx) => ({
          key: idx,
          name: r.name || "-",
          quantity: Math.abs(r.quantity || 0),
          price: r.price || 0,
          price_internal: r.price_internal || 0,
        }))
    : [];

  const payments = Array.isArray(record.payments) ? record.payments : [];
  const paymentCount = payments.length;
  const sumPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const costTotal = record.total_cost || 0;
  const orderTotal = (record.total_amount || 0) + (record.driver?.amount || 0);
  const totalDue = orderTotal;
  // Round installment value to integer
  const feeValue =
    record.payment_fees > 0
      ? Math.round(totalDue / record.payment_fees)
      : totalDue;

  const openPaymentModal = () => {
    form.setFieldsValue({ amount: feeValue });
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Register payment via API
      await api.payments.create({
        order: record.id,
        amount: values.amount,
        reference: values.reference,
        type_payment: values.type,
        date: new Date().toISOString(),
      });
      // If total paid now covers full cost, mark order as paid
      const totalDue = record.total_amount + (record.driver?.amount || 0);
      const newSum = sumPaid + values.amount;
      if (newSum >= totalDue) {
        await api.orders.update(record.id, {
          is_pay: true,
          is_checked_order: true,
        });
      }
      // Trigger parent list refresh
      setUpdate(update + 1);
      form.resetFields();
      setIsModalVisible(false);
    } catch (errorInfo) {
      // Validation failed, do nothing
      return;
    }
  };
  // Delete payment handler
  const handleDeletePayment = async (id) => {
    // find payment to remove its amount
    const deleted = payments.find((p) => p.id === id);
    await api.payments.delete(id);
    // if remaining paid sum is less than due, unset is_pay
    const remainingSum = sumPaid - (deleted?.amount || 0);
    if (remainingSum < totalDue) {
      await api.orders.update(record.id, { is_pay: false });
    }
    // trigger parent refresh
    setUpdate(update + 1);
  };

  return (
    <Flex gap="small" align="center" style={{ width: "100%" }}>
      <Table
        columns={productColumns}
        title={() => titleColumn({ record: record })}
        dataSource={productData}
        size="small"
        style={{ width: "100%" }}
        bordered
        pagination={false}
      />

      <Descriptions bordered column={2} size="small" style={{ width: "100%" }}>
        <Descriptions.Item label="Total">
          {formatCLP(orderTotal)}
        </Descriptions.Item>
        <Descriptions.Item label="Costo">
          {formatCLP(costTotal)}
        </Descriptions.Item>

        <Descriptions.Item label="Reparto" span={3}>
          {record.is_delivery ? (
            <span style={{ color: "green" }}>
              {record.driver?.vehicle_plate || "-"}
              {record.driver?.name ? ` (${record.driver.name})` : ""}
              {record.driver?.amount
                ? ` - ${formatCLP(record.driver.amount)}`
                : ""}
            </span>
          ) : (
            <span style={{ color: "red" }}>No</span>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Pagos">
          <Flex gap="small" align="center" justify="space-between" wrap>
            <Flex wrap gap="small">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <Button
                    size="small"
                    type="primary"
                    key={p.id}
                    closable
                    onClose={() => handleDeletePayment(p.id)}
                    onClick={() => {
                      setSelectedPayment(p);
                      setDetailModalVisible(true);
                    }}
                    icon={<TbCreditCardPay />}
                    color="blue"
                    style={{ cursor: "pointer" }}
                  >
                    {formatCLP(p.amount)}
                  </Button>
                ))
              ) : (
                <span>No hay pagos</span>
              )}
            </Flex>
          </Flex>
        </Descriptions.Item>
      </Descriptions>
      {/* Payment Modal */}
      <Modal
        open={isModalVisible}
        title={`Registrar pago / ${today}`}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Guardar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tipo de pago"
            name="type"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Selecciona tipo de pago"
              options={types.map((t) => ({ label: t.name, value: t.id }))}
            />
          </Form.Item>
          <Form.Item
            label="Referencia #"
            name="reference"
            // reference is optional
            rules={[]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Código o referencia"
            />
          </Form.Item>
          <Form.Item
            label="Monto ($)"
            name="amount"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              max={feeValue + 10}
              defaultValue={feeValue}
              formatter={(value) => formatCLP(value)}
              parser={(value) => value.replace(/[CLP$.\s,]/g, "")}
            />
          </Form.Item>
        </Form>
      </Modal>
      {/* Payment Detail Modal */}
      <Modal
        open={detailModalVisible}
        title="Detalle de pago"
        footer={null}
        onCancel={() => setDetailModalVisible(false)}
      >
        {selectedPayment && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">
              #{selectedPayment.id}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">
              {new Date(selectedPayment.date).toLocaleString("es-CL")}
            </Descriptions.Item>
            <Descriptions.Item label="Monto">
              {formatCLP(selectedPayment.amount)}
            </Descriptions.Item>
            <Descriptions.Item label="Referencia">
              {selectedPayment.reference || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de pago">
              {selectedPayment.type_payment.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {selectedPayment.is_active ? "Activo" : "Cancelado"}
            </Descriptions.Item>
          </Descriptions>
        )}
        <Popconfirm
          title="¿Estás seguro de eliminar este pago? Esta acción no se podrá recuperar."
          onConfirm={() => {
            handleDeletePayment(selectedPayment.id);
            setDetailModalVisible(false);
          }}
          okText="Sí"
          cancelText="No"
        >
          <Button
            danger
            style={{ marginTop: "10px" }}
            icon={<DeleteOutlined />}
          >
            Eliminar Pago
          </Button>
        </Popconfirm>
      </Modal>
    </Flex>
  );
};
export default RenderColumn;
