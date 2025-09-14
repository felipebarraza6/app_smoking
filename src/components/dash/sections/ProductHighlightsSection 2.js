import React from "react";
import { Card, Typography, Row, Col, theme, Tag, Space } from "antd";
import {
  TrophyOutlined,
  CrownOutlined,
  MinusCircleOutlined,
  FallOutlined,
  ShoppingOutlined,
  DollarOutlined,
  BoxPlotOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import ProductHighlightSkeleton from "../components/ProductHighlightSkeleton";
import { formatCLP } from "../utils/dashboardHelpers";

const { Text, Title } = Typography;

const HighlightCard = ({ highlight, isLoading, isMobile }) => {
  const { token } = theme.useToken();

  if (isLoading || !highlight.data) {
    return (
      <ProductHighlightSkeleton
        title={highlight.title}
        icon={highlight.icon}
        type={highlight.type}
      />
    );
  }

  const { data } = highlight;

  return (
    <Card
      hoverable
      style={{
        height: "100%",
        border: `2px solid ${highlight.color}`,
        borderRadius: 16,
        background: `linear-gradient(145deg, ${token.colorBgContainer}, ${highlight.color}1A)`,
        boxShadow: `0 8px 16px ${highlight.color}15`,
      }}
      bodyStyle={{ padding: isMobile ? 12 : 16 }}
    >
      <Row align="middle" gutter={isMobile ? 8 : 16}>
        {/* Columna Izquierda: Ícono y Título */}
        <Col
          xs={24}
          sm={8}
          style={{ textAlign: "center", marginBottom: isMobile ? 12 : 0 }}
        >
          <div
            style={{
              background: `${highlight.color}20`,
              borderRadius: "50%",
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px auto",
            }}
          >
            {React.cloneElement(highlight.icon, {
              style: { fontSize: 28, color: highlight.color },
            })}
          </div>
          <Title
            level={5}
            style={{
              margin: 0,
              color: token.colorText,
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
          >
            {highlight.title}
          </Title>
        </Col>

        {/* Columna Derecha: Detalles del Producto */}
        <Col xs={24} sm={16}>
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Title
              level={5}
              style={{
                margin: "0 0 4px 0",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "1rem",
              }}
            >
              <BoxPlotOutlined /> {data.name}
            </Title>

            {data.category && (
              <Tag
                color="blue"
                style={{ fontSize: "0.7rem", padding: "0 6px" }}
              >
                {data.category}
              </Tag>
            )}

            <Space size={4}>
              <ShoppingOutlined style={{ color: token.colorPrimary }} />
              <Text style={{ fontSize: "0.8rem" }}>
                {data.quantity_sold} unidades
              </Text>
            </Space>

            <Space size={4}>
              <DollarOutlined style={{ color: token.colorSuccess }} />
              <Text style={{ fontSize: "0.8rem" }}>
                En {data.orders_count} {highlight.type}
              </Text>
            </Space>

            <Space size={4}>
              <Text
                style={{
                  fontSize: "0.8rem",
                  color:
                    data.stock_status === "out_of_stock"
                      ? token.colorError
                      : token.colorTextSecondary,
                }}
              >
                Stock: {data.stock}{" "}
                {data.stock_status === "out_of_stock" && "🚫"}
              </Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

const ProductHighlightsSection = ({
  title,
  bestSelling,
  mostProfitable,
  leastSelling,
  leastProfitable,
  type = "transacciones",
  isMobile,
}) => {
  const { token } = theme.useToken();
  const isLoading =
    !bestSelling && !mostProfitable && !leastSelling && !leastProfitable;

  const highlights = [
    {
      title: `Más ${type}`,
      icon: <TrophyOutlined />,
      color: token.colorPrimary,
      data: bestSelling,
      type: type,
    },
    {
      title: "Más Rentable",
      icon: <CrownOutlined />,
      color: token.colorSuccess,
      data: mostProfitable,
      type: type,
    },
    {
      title: `Menos ${type}`,
      icon: <MinusCircleOutlined />,
      color: token.colorWarning,
      data: leastSelling,
      type: type,
    },
    {
      title: "Menos Rentable",
      icon: <FallOutlined />,
      color: token.colorError,
      data: leastProfitable,
      type: type,
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>

      <div>
        <Row gutter={[16, 16]}>
          {highlights.map((highlight) => (
            <Col xs={24} sm={12} lg={6} key={highlight.title}>
              <HighlightCard
                highlight={highlight}
                isLoading={isLoading}
                isMobile={isMobile}
              />
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default ProductHighlightsSection;
