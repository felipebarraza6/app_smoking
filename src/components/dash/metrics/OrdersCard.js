import React from "react";
import { Card, Statistic } from "antd";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { Flex } from "antd";

const OrdersCard = ({ metrics }) => (
  <Card hoverable title="Pedidos" size="small" extra={<FaClipboardList />}>
    <Flex gap="small" justify="space-around">
      <Statistic
        prefix={<FaCheckCircle />}
        title="Activos"
        value={metrics.activeOrders}
      />
      <Statistic
        prefix={<FcCancel />}
        title="Anulados"
        value={metrics.canceledOrders}
      />
    </Flex>
  </Card>
);

export default OrdersCard;
