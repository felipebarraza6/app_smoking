import React from "react";
import { Card, Statistic } from "antd";
import { FaRegStar } from "react-icons/fa";
import { Flex } from "antd";

const BestProductCard = ({ metrics }) => (
  <Card
    hoverable
    title="Producto Más Vendido"
    size="small"
    extra={<FaRegStar />}
  >
    <Flex gap="small" justify="space-around">
      <Statistic title="Nombre" value={metrics.bestProduct} />
    </Flex>
  </Card>
);

export default BestProductCard;
