import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tabs,
  Typography,
  Space,
  Divider,
  Button,
  message,
  Statistic,
} from "antd";
import {
  ExperimentOutlined,
  CalculatorOutlined,
  BookOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import NutritionalIngredients from "./NutritionalIngredients";
import SubRecipes from "./SubRecipes";
import ComplexRecipes from "./ComplexRecipes";
import NutritionCalculator from "./NutritionCalculator";

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const RecipeNutritionDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Componente Dashboard
  const DashboardContent = () => {
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Insumos"
                value={0}
                prefix={<ExperimentOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Sub-recetas"
                value={0}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Recetas Complejas"
                value={0}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Con Etiqueta Nutricional"
                value={0}
                prefix={<CalculatorOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Resumen del Sistema">
          <Paragraph>
            Este sistema permite gestionar recetas con cálculo nutricional automático
            según la normativa MINSAL de Chile.
          </Paragraph>
          <Divider />
          <Paragraph>
            <strong>Flujo de trabajo recomendado:</strong>
          </Paragraph>
          <ol>
            <li>
              Registre <strong>Insumos Nutricionales</strong> con información
              nutricional por 100g
            </li>
            <li>
              Cree <strong>Sub-recetas</strong> usando los insumos como componentes
              base
            </li>
            <li>
              Combine insumos y sub-recetas en <strong>Recetas Complejas</strong>{" "}
              para productos finales
            </li>
            <li>
              Use la <strong>Calculadora</strong> para cálculos rápidos y pruebas
            </li>
          </ol>
        </Card>
      </div>
    );
  };

  const tabItems = [
    {
      key: "dashboard",
      label: (
        <Space>
          <DashboardOutlined />
          Dashboard
        </Space>
      ),
      content: <DashboardContent />,
    },
    {
      key: "ingredients",
      label: (
        <Space>
          <ExperimentOutlined />
          Insumos Nutricionales
        </Space>
      ),
      content: <NutritionalIngredients />,
    },
    {
      key: "sub-recipes",
      label: (
        <Space>
          <BookOutlined />
          Sub-recetas
        </Space>
      ),
      content: <SubRecipes />,
    },
    {
      key: "complex-recipes",
      label: (
        <Space>
          <BarChartOutlined />
          Recetas Complejas
        </Space>
      ),
      content: <ComplexRecipes />,
    },
    {
      key: "calculator",
      label: (
        <Space>
          <CalculatorOutlined />
          Calculadora Nutricional
        </Space>
      ),
      content: <NutritionCalculator />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header con información del sistema */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col span={18}>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0 }}>
                <Space>
                  <ExperimentOutlined />
                  Sistema de Etiquetado Nutricional
                </Space>
              </Title>
              <Paragraph style={{ margin: 0, color: "#666" }}>
                Gestión completa de recetas con cálculo nutricional automático
                según normativa MINSAL Chile
              </Paragraph>
            </Space>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            <Space>
              <InfoCircleOutlined style={{ fontSize: 16, color: "#1890ff" }} />
              <Typography.Text type="secondary">
                Versión 1.0 - Compatible MINSAL
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Información sobre el flujo de trabajo */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>
          <InfoCircleOutlined style={{ color: "#1890ff" }} /> Flujo de Trabajo
          del Sistema
        </Title>

        <Row gutter={16}>
          <Col span={6}>
            <Card
              size="small"
              style={{
                textAlign: "center",
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
              }}
            >
              <ExperimentOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              <Paragraph strong style={{ margin: "8px 0 4px 0" }}>
                1. Insumos Nutricionales
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                Registre ingredientes base con información nutricional por 100g
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              size="small"
              style={{
                textAlign: "center",
                backgroundColor: "#fff7e6",
                border: "1px solid #ffd591",
              }}
            >
              <BookOutlined style={{ fontSize: 24, color: "#fa8c16" }} />
              <Paragraph strong style={{ margin: "8px 0 4px 0" }}>
                2. Sub-recetas
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                Cree preparaciones base que servirán como componentes
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              size="small"
              style={{
                textAlign: "center",
                backgroundColor: "#f0f5ff",
                border: "1px solid #91d5ff",
              }}
            >
              <BarChartOutlined style={{ fontSize: 24, color: "#1890ff" }} />
              <Paragraph strong style={{ margin: "8px 0 4px 0" }}>
                3. Recetas Complejas
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                Combine insumos y sub-recetas para productos finales
              </Paragraph>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              size="small"
              style={{
                textAlign: "center",
                backgroundColor: "#f9f0ff",
                border: "1px solid #d3adf7",
              }}
            >
              <CalculatorOutlined style={{ fontSize: 24, color: "#722ed1" }} />
              <Paragraph strong style={{ margin: "8px 0 4px 0" }}>
                4. Calculadora
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                Herramienta rápida para cálculos puntuales
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row>
          <Col span={24}>
            <Card
              size="small"
              style={{
                backgroundColor: "#fff2e8",
                border: "1px solid #ffbb96",
              }}
            >
              <Row align="middle">
                <Col span={2} style={{ textAlign: "center" }}>
                  <InfoCircleOutlined
                    style={{ fontSize: 20, color: "#fa541c" }}
                  />
                </Col>
                <Col span={22}>
                  <Paragraph
                    strong
                    style={{ margin: "0 0 4px 0", color: "#fa541c" }}
                  >
                    Ejemplo: Helado de Leche Blanca (Claudia Sepúlveda)
                  </Paragraph>
                  <Paragraph style={{ margin: 0, fontSize: 13 }}>
                    <strong>Ingredientes:</strong> 5000ml leche + 500ml crema +
                    1000g azúcar + 200g dextrosa =<strong> 6700g total</strong>{" "}
                    → Cálculo automático nutricional por 100g según MINSAL
                  </Paragraph>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Pestañas del sistema */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
        >
          {tabItems.map((tab) => (
            <TabPane tab={tab.label} key={tab.key}>
              <div style={{ padding: "16px 0" }}>{tab.content}</div>
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default RecipeNutritionDashboard;
