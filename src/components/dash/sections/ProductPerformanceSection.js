import React from "react";
import { Card, Row, Col, Typography } from "antd";
import ProductRankingList, { formatters } from "./ProductRankingList";
import { BarChartOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProductPerformanceSection = ({ data }) => {
  return (
    <Card>
      <Title
        level={4}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        <BarChartOutlined /> Rendimiento de Productos (General)
      </Title>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={12} lg={6}>
          <ProductRankingList
            title="🏆 Más Vendidos"
            data={
              Array.isArray(data?.best_selling_products)
                ? data.best_selling_products
                : []
            }
            valueFormatter={formatters.quantity}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProductRankingList
            title="💰 Más Rentables"
            data={
              Array.isArray(data?.most_profitable_products)
                ? data.most_profitable_products
                : []
            }
            valueFormatter={formatters.profit}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProductRankingList
            title="📉 Menos Vendidos"
            data={
              Array.isArray(data?.least_selling_products)
                ? data.least_selling_products
                : []
            }
            valueFormatter={formatters.quantity}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ProductRankingList
            title="💸 Menos Rentables"
            data={
              Array.isArray(data?.least_profitable_products)
                ? data.least_profitable_products
                : []
            }
            valueFormatter={formatters.profit}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ProductPerformanceSection;
