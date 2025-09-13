import React, { useContext } from "react";
import {
  Card,
  List,
  Avatar,
  Tag,
  Space,
  Typography,
  Button,
  Empty,
} from "antd";
import {
  BranchesOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  CrownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../App";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const ROLE_COLORS = {
  OWNER: "gold",
  ADMIN: "red",
  MANAGER: "blue",
  EMPLOYEE: "green",
  VIEWER: "default",
};

const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Empleado",
  VIEWER: "Solo Lectura",
};

const BranchesWidget = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();
  const branches = state.branches || [];

  const getRoleIcon = (role) => {
    switch (role) {
      case "OWNER":
        return <CrownOutlined />;
      default:
        return <TeamOutlined />;
    }
  };

  const handleManageUsers = (branch) => {
    navigate("/app/branchs");
    // Aquí podrías abrir directamente el modal de gestión de usuarios
  };

  if (branches.length === 0) {
    return (
      <Card
        title={
          <Space>
            <BranchesOutlined />
            Roles en Sucursales
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Empty
          description="No tienes sucursales asignadas"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate("/app/branchs")}>
            Ver Sucursales
          </Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <BranchesOutlined />
          Roles en Sucursales ({branches.length})
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <List
        dataSource={branches}
        renderItem={(branchAccess) => (
          <List.Item
            actions={[
              <Button
                type="link"
                size="small"
                onClick={() => handleManageUsers(branchAccess.branch)}
              >
                Gestionar
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<BranchesOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
              }
              title={
                <Space>
                  <Text strong>{branchAccess.branch.business_name}</Text>
                  <Tag
                    color={ROLE_COLORS[branchAccess.role]}
                    icon={getRoleIcon(branchAccess.role)}
                  >
                    {ROLE_LABELS[branchAccess.role]}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">
                    <EnvironmentOutlined style={{ marginRight: 8 }} />
                    {branchAccess.branch.address}, {branchAccess.branch.commune}
                  </Text>
                  <Text type="secondary">
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {branchAccess.branch.phone}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default BranchesWidget;
