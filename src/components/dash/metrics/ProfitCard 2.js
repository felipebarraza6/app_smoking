import React from "react";
import { Card, Statistic } from "antd";

const ProfitCard = ({ metrics }) => (
  <Card hoverable title="Ganancia" size="small">
    <Statistic value={metrics.profit} precision={0} />
  </Card>
);

export default ProfitCard;
