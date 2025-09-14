import React from "react";
import { Card, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaCheckCircle } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { Flex } from "antd";

const ClientsCard = ({ metrics }) => (
  <Card hoverable title="Clientes" size="small" extra={<UserOutlined />}>
    <Flex gap="small" justify="space-around">
      <Statistic
        prefix={<FaCheckCircle />}
        title="Activos"
        value={metrics.activeClients}
      />
      <Statistic
        prefix={<FcCancel />}
        title="Inactivos"
        value={metrics.inactiveClients}
      />
    </Flex>
  </Card>
);

export default ClientsCard;
