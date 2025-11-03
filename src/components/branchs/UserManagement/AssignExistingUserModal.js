import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Avatar,
  List,
} from "antd";
import { UserOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../../api/endpoints";

const { Option } = Select;
const { Text } = Typography;

const ROLE_COLORS = {
  OWNER: "gold",
  ADMIN_LOCAL: "red",
  MANAGER: "blue",
  METER: "#1890ff",
  CAJERO: "#1890ff",
};

const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN_LOCAL: "Administrador Local",
  MANAGER: "Gerente",
  METER: "Medidor",
  CAJERO: "Cajero/a",
};

const AssignExistingUserModal = ({ visible, onClose, branch, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadAvailableUsers = async () => {
    if (!branch?.id) return;

    setLoadingUsers(true);
    try {
      const response = await api.branchs.get_available_users(branch.id);
      setAvailableUsers(response.data.available_users || []);
    } catch (error) {

      message.error("Error al cargar usuarios disponibles");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (visible && branch) {
      loadAvailableUsers();
      form.resetFields();
    }
  }, [visible, branch]);

  const handleAssignUser = async (values) => {
    if (!branch?.id) return;

    setLoading(true);
    try {
      await api.branchs.assign_existing_user(branch.id, {
        user_id: values.user_id,
        role: values.role,
        is_active: values.is_active,
      });

      message.success("Usuario asignado exitosamente");
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {

      const errorMessage =
        error.response?.data?.error || "Error al asignar usuario";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderUserOption = (user) => {
    const displayName =
      `${user.first_name} ${user.last_name}`.trim() || user.email;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{displayName}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
          </div>
        </Space>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          {user.type_user}
        </Text>
      </div>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined style={{ color: "#1890ff" }} />
          Asignar Usuario Existente (Super Admin) - {branch?.business_name}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {loadingUsers ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>Cargando usuarios disponibles...</div>
        </div>
      ) : availableUsers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <TeamOutlined style={{ fontSize: 48, color: "#1890ff" }} />
          <div style={{ marginTop: 16, color: "#666" }}>
            No hay usuarios disponibles para asignar
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Todos los usuarios ya tienen acceso a esta sucursal
          </Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAssignUser}
          initialValues={{
            role: "METER",
            is_active: true,
          }}
        >
          <Form.Item
            label="Seleccionar Usuario"
            name="user_id"
            rules={[
              {
                required: true,
                message: "Por favor selecciona un usuario",
              },
            ]}
          >
            <Select
              placeholder="Selecciona un usuario"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              loading={loadingUsers}
            >
              {availableUsers.map((user) => (
                <Option key={user.id} value={user.id}>
                  {renderUserOption(user)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Rol"
            name="role"
            rules={[
              {
                required: true,
                message: "Por favor selecciona un rol",
              },
            ]}
          >
            <Select placeholder="Selecciona un rol">
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  <Space>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: ROLE_COLORS[key],
                      }}
                    />
                    {label}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Estado" name="is_active" valuePropName="checked">
            <Select>
              <Option value={true}>Activo</Option>
              <Option value={false}>Inactivo</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
              >
                Asignar Usuario
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AssignExistingUserModal;
