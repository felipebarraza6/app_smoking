import React from "react";
import { Card, Statistic, Flex } from "antd";
import { MdOutlineMoney } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

const SalesCard = ({ metrics }) => (
  <Card hoverable title="Ventas" size="small" extra={<MdOutlineMoney />}>
    <Flex gap="small" justify="space-around">
      <Statistic
        prefix={<FaCheckCircle />}
        title="Total Ventas"
        value={metrics.totalSales}
      />
      <Statistic
        prefix={<FcCancel />}
        title="Costo Total"
        value={metrics.totalCost}
      />
    </Flex>
  </Card>
);

export default SalesCard;
