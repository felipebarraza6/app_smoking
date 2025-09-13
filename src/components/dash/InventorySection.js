import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Tag,
  Statistic,
  Progress,
  Empty,
} from "antd";
import {
  InboxOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  DollarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import api from "../../api/endpoints";

const { Title, Text } = Typography;

const InventorySection = ({ inventoryData, summary = {}, loading = false }) => {
  const [error, setError] = useState(null);

  // Memorizar los datos procesados para evitar re-renders innecesarios
  const data = useMemo(() => {
    // Si no hay inventoryData, retornar array vacío inmediatamente
    if (!inventoryData) {
      return [];
    }

    if (inventoryData.data && Array.isArray(inventoryData.data)) {
      return inventoryData.data;
    } else if (Array.isArray(inventoryData)) {
      return inventoryData;
    }
    return [];
  }, [inventoryData]);

  const summaryData = useMemo(() => {
    // Priorizar inventoryData.summary si existe
    if (
      inventoryData &&
      inventoryData.summary &&
      typeof inventoryData.summary === "object" &&
      Object.keys(inventoryData.summary).length > 0
    ) {
      return inventoryData.summary;
    }

    // Fallback a summary prop si existe
    if (
      summary &&
      typeof summary === "object" &&
      Object.keys(summary).length > 0
    ) {
      return summary;
    }

    return {};
  }, [inventoryData, summary]);

  const getStockStatusColor = (item) => {
    const {
      critical_stock_products,
      low_stock_products,
      out_of_stock_products,
    } = item;

    if (critical_stock_products > 0) return "#ff4d4f"; // Rojo crítico
    if (low_stock_products > 0) return "#faad14"; // Amarillo bajo stock
    if (out_of_stock_products > 0) return "#ff7875"; // Rojo claro agotado
    return "#52c41a"; // Verde normal
  };

  const getStockStatusText = (item) => {
    const {
      critical_stock_products,
      low_stock_products,
      out_of_stock_products,
    } = item;

    if (critical_stock_products > 0) return "Crítico";
    if (low_stock_products > 0) return "Bajo Stock";
    if (out_of_stock_products > 0) return "Agotado";
    return "Normal";
  };

  const getStockStatusIcon = (item) => {
    const {
      critical_stock_products,
      low_stock_products,
      out_of_stock_products,
    } = item;

    if (critical_stock_products > 0) return <CloseCircleOutlined />;
    if (low_stock_products > 0) return <ExclamationCircleOutlined />;
    if (out_of_stock_products > 0) return <WarningOutlined />;
    return <CheckCircleOutlined />;
  };

  // Función para formatear números a 2 decimales
  const formatNumber = (value) => {
    if (typeof value !== "number") return value;
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Función para formatear moneda CLP
  const formatCLP = (value) =>
    value?.toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }) || "$0";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Cargando inventario...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error al cargar inventario"
        description={error}
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <Empty
        description="No hay datos de inventario disponibles para la sucursal o período seleccionado."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div>
      {/* Resumen general */}
      {summaryData && Object.keys(summaryData).length > 0 && (
        <Card
          style={{
            marginBottom: 24,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            width: "100%",
            marginRight: "20px",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: "white" }}>Total Productos</span>}
                value={Math.round(
                  summaryData.total_products || 0
                ).toLocaleString("es-CL")}
                valueStyle={{ color: "white" }}
                prefix={<InboxOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: "white" }}>Con Inventario</span>}
                value={Math.round(
                  summaryData.total_products_with_inventory || 0
                ).toLocaleString("es-CL")}
                valueStyle={{ color: "white" }}
                prefix={<ShoppingOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={<span style={{ color: "white" }}>Valor Total</span>}
                value={summaryData.total_value || 0}
                valueStyle={{ color: "white" }}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCLP(value)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title={
                  <span style={{ color: "white" }}>Ganancia Potencial</span>
                }
                value={summaryData.total_profit_potential || 0}
                valueStyle={{ color: "white" }}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCLP(value)}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Cards por sucursal */}
      <Row>
        {data.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={item.branch?.id}>
            <Card
              hoverable
              style={{
                border: `2px solid ${getStockStatusColor(item)}`,
                borderRadius: 12,
              }}
              bodyStyle={{ padding: 16 }}
            >
              {/* Header de la sucursal */}
              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                  {item.branch?.business_name || "Sucursal"}
                </Title>
                <Tag
                  color={getStockStatusColor(item)}
                  icon={getStockStatusIcon(item)}
                  style={{ margin: 0 }}
                >
                  {getStockStatusText(item)}
                </Tag>
              </div>

              {/* Estadísticas principales */}
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Statistic
                    title="Total Productos"
                    value={formatNumber(item.total_products || 0)}
                    valueStyle={{ fontSize: "16px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Con Inventario"
                    value={formatNumber(item.products_with_inventory || 0)}
                    valueStyle={{ fontSize: "16px", color: "#1890ff" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Sin Inventario"
                    value={formatNumber(item.products_without_inventory || 0)}
                    valueStyle={{ fontSize: "16px", color: "#8c8c8c" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Unidades"
                    value={Math.round(item.total_quantity || 0).toLocaleString(
                      "es-CL"
                    )}
                    valueStyle={{ fontSize: "16px", color: "#52c41a" }}
                  />
                </Col>
              </Row>

              {/* Valor y ganancia */}
              <div
                style={{
                  marginTop: 12,
                  padding: 8,
                  background: "#f5f5f5",
                  borderRadius: 6,
                }}
              >
                <Row gutter={[8, 4]}>
                  <Col span={12}>
                    <Text strong style={{ fontSize: "12px", color: "#111" }}>
                      Valor:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "14px", color: "#1890ff" }}>
                      {formatCLP(item.total_value || 0)}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text strong style={{ fontSize: "12px", color: "#111" }}>
                      Ganancia:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "14px", color: "#52c41a" }}>
                      {formatCLP(item.total_profit_potential || 0)}
                    </Text>
                  </Col>
                </Row>
              </div>

              {/* Alertas de stock */}
              {(item.critical_stock_products > 0 ||
                item.low_stock_products > 0 ||
                item.out_of_stock_products > 0) && (
                <div style={{ marginTop: 12 }}>
                  <Text strong style={{ fontSize: "12px", color: "#ff4d4f" }}>
                    Alertas:
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    {item.critical_stock_products > 0 && (
                      <Tag color="red" size="small" style={{ marginBottom: 4 }}>
                        {item.critical_stock_products} crítico
                      </Tag>
                    )}
                    {item.low_stock_products > 0 && (
                      <Tag
                        color="orange"
                        size="small"
                        style={{ marginBottom: 4 }}
                      >
                        {item.low_stock_products} bajo stock
                      </Tag>
                    )}
                    {item.out_of_stock_products > 0 && (
                      <Tag color="red" size="small" style={{ marginBottom: 4 }}>
                        {item.out_of_stock_products} agotado
                      </Tag>
                    )}
                  </div>
                </div>
              )}

              {/* Barra de progreso del inventario */}
              {item.total_products > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: "12px" }}>
                    Estado del Inventario:
                  </Text>
                  <Progress
                    percent={Math.round(
                      ((item.products_with_inventory || 0) /
                        item.total_products) *
                        100
                    )}
                    size="small"
                    strokeColor={getStockStatusColor(item)}
                    showInfo={false}
                  />
                  <Text style={{ fontSize: "10px", color: "#8c8c8c" }}>
                    {item.products_with_inventory || 0} de {item.total_products}{" "}
                    productos con inventario
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensaje si no hay sucursales */}
      {data.length === 0 && (
        <Empty
          description="No hay sucursales con inventario disponible"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </div>
  );
};

export default InventorySection;
