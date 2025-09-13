import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
  Modal,
  Select,
  Avatar,
  Tooltip,
  Row,
  Col,
  Divider,
} from "antd";
import {
  BranchesOutlined,
  LogoutOutlined,
  CrownOutlined,
  SwapOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useBreakpoint } from "../../utils/breakpoints";
import api from "../../api/endpoints";
import { AppContext } from "../../App";

const { Title, Text } = Typography;
const { Option } = Select;

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

const MyBranchesSection = () => {
  const { state } = useContext(AppContext);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [transferLoading, setTransferLoading] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const loadBranches = async () => {
    setLoading(true);
    try {
      const response = await api.branchs.my_branches();
      console.log("API Response my_branches:", response); // Debug log

      // Asegurar que siempre sea un array
      const branchesData = Array.isArray(response)
        ? response
        : response.data || [];

      setBranches(branchesData);

      if (branchesData.length === 0) {
      } else {
      }
    } catch (error) {
      message.error("Error al cargar las sucursales");
      setBranches([]); // Asegurar que sea un array vacío
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleLeaveBranch = async (branchId) => {
    try {
      await api.branchs.leave_branch(branchId);
      message.success("Has abandonado la sucursal exitosamente");
      loadBranches(); // Recargar lista
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error al abandonar la sucursal";
      message.error(errorMessage);
    }
  };

  const handleTransferOwnership = async (branchId, newOwnerId) => {
    setTransferLoading(true);
    try {
      await api.branchs.transfer_ownership(branchId, newOwnerId);
      message.success("Propiedad transferida exitosamente");
      setTransferModalVisible(false);
      setSelectedBranch(null);
      loadBranches(); // Recargar lista
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Error al transferir la propiedad";
      message.error(errorMessage);
    } finally {
      setTransferLoading(false);
    }
  };

  const loadBranchUsers = async (branchId) => {
    try {
      const response = await api.branchs.get_branch_users(branchId);
      // Filtrar usuarios: solo activos, aceptados y que no sean el usuario actual
      const currentUserId = state.user?.id;
      const users = response.data.filter(
        (user) =>
          user.role !== "OWNER" &&
          user.user.id !== currentUserId &&
          user.accepted_at
      );
      setAvailableUsers(users);
    } catch (error) {
      message.error("Error al cargar usuarios de la sucursal");
    }
  };

  const openTransferModal = (branch) => {
    setSelectedBranch(branch);
    loadBranchUsers(branch.branch.id);
    setTransferModalVisible(true);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "OWNER":
        return <CrownOutlined />;
      default:
        return <TeamOutlined />;
    }
  };

  if (branches.length === 0) {
    return (
      <Card
        title={
          <Space>
            <BranchesOutlined />
            Roles en Sucursal
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">No tienes sucursales asignadas</Text>
        </div>
      </Card>
    );
  }

  return (
    <>
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
          loading={loading}
          dataSource={branches}
          renderItem={(branchAccess) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<BranchesOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <Space wrap>
                    <Text strong>
                      {branchAccess.branch?.business_name ||
                        "Sucursal sin nombre"}
                    </Text>
                    <Tag
                      color={ROLE_COLORS[branchAccess.role]}
                      icon={getRoleIcon(branchAccess.role)}
                    >
                      {ROLE_LABELS[branchAccess.role]}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <Space
                      direction="vertical"
                      size={0}
                      style={{ width: "100%" }}
                    >
                      <Text type="secondary">
                        <EnvironmentOutlined style={{ marginRight: 8 }} />
                        {branchAccess.branch?.address || "Sin dirección"},{" "}
                        {branchAccess.branch?.commune || "Sin comuna"}
                      </Text>
                      <Text type="secondary">
                        <PhoneOutlined style={{ marginRight: 8 }} />
                        {branchAccess.branch?.phone || "Sin teléfono"}
                      </Text>
                      <Text type="secondary">
                        📅 Aceptado:{" "}
                        {branchAccess.accepted_at
                          ? new Date(
                              branchAccess.accepted_at
                            ).toLocaleDateString("es-CL")
                          : "Pendiente"}
                      </Text>
                    </Space>

                    {/* Botones para móvil */}
                    {isMobile && (
                      <>
                        <Divider style={{ margin: "12px 0" }} />
                        <Row gutter={8}>
                          {branchAccess.role === "OWNER" && (
                            <Col span={12}>
                              <Button
                                icon={<SwapOutlined />}
                                size="small"
                                block
                                onClick={() => openTransferModal(branchAccess)}
                              >
                                Transferir
                              </Button>
                            </Col>
                          )}
                          {branchAccess.role !== "OWNER" && (
                            <Col span={12}>
                              <Popconfirm
                                title="¿Estás seguro de abandonar esta sucursal?"
                                onConfirm={() =>
                                  handleLeaveBranch(branchAccess.branch.id)
                                }
                                okText="Sí"
                                cancelText="No"
                              >
                                <Button
                                  danger
                                  icon={<LogoutOutlined />}
                                  size="small"
                                  block
                                >
                                  Abandonar
                                </Button>
                              </Popconfirm>
                            </Col>
                          )}
                        </Row>
                      </>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Modal para transferir propiedad */}
      <Modal
        title="Transferir Propiedad"
        open={transferModalVisible}
        onCancel={() => {
          setTransferModalVisible(false);
          setSelectedBranch(null);
        }}
        footer={null}
        width={isMobile ? "90%" : 500}
      >
        {selectedBranch && (
          <div>
            <p>
              <strong>Sucursal:</strong> {selectedBranch.branch.business_name}
            </p>
            <p>
              <strong>Selecciona el nuevo propietario:</strong>
            </p>
            <Select
              style={{ width: "100%", marginBottom: 16 }}
              placeholder="Selecciona un usuario"
              onChange={(value) => {
                const user = availableUsers.find((u) => u.user.id === value);
                if (user) {
                  handleTransferOwnership(selectedBranch.branch.id, value);
                }
              }}
              loading={transferLoading}
            >
              {availableUsers.map((user) => (
                <Option key={user.user.id} value={user.user.id}>
                  {user.user.first_name} {user.user.last_name} (
                  {user.user.email}) - {ROLE_LABELS[user.role]}
                </Option>
              ))}
            </Select>
            <p style={{ color: "#666", fontSize: "12px" }}>
              ⚠️ Esta acción transferirá la propiedad de la tienda al usuario
              seleccionado. No se puede deshacer.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MyBranchesSection;
