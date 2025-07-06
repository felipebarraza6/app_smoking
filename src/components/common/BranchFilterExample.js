import React, { useState } from "react";
import { Card, Row, Col, Typography, Space, Divider, Tag, Alert } from "antd";
import {
  ShopOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CrownOutlined,
  StarOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BranchSelector from "./BranchSelector";
import useBranches from "../../hooks/useBranches";

const { Title, Text, Paragraph } = Typography;

/**
 * Componente de ejemplo que demuestra el uso del sistema DRY de sucursales
 * en diferentes contextos como ventas, pedidos, etc.
 */
const BranchFilterExample = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedBranchForSales, setSelectedBranchForSales] = useState(null);
  const [selectedBranchForOrders, setSelectedBranchForOrders] = useState(null);

  // Hook para obtener estadísticas de sucursales
  const { getBranchStats, getBranchesByRole } = useBranches({
    includeAllOption: true,
    showRoles: true,
  });

  const stats = getBranchStats();
  const ownerBranches = getBranchesByRole("OWNER");
  const adminBranches = getBranchesByRole("ADMIN");
  const managerBranches = getBranchesByRole("MANAGER");

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <ShopOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        Sistema DRY de Sucursales
      </Title>

      <Paragraph>
        Este es un ejemplo de cómo usar el nuevo sistema unificado de selección
        de sucursales que implementa el patrón DRY (Don't Repeat Yourself) en
        toda la aplicación.
      </Paragraph>

      <Alert
        message="Características del Sistema"
        description="✅ Selección moderna con animaciones • ✅ Badges de roles • ✅ Búsqueda inteligente • ✅ Caché automático • ✅ Sincronización con contexto global • ✅ Filtros por rol • ✅ Estadísticas en tiempo real"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        {/* Estadísticas Generales */}
        <Col span={24}>
          <Card title="📊 Estadísticas de Sucursales" size="small">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
                    {stats.total}
                  </Title>
                  <Text type="secondary">Total Sucursales</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#faad14", margin: 0 }}>
                    {ownerBranches.length}
                  </Title>
                  <Text type="secondary">
                    <CrownOutlined /> Propietarios
                  </Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#1890ff", margin: 0 }}>
                    {adminBranches.length}
                  </Title>
                  <Text type="secondary">
                    <StarOutlined /> Administradores
                  </Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Title level={3} style={{ color: "#52c41a", margin: 0 }}>
                    {managerBranches.length}
                  </Title>
                  <Text type="secondary">
                    <TeamOutlined /> Gerentes
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ejemplo: Selección Simple */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ShopOutlined style={{ color: "#1890ff" }} />
                Selección Simple
              </Space>
            }
            size="small"
          >
            <Paragraph type="secondary">
              Selección de una sola sucursal con opción "Todas"
            </Paragraph>
            <BranchSelector
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Selecciona una sucursal"
              style={{ width: "100%" }}
            />
            {selectedBranch && (
              <div style={{ marginTop: 12 }}>
                <Tag color="blue">Seleccionado: {selectedBranch}</Tag>
              </div>
            )}
          </Card>
        </Col>

        {/* Ejemplo: Selección Múltiple */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ShopOutlined style={{ color: "#52c41a" }} />
                Selección Múltiple
              </Space>
            }
            size="small"
          >
            <Paragraph type="secondary">
              Selección de múltiples sucursales con tags personalizados
            </Paragraph>
            <BranchSelector
              value={selectedBranches}
              onChange={setSelectedBranches}
              placeholder="Selecciona sucursales"
              mode="multiple"
              style={{ width: "100%" }}
              showCount={true}
            />
            {selectedBranches.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <Tag color="green">
                  Seleccionadas: {selectedBranches.length} sucursal
                  {selectedBranches.length !== 1 ? "es" : ""}
                </Tag>
              </div>
            )}
          </Card>
        </Col>

        <Divider />

        {/* Ejemplo: Contexto de Ventas */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined style={{ color: "#fa8c16" }} />
                Contexto: Ventas
              </Space>
            }
            size="small"
          >
            <Paragraph type="secondary">
              Filtro de sucursales para el módulo de ventas
            </Paragraph>
            <BranchSelector
              value={selectedBranchForSales}
              onChange={setSelectedBranchForSales}
              placeholder="Filtrar ventas por sucursal"
              style={{ width: "100%" }}
              showRole={true}
              hookOptions={{
                filterByRole: null, // Mostrar todas las sucursales
                includeAllOption: true,
              }}
            />
            {selectedBranchForSales && (
              <div style={{ marginTop: 12 }}>
                <Tag color="orange">
                  <ShoppingCartOutlined /> Ventas de: {selectedBranchForSales}
                </Tag>
              </div>
            )}
          </Card>
        </Col>

        {/* Ejemplo: Contexto de Pedidos */}
        <Col span={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: "#722ed1" }} />
                Contexto: Pedidos
              </Space>
            }
            size="small"
          >
            <Paragraph type="secondary">
              Filtro de sucursales para el módulo de pedidos
            </Paragraph>
            <BranchSelector
              value={selectedBranchForOrders}
              onChange={setSelectedBranchForOrders}
              placeholder="Filtrar pedidos por sucursal"
              style={{ width: "100%" }}
              showRole={true}
              hookOptions={{
                filterByRole: ["OWNER", "ADMIN", "MANAGER"], // Solo roles de gestión
                includeAllOption: true,
              }}
            />
            {selectedBranchForOrders && (
              <div style={{ marginTop: 12 }}>
                <Tag color="purple">
                  <FileTextOutlined /> Pedidos de: {selectedBranchForOrders}
                </Tag>
              </div>
            )}
          </Card>
        </Col>

        {/* Información de Roles */}
        <Col span={24}>
          <Card title="🎭 Información de Roles" size="small">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", borderColor: "#faad14" }}
                >
                  <CrownOutlined style={{ fontSize: 24, color: "#faad14" }} />
                  <Title level={4} style={{ margin: "8px 0" }}>
                    PROPIETARIO
                  </Title>
                  <Text type="secondary">Control total de la sucursal</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", borderColor: "#1890ff" }}
                >
                  <StarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                  <Title level={4} style={{ margin: "8px 0" }}>
                    ADMINISTRADOR
                  </Title>
                  <Text type="secondary">Gestión completa</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", borderColor: "#52c41a" }}
                >
                  <TeamOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                  <Title level={4} style={{ margin: "8px 0" }}>
                    GERENTE
                  </Title>
                  <Text type="secondary">Gestión operativa</Text>
                </Card>
              </Col>
              <Col span={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", borderColor: "#8c8c8c" }}
                >
                  <UserOutlined style={{ fontSize: 24, color: "#8c8c8c" }} />
                  <Title level={4} style={{ margin: "8px 0" }}>
                    EMPLEADO
                  </Title>
                  <Text type="secondary">Acceso básico</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Código de Ejemplo */}
        <Col span={24}>
          <Card title="💻 Código de Ejemplo" size="small">
            <pre
              style={{ background: "#f5f5f5", padding: 16, borderRadius: 6 }}
            >
              {`// Hook básico
const { branches, loading } = useBranches();

// Hook con opciones
const { branches, getBranchStats } = useBranches({
  includeAllOption: true,
  showRoles: true,
  filterByRole: ["OWNER", "ADMIN"],
  cacheTime: 5 * 60 * 1000, // 5 minutos
});

// Componente simple
<BranchSelector
  value={selectedBranch}
  onChange={setSelectedBranch}
  placeholder="Selecciona una sucursal"
/>

// Componente múltiple con estadísticas
<BranchSelector
  value={selectedBranches}
  onChange={setSelectedBranches}
  mode="multiple"
  showCount={true}
  showRole={true}
/>`}
            </pre>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BranchFilterExample;
