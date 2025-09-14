import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  TeamOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import api from "../../api/endpoints";
import { AppContext } from "../../App";

const { Option } = Select;
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

const USER_TYPES = {
  ADM: "Administrador del Sistema",
  BDG: "Bodega",
};

const CreateUserWithAssignment = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const { state: appState } = useContext(AppContext);
  const currentUser = appState.user;

  const loadBranches = async () => {
    setLoadingBranches(true);
    try {
      const response = await api.branchs.my_branches();
      setBranches(response.data || []);
    } catch (error) {

      message.error("Error al cargar sucursales");
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadBranches();
      form.resetFields();
    }
  }, [visible]);

  const handleCreateUser = async (values) => {
    setLoading(true);
    try {
      const userData = {
        ...values,
        branch_id: values.branch_id,
        role: values.role || "VIEWER", // Asegurar que siempre tenga un valor
        is_active: values.is_active,
      };

      await api.users.signup(userData);

      message.success(
        "Usuario creado y asignado automáticamente a la sucursal"
      );
      form.resetFields();
      onSuccess?.();
      onClose();
    } catch (error) {

      const errorMessage =
        error.response?.data?.error || "Error al crear usuario";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario actual puede crear usuarios
  const canCreateUsers = () => {
    if (currentUser?.type_user === "ADM") return true;
    // Verificar si tiene rol de gestión en alguna sucursal
    return branches.some(
      (branch) =>
        branch.role === "OWNER" ||
        branch.role === "ADMIN" ||
        branch.role === "MANAGER"
    );
  };

  if (!canCreateUsers()) {
    return (
      <Modal
        title="Crear Usuario"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: "center", padding: "40px" }}>
          <UserOutlined style={{ fontSize: 48, color: "#ccc" }} />
          <div style={{ marginTop: 16, color: "#666" }}>
            No tienes permisos para crear usuarios
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Necesitas ser administrador del sistema o tener rol de gestión en
            una sucursal
          </Text>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          Crear Usuario con Asignación
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateUser}
        initialValues={{
          type_user: "BDG",
          role: "VIEWER",
          is_active: true,
        }}
      >
        <Title level={5}>Información del Usuario</Title>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el email",
            },
            {
              type: "email",
              message: "Por favor ingresa un email válido",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="ejemplo@correo.com" />
        </Form.Item>

        <Form.Item
          label="Nombre de Usuario"
          name="username"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre de usuario",
            },
            {
              min: 4,
              message: "El nombre de usuario debe tener al menos 4 caracteres",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="nombre_usuario" />
        </Form.Item>

        <Form.Item
          label="Nombre"
          name="first_name"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre",
            },
          ]}
        >
          <Input placeholder="Nombre" />
        </Form.Item>

        <Form.Item
          label="Apellido"
          name="last_name"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el apellido",
            },
          ]}
        >
          <Input placeholder="Apellido" />
        </Form.Item>

        <Form.Item
          label="RUT"
          name="dni"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el RUT",
            },
          ]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="12345678-9" />
        </Form.Item>

        <Form.Item
          label="Tipo de Usuario"
          name="type_user"
          rules={[
            {
              required: true,
              message: "Por favor selecciona el tipo de usuario",
            },
          ]}
        >
          <Select placeholder="Selecciona el tipo de usuario">
            {Object.entries(USER_TYPES).map(([key, label]) => (
              <Option key={key} value={key}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingresa la contraseña",
            },
            {
              min: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
        </Form.Item>

        <Form.Item
          label="Confirmar Contraseña"
          name="password_confirmation"
          rules={[
            {
              required: true,
              message: "Por favor confirma la contraseña",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirmar contraseña"
          />
        </Form.Item>

        <Divider />

        <Title level={5}>Asignación a Sucursal</Title>

        <Form.Item
          label="Sucursal"
          name="branch_id"
          rules={[
            {
              required: true,
              message: "Por favor selecciona una sucursal",
            },
          ]}
        >
          <Select
            placeholder="Selecciona una sucursal"
            loading={loadingBranches}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {branches.map((branch) => (
              <Option
                key={branch.branch?.id || branch.id}
                value={branch.branch?.id || branch.id}
              >
                {branch.branch?.business_name || branch.business_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Rol en la Sucursal" name="role">
          <Select placeholder="Selecciona un rol (opcional, por defecto Solo Lectura)">
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

        <Form.Item label="Estado" name="is_active">
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
              Crear Usuario
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserWithAssignment;
