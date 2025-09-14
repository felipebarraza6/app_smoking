import React from "react";
import { Card, Flex, Tag, Button, Space, Divider } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const OrderCreateMobileCard = ({ product, onEdit, onDelete, planPago }) => {
  return (
    <Card
      hoverable
      size="small"
      style={{
        marginBottom: 12,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      bodyStyle={{ padding: 12 }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={8}>
          <ShoppingCartOutlined style={{ fontSize: 22, color: "#8B5CF6" }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>
            {product?.name || product?.product?.name || "Producto"}
          </span>
        </Flex>
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={onEdit} />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={onDelete}
          />
        </Space>
      </Flex>
      <Divider style={{ margin: "8px 0" }} />
      <Flex align="center" gap={16} wrap>
        <Tag color="blue">Cantidad: {product?.quantity}</Tag>
        <Tag color="purple">
          Precio: ${product?.price || product?.product?.price || 0}
        </Tag>
        {product?.total && <Tag color="green">Total: ${product.total}</Tag>}
      </Flex>
      {planPago && (
        <Flex align="center" gap={8} style={{ marginTop: 8 }}>
          <CreditCardOutlined style={{ color: "#10B981" }} />
          <span style={{ fontWeight: 500, fontSize: 14 }}>
            Plan de pago: {planPago}
          </span>
        </Flex>
      )}
    </Card>
  );
};

export default OrderCreateMobileCard;
