import React from "react";
import { Card, Statistic } from "antd";
import { FaTruckArrowRight } from "react-icons/fa6";
import { FaCheckCircle, FaMoneyCheckAlt } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { Flex } from "antd";

const DeliveriesCard = ({ metrics }) => (
  <Card hoverable title="Repartos" size="small" extra={<FaTruckArrowRight />}>
    <Flex gap="small" justify="space-around">
      <Statistic
        prefix={<FaCheckCircle />}
        title="Repartidores"
        value={metrics.activeClients}
      />
      <Statistic
        prefix={<FaMoneyCheckAlt />}
        title="Por realizar"
        value={metrics.activeClients}
      />
      <Statistic
        prefix={<FcCancel />}
        title="Realizados"
        value={metrics.inactiveClients}
      />
    </Flex>
  </Card>
);

export default DeliveriesCard;
