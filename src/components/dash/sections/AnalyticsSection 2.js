import React from "react";
import { Card, Typography, Row, Col, theme, Progress } from "antd";
import {
  LineChartOutlined,
  ArrowUpOutlined,
  DollarOutlined,
  PercentageOutlined,
  BankOutlined,
  ShopOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { formatCLP } from "../utils/dashboardHelpers";

const { Text, Title } = Typography;

const AnalyticsSection = ({ totalSummary, branchesData, isMobile }) => {
  const { token } = theme.useToken();

  // Calcular métricas de negocio
  const totalRevenue =
    (totalSummary.sales_amount || 0) + (totalSummary.orders_amount || 0);
  const totalProfit =
    (totalSummary.sales_profit || 0) + (totalSummary.orders_profit || 0);
  const profitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const averageOrderValue =
    totalSummary.sales_count > 0
      ? totalSummary.sales_amount / totalSummary.sales_count
      : 0;

  // Simular datos de tendencia (en una implementación real vendrían del backend)
  const mockTrendData = [
    { period: "Sem 1", revenue: totalRevenue * 0.7, profit: totalProfit * 0.6 },
    {
      period: "Sem 2",
      revenue: totalRevenue * 0.8,
      profit: totalProfit * 0.75,
    },
    {
      period: "Sem 3",
      revenue: totalRevenue * 0.9,
      profit: totalProfit * 0.85,
    },
    { period: "Actual", revenue: totalRevenue, profit: totalProfit },
  ];

  // Calcular crecimiento
  const revenueGrowth =
    mockTrendData.length > 1
      ? ((mockTrendData[3].revenue - mockTrendData[2].revenue) /
          mockTrendData[2].revenue) *
        100
      : 0;
  const profitGrowth =
    mockTrendData.length > 1
      ? ((mockTrendData[3].profit - mockTrendData[2].profit) /
          mockTrendData[2].profit) *
        100
      : 0;

  return (
    <Card
      style={{
        background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorPrimary}05 100%)`,
        border: `1px solid ${token.colorPrimary}15`,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      }}
      bodyStyle={{ padding: isMobile ? 16 : 24 }}
    >
      {/* Header de la sección */}
      <div style={{ marginBottom: 20 }}>
        <Title
          level={4}
          style={{
            margin: 0,
            color: token.colorText,
            fontSize: "20px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <LineChartOutlined style={{ color: token.colorPrimary }} />
          Análisis de Negocio
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {/* KPIs principales */}
        <Col xs={24} lg={12}>
          <Row gutter={[12, 12]}>
            {/* Ingresos totales */}
            <Col xs={12} sm={12} md={6} lg={12}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                  background: `linear-gradient(135deg, ${token.colorSuccess}08 0%, ${token.colorSuccess}15 100%)`,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <DollarOutlined
                  style={{
                    fontSize: 24,
                    color: token.colorSuccess,
                    marginBottom: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Ingresos Totales
                </Text>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: token.colorSuccess,
                  }}
                >
                  {formatCLP(totalRevenue)}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  {revenueGrowth >= 0 ? (
                    <RiseOutlined
                      style={{ color: token.colorSuccess, fontSize: "12px" }}
                    />
                  ) : (
                    <FallOutlined
                      style={{ color: token.colorError, fontSize: "12px" }}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: "11px",
                      color:
                        revenueGrowth >= 0
                          ? token.colorSuccess
                          : token.colorError,
                    }}
                  >
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </Text>
                </div>
              </Card>
            </Col>

            {/* Margen de ganancia */}
            <Col xs={12} sm={12} md={6} lg={12}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorWarning}15`,
                  background: `linear-gradient(135deg, ${token.colorWarning}08 0%, ${token.colorWarning}15 100%)`,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <PercentageOutlined
                  style={{
                    fontSize: 24,
                    color: token.colorWarning,
                    marginBottom: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Margen de Ganancia
                </Text>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: token.colorWarning,
                  }}
                >
                  {profitMargin.toFixed(1)}%
                </div>
                <Progress
                  percent={Math.min(profitMargin, 100)}
                  showInfo={false}
                  strokeColor={token.colorWarning}
                  trailColor={`${token.colorWarning}15`}
                  strokeWidth={6}
                  style={{ marginTop: 8 }}
                />
              </Card>
            </Col>

            {/* Ticket promedio */}
            <Col xs={12} sm={12} md={6} lg={12}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorInfo}15`,
                  background: `linear-gradient(135deg, ${token.colorInfo}08 0%, ${token.colorInfo}15 100%)`,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <BankOutlined
                  style={{
                    fontSize: 24,
                    color: token.colorInfo,
                    marginBottom: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Ticket Promedio
                </Text>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: token.colorInfo,
                  }}
                >
                  {formatCLP(averageOrderValue)}
                </div>
                <Text
                  style={{ fontSize: "11px", color: token.colorTextTertiary }}
                >
                  Por venta
                </Text>
              </Card>
            </Col>

            {/* Crecimiento de ganancia */}
            <Col xs={12} sm={12} md={6} lg={12}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorPrimary}15`,
                  background: `linear-gradient(135deg, ${token.colorPrimary}08 0%, ${token.colorPrimary}15 100%)`,
                }}
                bodyStyle={{ padding: 16 }}
              >
                <ArrowUpOutlined
                  style={{
                    fontSize: 24,
                    color: token.colorPrimary,
                    marginBottom: 8,
                  }}
                />
                <Text
                  style={{
                    fontSize: "12px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Crecimiento
                </Text>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color:
                      profitGrowth >= 0 ? token.colorSuccess : token.colorError,
                  }}
                >
                  {profitGrowth >= 0 ? "+" : ""}
                  {profitGrowth.toFixed(1)}%
                </div>
                <Text
                  style={{ fontSize: "11px", color: token.colorTextTertiary }}
                >
                  vs período anterior
                </Text>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Gráfico de tendencia simulado */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              border: `1px solid ${token.colorBorder}`,
              background: token.colorBgContainer,
              height: "100%",
            }}
            bodyStyle={{ padding: 20 }}
          >
            <Title
              level={5}
              style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                color: token.colorText,
              }}
            >
              📈 Tendencia de Ingresos y Ganancias
            </Title>

            {/* Simulación visual de gráfico */}
            <div
              style={{
                position: "relative",
                height: "200px",
                background: `${token.colorFillQuaternary}`,
                borderRadius: 8,
                padding: 16,
              }}
            >
              {mockTrendData.map((data, index) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: `${20 + index * 20}%`,
                  }}
                >
                  {/* Barra de ingresos */}
                  <div
                    style={{
                      width: 20,
                      height: Math.max(10, (data.revenue / totalRevenue) * 120),
                      background: `linear-gradient(to top, ${token.colorSuccess}, ${token.colorSuccess}80)`,
                      borderRadius: "4px 4px 0 0",
                      marginBottom: 2,
                    }}
                  />
                  {/* Barra de ganancia */}
                  <div
                    style={{
                      width: 20,
                      height: Math.max(5, (data.profit / totalProfit) * 80),
                      background: `linear-gradient(to top, ${token.colorPrimary}, ${token.colorPrimary}80)`,
                      borderRadius: "4px 4px 0 0",
                      marginBottom: 8,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: "10px",
                      color: token.colorTextSecondary,
                      transform: "rotate(-45deg)",
                      display: "block",
                      width: 40,
                    }}
                  >
                    {data.period}
                  </Text>
                </div>
              ))}

              {/* Leyenda */}
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: token.colorSuccess,
                      borderRadius: 2,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: "11px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    Ingresos
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      background: token.colorPrimary,
                      borderRadius: 2,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: "11px",
                      color: token.colorTextSecondary,
                    }}
                  >
                    Ganancias
                  </Text>
                </div>
              </div>
            </div>

            {/* Métricas del gráfico */}
            <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
              <Col xs={12}>
                <div style={{ textAlign: "center" }}>
                  <Text
                    style={{
                      fontSize: "11px",
                      color: token.colorTextSecondary,
                      display: "block",
                    }}
                  >
                    Mejor período
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: token.colorSuccess,
                    }}
                  >
                    Actual
                  </Text>
                </div>
              </Col>
              <Col xs={12}>
                <div style={{ textAlign: "center" }}>
                  <Text
                    style={{
                      fontSize: "11px",
                      color: token.colorTextSecondary,
                      display: "block",
                    }}
                  >
                    Tendencia
                  </Text>
                  <Text
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: token.colorSuccess,
                    }}
                  >
                    📈 Creciendo
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Métricas adicionales de negocio */}
        <Col xs={24}>
          <Row gutter={[12, 12]}>
            {/* Eficiencia de ventas */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorSuccess}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <ShopOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorSuccess,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Eficiencia Ventas
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorSuccess,
                  }}
                >
                  {totalSummary.sales_count > 0
                    ? (
                        (totalSummary.sales_count /
                          (totalSummary.sales_count +
                            (totalSummary.sales_cancelled_count || 0))) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>

            {/* Eficiencia de pedidos */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorInfo}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorInfo}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <BankOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorInfo,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Eficiencia Pedidos
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorInfo,
                  }}
                >
                  {totalSummary.orders_count > 0
                    ? (
                        (totalSummary.orders_count /
                          (totalSummary.orders_count +
                            (totalSummary.orders_cancelled_count || 0))) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>

            {/* ROI estimado */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorWarning}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorWarning}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <PercentageOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorWarning,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  ROI Estimado
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorWarning,
                  }}
                >
                  {totalRevenue > 0
                    ? (
                        (totalProfit / (totalRevenue - totalProfit)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </Card>
            </Col>

            {/* Productos activos */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorPrimary}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorPrimary}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <ShopOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorPrimary,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Productos Activos
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorPrimary,
                  }}
                >
                  {(totalSummary.sales_best_selling_product ? 1 : 0) +
                    (totalSummary.sales_most_profitable_product ? 1 : 0)}
                  +
                </div>
              </Card>
            </Col>

            {/* Velocidad de venta */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorSuccess}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <ArrowUpOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorSuccess,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Velocidad Venta
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorSuccess,
                  }}
                >
                  {totalSummary.sales_count || 0}/día
                </div>
              </Card>
            </Col>

            {/* Satisfacción estimada */}
            <Col xs={12} sm={8} md={6} lg={4}>
              <Card
                style={{
                  textAlign: "center",
                  border: `1px solid ${token.colorSuccess}15`,
                  background: `linear-gradient(135deg, ${token.colorBgContainer} 0%, ${token.colorSuccess}05 100%)`,
                }}
                bodyStyle={{ padding: 12 }}
              >
                <RiseOutlined
                  style={{
                    fontSize: 20,
                    color: token.colorSuccess,
                    marginBottom: 6,
                  }}
                />
                <Text
                  style={{
                    fontSize: "11px",
                    color: token.colorTextSecondary,
                    display: "block",
                  }}
                >
                  Satisfacción Est.
                </Text>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: token.colorSuccess,
                  }}
                >
                  {totalSummary.sales_count > 0
                    ? Math.min(95, 85 + profitMargin / 2).toFixed(0)
                    : 0}
                  %
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default AnalyticsSection;
