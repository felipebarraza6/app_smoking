import React from "react";
import {
  Row,
  Flex,
  Tag,
  Button,
  Popconfirm,
  Space,
  Switch,
  Select,
  Avatar,
  Tooltip,
  Badge,
  Typography,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  SettingOutlined,
  UserOutlined,
  CarOutlined,
  CrownOutlined,
  TeamOutlined,
  EyeOutlined,
  SafetyOutlined,
  DollarOutlined,
  CalculatorOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";
import { controller } from "../../../controllers/users";
import api from "../../../api/endpoints";

const { Option } = Select;
const { Text } = Typography;

const ROLE_COLORS = {
  OWNER: "#faad14",
  ADMIN_LOCAL: "#ff4d4f",
  MANAGER: "#1890ff",
  EMPLOYEE: "#52c41a",
  CAJERO: "#13c2c2",
  METER: "#eb2f96",
  RECEIVER: "#722ed1",
  DRIVER: "#fa8c16",
  VIEWER: "#8c8c8c",
};

const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN_LOCAL: "Administrador Local",
  MANAGER: "Gerente",
  EMPLOYEE: "Empleado",
  CAJERO: "Cajero",
  METER: "Medidor",
  RECEIVER: "Recepcionista",
  DRIVER: "Conductor",
  VIEWER: "Solo Lectura",
};

const ROLE_ICONS = {
  OWNER: <CrownOutlined />,
  ADMIN_LOCAL: <SafetyOutlined />,
  MANAGER: <TeamOutlined />,
  EMPLOYEE: <UserOutlined />,
  CAJERO: <DollarOutlined />,
  METER: <CalculatorOutlined />,
  RECEIVER: <PhoneOutlined />,
  DRIVER: <CarOutlined />,
  VIEWER: <EyeOutlined />,
};

export const defaultColumn = (
  dispatch,
  notification,
  branchId,
  handleEditUser
) => {
  const handleToggleStatus = async (user, isActive) => {
    try {
      const userBranchId = user.branch_access?.branch_id;
      if (!userBranchId) {
        notification.error({
          message: "Error: No se puede determinar la sucursal del usuario",
        });
        return;
      }

      await api.users.toggle_user_status({
        user_id: user.id,
        branch_id: userBranchId,
      });

      notification.success({
        message: `Usuario ${
          !isActive ? "activado" : "desactivado"
        } exitosamente`,
      });

      // Recargar la lista
      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar estado del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      const userBranchId = user.branch_access?.branch_id;
      if (!userBranchId) {
        notification.error({
          message: "Error: No se puede determinar la sucursal del usuario",
        });
        return;
      }

      await api.users.change_user_role({
        user_id: user.id,
        branch_id: userBranchId,
        role: newRole,
      });

      notification.success({
        message: `Rol cambiado a ${ROLE_LABELS[newRole]} exitosamente`,
      });

      // Recargar la lista
      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar rol del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  return [
    {
      title: "Usuario",
      width: 250,
      render: (x) => {
        const isActive = x.branch_access?.is_active ?? true;
        const currentRole = x.branch_access?.role || "VIEWER";

        return (
          <Space align="center" style={{ width: "100%" }}>
            <Badge status={isActive ? "success" : "error"} offset={[-5, 5]}>
              <Avatar
                size={40}
                style={{
                  backgroundColor: ROLE_COLORS[currentRole],
                  border: `2px solid ${ROLE_COLORS[currentRole]}20`,
                }}
                icon={`${x.first_name[0]}${x.last_name[0]}`}
              />
            </Badge>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: "14px", display: "block" }}>
                {x.first_name} {x.last_name}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: "12px", display: "block" }}
              >
                {x.email.toLowerCase()}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "DNI",
      width: 120,
      render: (x) => (
        <Tooltip title={x.dni ? RUT.format(x.dni) : "Sin RUT"}>
          <>{x.dni ? RUT.format(x.dni) : "Sin RUT"}</>
        </Tooltip>
      ),
    },
    {
      title: "Estado",
      width: 120,
      render: (x) => {
        const isActive = x.branch_access?.is_active ?? true;
        return (
          <Space direction="vertical" size="small" align="center">
            <Switch
              size="small"
              checked={isActive}
              onChange={() => handleToggleStatus(x, isActive)}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              style={{
                background: isActive ? "#52c41a" : "#ff4d4f",
              }}
            />
          </Space>
        );
      },
    },
    {
      title: "Sucursales",
      width: 200,
      render: (x) => {
        const assignments = x.branch_assignments || [];

        if (assignments.length === 0) {
          return (
            <Tag
              color="default"
              style={{ fontSize: "12px", padding: "2px 6px" }}
            >
              Sin asignación
            </Tag>
          );
        }

        return (
          <Flex
            align="space-around"
            gap="small"
            vertical
            style={{ width: "100%" }}
          >
            {assignments.map((assignment) => {
              const roleInfo = ROLE_LABELS[assignment.role] || assignment.role;
              return (
                <Flex
                  justify="space-between"
                  gap="small"
                  style={{ width: "100%" }}
                >
                  <Tag color={ROLE_COLORS[assignment.role]}>
                    {assignment.branch_name}
                  </Tag>
                  <Tag
                    color={ROLE_COLORS[assignment.role]}
                    icon={ROLE_ICONS[assignment.role]}
                  >
                    {roleInfo}
                  </Tag>
                </Flex>
              );
            })}
          </Flex>
        );
      },
    },
    {
      title: "Acciones",
      align: "right",
      width: 200,
      render: (x) => {
        return (
          <Flex justify="end" gap="small">
            <Tooltip title="Editar usuario">
              <Button
                size="small"
                type="primary"
                shape="circle"
                onClick={() => handleEditUser(x)}
                icon={<EditFilled />}
              />
            </Tooltip>
            <>
              <Popconfirm
                title="¿Eliminar usuario?"
                description="Esta acción no se puede deshacer"
                onConfirm={() => {
                  controller.delete(x, dispatch, notification);
                }}
                cancelButtonProps={{ type: "primary" }}
                okText="Sí, eliminar"
                cancelText="Cancelar"
              >
                <Button
                  type="primary"
                  shape="circle"
                  danger
                  icon={<DeleteFilled />}
                  size="small"
                />
              </Popconfirm>
            </>
          </Flex>
        );
      },
    },
  ];
};

export const shortColumn = (
  dispatch,
  notification,
  branchId,
  handleEditUser
) => {
  const handleToggleStatus = async (user, isActive) => {
    try {
      const userBranchId = user.branch_access?.branch_id;
      if (!userBranchId) {
        notification.error({
          message: "Error: No se puede determinar la sucursal del usuario",
        });
        return;
      }

      await api.users.toggle_user_status({
        user_id: user.id,
        branch_id: userBranchId,
      });

      notification.success({
        message: `Usuario ${
          !isActive ? "activado" : "desactivado"
        } exitosamente`,
      });

      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar estado del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      const userBranchId = user.branch_access?.branch_id;
      if (!userBranchId) {
        notification.error({
          message: "Error: No se puede determinar la sucursal del usuario",
        });
        return;
      }

      await api.users.change_user_role({
        user_id: user.id,
        branch_id: userBranchId,
        role: newRole,
      });

      notification.success({
        message: `Rol cambiado a ${ROLE_LABELS[newRole]} exitosamente`,
      });

      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar rol del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  return [
    {
      title: "Usuario",
      render: (x) => {
        const isActive = x.branch_access?.is_active ?? true;
        const currentRole = x.branch_access?.role || "VIEWER";

        return (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            {/* Header con avatar y info básica */}
            <Space align="center" style={{ width: "100%" }}>
              <Badge status={isActive ? "success" : "error"} offset={[-3, 3]}>
                <Avatar
                  size={32}
                  style={{
                    backgroundColor: ROLE_COLORS[currentRole],
                    border: `2px solid ${ROLE_COLORS[currentRole]}20`,
                  }}
                  icon={ROLE_ICONS[currentRole]}
                />
              </Badge>
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: "13px", display: "block" }}>
                  {x.first_name} {x.last_name}
                </Text>
                <Text
                  type="secondary"
                  style={{ fontSize: "11px", display: "block" }}
                >
                  {x.email.toLowerCase()}
                </Text>
              </div>
            </Space>

            {/* Tags de información */}
            <Space wrap size="small">
              <Tag
                color={x.dni ? "blue" : "default"}
                style={{
                  borderRadius: "10px",
                  fontSize: "10px",
                  padding: "2px 6px",
                }}
              >
                {x.dni ? RUT.format(x.dni) : "Sin RUT"}
              </Tag>
              <Tag
                color={ROLE_COLORS[currentRole]}
                style={{
                  borderRadius: "10px",
                  fontSize: "10px",
                  padding: "2px 6px",
                }}
                icon={ROLE_ICONS[currentRole]}
              >
                {ROLE_LABELS[currentRole]}
              </Tag>
            </Space>

            {/* Controles de estado y rol */}
            <Space
              size="small"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Switch
                size="small"
                checked={isActive}
                onChange={() => handleToggleStatus(x, isActive)}
                checkedChildren="Activo"
                unCheckedChildren="Inactivo"
                style={{
                  background: isActive ? "#52c41a" : "#ff4d4f",
                }}
              />
              <Select
                size="small"
                value={currentRole}
                style={{ width: 90 }}
                onChange={(newRole) => handleChangeRole(x, newRole)}
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <Option key={key} value={key}>
                    <Space size="small">
                      {ROLE_ICONS[key]}
                      {label}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Space>

            {/* Botones de acción */}
            <Space
              size="small"
              style={{ width: "100%", justifyContent: "flex-end" }}
            >
              <Tooltip title="Editar usuario">
                <Button
                  size="small"
                  type="text"
                  onClick={() => handleEditUser(x)}
                  icon={<EditFilled />}
                  style={{
                    color: "#1890ff",
                  }}
                />
              </Tooltip>
              <Tooltip title="Eliminar usuario">
                <Popconfirm
                  title="¿Eliminar usuario?"
                  description="Esta acción no se puede deshacer"
                  onConfirm={() => {
                    controller.delete(x, dispatch, notification);
                  }}
                  cancelButtonProps={{ type: "primary" }}
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteFilled />}
                    size="small"
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          </Space>
        );
      },
    },
  ];
};
