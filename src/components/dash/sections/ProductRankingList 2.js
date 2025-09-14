import React from "react";
import { List, Typography, Tooltip } from "antd";
import { formatCurrency } from "../../../utils/formatCurrency";
import { TrophyOutlined } from "@ant-design/icons";

const { Text, Link, Title } = Typography;

const ProductRankingList = ({ title, data, valueFormatter }) => {
  // Si data es vacío o nulo, mostrar mensaje claro
  const items = Array.isArray(data) ? data : [];
  return (
    <div>
      <Title level={5} style={{ marginBottom: 10 }}>
        {title}
      </Title>
      <List
        dataSource={items}
        renderItem={(item, index) => (
          <List.Item style={{ padding: "8px 0" }}>
            <List.Item.Meta
              avatar={
                <Text style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {index + 1}.
                </Text>
              }
              title={
                <Tooltip
                  title={item.product__name || item.product__name || item.name}
                >
                  <Text style={{ fontSize: 14 }} ellipsis>
                    {item.product__name || item.name}
                  </Text>
                </Tooltip>
              }
            />
            <Text strong style={{ fontSize: 14 }}>
              {valueFormatter(item)}
            </Text>
          </List.Item>
        )}
        locale={{ emptyText: "Sin datos" }}
      />
    </div>
  );
};

export const formatters = {
  quantity: (item) => `${Math.round(item.quantity_sold)} uds.`,
  profit: (item) => formatCurrency(item.total_profit),
};

export default ProductRankingList;
