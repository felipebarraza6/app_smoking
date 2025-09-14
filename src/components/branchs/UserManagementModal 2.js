import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  List,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
  Select,
  Form,
  Input,
  Avatar,
  Tooltip,
  Divider,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CrownOutlined,
  TeamOutlined,
  MailOutlined,
} from "@ant-design/icons";
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

const UserManagementModal = ({ visible, onClose, branch }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Obtener usuario actual desde contexto global
  const { state: appState } = useContext(AppContext);
  const currentUser = appState?.user || {};

  // Función para saber si puede editar roles
  const canEditRoles = ["ADM", "OWNER", "MANAGER", "ADMIN"].includes(
    currentUser?.type_user
  );

  const loadUsers = async () => {
    if (!branch) return;

    setLoading(true);
    try {
      const response = await api.branchs.get_branch_users(branch.id);
      setUsers(response.data || []);
    } catch (error) {

      message.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && branch) {
      loadUsers();
    }
  }, [visible, branch]);

  const handleInviteUser = async (values) => {
    try {
      await api.branchs.invite_user(branch.id, values);
      message.success("Invitación enviada exitosamente");
      setInviteModalVisible(false);
      inviteForm.resetFields();
      loadUsers();
    } catch (error) {

      const errorMessage =
        error.response?.data?.error || "Error al invitar usuario";
      message.error(errorMessage);
    }
  };

  const handleUpdateUserRole = async (values) => {
    try {
      const response = await api.branchs.update_user_role(branch.id, {
        user_id: selectedUser.user.id,
        role: values.role,
      });

      message.success("Rol actualizado exitosamente");
      setEditModalVisible(false);
      setSelectedUser(null);
      editForm.resetFields();
      loadUsers();
    } catch (error) {

      const errorMessage =
        error.response?.data?.error || "Error al actualizar rol";
      message.error(errorMessage);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      await api.branchs.remove_user(branch.id, userId);
      message.success("Usuario removido exitosamente");
      loadUsers();
    } catch (error) {

      const errorMessage =
        error.response?.data?.error || "Error al remover usuario";
      message.error(errorMessage);
    }
  };

  const openEditModal = (user) => {
    // Forzar el valor del rol a mayúsculas y validar
    let role = (user.role || "").toUpperCase();
    if (!Object.keys(ROLE_LABELS).includes(role)) {
      message.warning('Rol no reconocido, se usará "Empleado" por defecto');
      role = "EMPLOYEE";
    }
    setSelectedUser(user);
    editForm.setFieldsValue({
      role: role,
    });
    setEditModalVisible(true);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "OWNER":
        return <CrownOutlined />;
      default:
        return <TeamOutlined />;
    }
  };

  const canManageUser = (user) => {
    // No se puede gestionar al propietario
    if (user.role === "OWNER") return false;
    return true;
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <TeamOutlined />
            Gestión de Usuarios - {branch?.business_name}
          </Space>
        }
        open={visible}
        onCancel={onClose}
        footer={[
          <Button
            key="invite"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setInviteModalVisible(true)}
          >
            Invitar Usuario
          </Button>,
          <Button key="close" onClick={onClose}>
            Cerrar
          </Button>,
        ]}
        width={800}
      >
        <List
          loading={loading}
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              actions={[
                canEditRoles && (
                  <Tooltip title="Editar rol">
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </Button>
                  </Tooltip>
                ),
                canEditRoles && (
                  <Popconfirm
                    title="¿Estás seguro de remover este usuario?"
                    onConfirm={() => handleRemoveUser(user.user.id)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />} size="small">
                      Remover
                    </Button>
                  </Popconfirm>
                ),
              ].filter(Boolean)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                }
                title={
                  <Space>
                    <Text strong>
                      {user.user.first_name} {user.user.last_name}
                    </Text>
                    <Tag
                      color={ROLE_COLORS[user.role]}
                      icon={getRoleIcon(user.role)}
                    >
                      {ROLE_LABELS[user.role]}
                    </Tag>
                  </Space>
                }
                description={
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">
                      <MailOutlined style={{ marginRight: 8 }} />
                      {user.user.email}
                    </Text>
                    <Text type="secondary">
                      📅{" "}
                      {user.accepted_at
                        ? `Aceptado: ${new Date(
                            user.accepted_at
                          ).toLocaleDateString("es-CL")}`
                        : "Pendiente de aceptación"}
                    </Text>
                    {user.invited_by_name && (
                      <Text type="secondary">
                        👤 Invitado por: {user.invited_by_name}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal para invitar usuario */}
      <Modal
        title="Invitar Usuario"
        open={inviteModalVisible}
        onCancel={() => {
          setInviteModalVisible(false);
          inviteForm.resetFields();
        }}
        footer={null}
      >
        <Form form={inviteForm} onFinish={handleInviteUser} layout="vertical">
          <Form.Item
            name="email"
            label="Email del usuario"
            rules={[
              { required: true, message: "Ingresa el email" },
              { type: "email", message: "Email inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="usuario@ejemplo.com"
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select
              placeholder="Selecciona un rol"
              allowClear
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="message" label="Mensaje (opcional)">
            <Input.TextArea
              placeholder="Mensaje personalizado para la invitación"
              rows={3}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Enviar Invitación
              </Button>
              <Button
                onClick={() => {
                  setInviteModalVisible(false);
                  inviteForm.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para editar rol */}
      <Modal
        title="Editar Rol de Usuario"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        {selectedUser && (
          <Form
            form={editForm}
            onFinish={handleUpdateUserRole}
            layout="vertical"
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Usuario:</Text> {selectedUser.user.first_name}{" "}
              {selectedUser.user.last_name}
              <br />
              <Text type="secondary">{selectedUser.user.email}</Text>
            </div>
            <Form.Item
              name="role"
              label="Nuevo rol"
              rules={[{ required: true, message: "Selecciona un rol" }]}
            >
              <Select
                placeholder="Selecciona un rol"
                allowClear
                getPopupContainer={(trigger) => trigger.parentNode}
                disabled={!canEditRoles}
              >
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <Option key={key} value={key}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Actualizar Rol
                </Button>
                <Button
                  onClick={() => {
                    setEditModalVisible(false);
                    setSelectedUser(null);
                    editForm.resetFields();
                  }}
                >
                  Cancelar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default UserManagementModal;
