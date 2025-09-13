import React from "react";
import { Card, Row, Col, Statistic, Space, Typography, Tag } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  SafetyOutlined,
  CarOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const UserStats = ({ users = [] }) => {
  // Calcular estadísticas
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => user.branch_access?.is_active !== false
  ).length;
  const inactiveUsers = totalUsers - activeUsers;

  // Contar por roles
  const roleCounts = users.reduce((acc, user) => {
    const role = user.branch_access?.role || "VIEWER";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  // Roles principales
  const mainRoles = [
    {
      key: "OWNER",
      label: "Propietarios",
      icon: <CrownOutlined />,
      color: "#faad14",
    },
    {
      key: "ADMIN_LOCAL",
      label: "Administradores",
      icon: <SafetyOutlined />,
      color: "#ff4d4f",
    },
    {
      key: "DRIVER",
      label: "Conductores",
      icon: <CarOutlined />,
      color: "#fa8c16",
    },
    {
      key: "MANAGER",
      label: "Gerentes",
      icon: <TeamOutlined />,
      color: "#1890ff",
    },
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {/* Estadísticas principales */}
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              textAlign: "center",
            }}
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <Statistic
              title="Total Usuarios"
              value={totalUsers}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontSize: "24px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              textAlign: "center",
            }}
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <Statistic
              title="Usuarios Activos"
              value={activeUsers}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontSize: "24px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              textAlign: "center",
            }}
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <Statistic
              title="Usuarios Inactivos"
              value={inactiveUsers}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f", fontSize: "24px" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            style={{
              textAlign: "center",
            }}
            styles={{
              body: {
                padding: "16px",
              },
            }}
          >
            <Statistic
              title="Tasa de Actividad"
              value={
                totalUsers > 0
                  ? Math.round((activeUsers / totalUsers) * 100)
                  : 0
              }
              suffix="%"
              valueStyle={{ color: "#52c41a", fontSize: "24px" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Distribución por roles */}
      <div style={{ marginTop: 16 }}>
        <Space wrap>
          {mainRoles.map((role) => (
            <Tag
              key={role.key}
              color={role.color}
              style={{
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: "500",
              }}
              icon={role.icon}
            >
              {role.label}: {roleCounts[role.key] || 0}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default UserStats;
