import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Flex,
  Button,
  Row,
  Col,
  Space,
  Typography,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  IdcardOutlined,
  ShopOutlined,
  CrownOutlined,
  SafetyOutlined,
  TeamOutlined,
  CarOutlined,
  EyeOutlined,
  DollarOutlined,
  CalculatorOutlined,
  PhoneOutlined,
  AimOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { MdOutlinePassword } from "react-icons/md";
import RUT from "rut-chile";
import api from "../../api/endpoints";

const { Text } = Typography;

const ROLES = [
  {
    value: "OWNER",
    label: "Propietario",
    icon: <CrownOutlined />,
    color: "#faad14",
    description: "Acceso completo al sistema y todas las sucursales",
  },
  {
    value: "ADMIN_LOCAL",
    label: "Administrador Local",
    icon: <SafetyOutlined />,
    color: "#ff4d4f",
    description: "Administración completa de la sucursal asignada",
  },
  {
    value: "MANAGER",
    label: "Gerente",
    icon: <TeamOutlined />,
    color: "#1890ff",
    description: "Gestión de operaciones y supervisión de empleados",
  },
  {
    value: "EMPLOYEE",
    label: "Empleado",
    icon: <UserOutlined />,
    color: "#52c41a",
    description: "Acceso general para tareas operativas",
  },
  {
    value: "CAJERO",
    label: "Cajero",
    icon: <DollarOutlined />,
    color: "#13c2c2",
    description: "Manejo de caja y transacciones de venta",
  },
  {
    value: "METER",
    label: "Medidor",
    icon: <CalculatorOutlined />,
    color: "#eb2f96",
    description: "Registro y gestión de mediciones",
  },
  {
    value: "RECEIVER",
    label: "Recepcionista",
    icon: <PhoneOutlined />,
    color: "#722ed1",
    description: "Atención al cliente y recepción",
  },
  {
    value: "DRIVER",
    label: "Conductor",
    icon: <CarOutlined />,
    color: "#fa8c16",
    description: "Entrega de productos y logística",
  },
  {
    value: "VIEWER",
    label: "Solo Lectura",
    icon: <EyeOutlined />,
    color: "#8c8c8c",
    description: "Solo visualización, sin permisos de edición",
  },
];

const CreateUserModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const loadAvailableBranches = async () => {
    setLoadingBranches(true);
    try {
      const response = await api.branchs.my_branches();
      const branches = response.data || [];
      setAvailableBranches(branches);
    } catch (error) {
      message.error("Error al cargar sucursales disponibles");
      setAvailableBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadAvailableBranches();
      form.resetFields();
      setSelectedRole(null);
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const cleanEmail = values.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "");

      const userData = {
        ...values,
        username: cleanEmail,
        type_user: "CL",
      };

      await api.users.signup(userData);
      message.success("Usuario creado exitosamente");
      onSuccess();
      onCancel();
      form.resetFields();
    } catch (error) {
      message.error("Error al crear usuario");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDni = (e) => {
    const formatted = RUT.format(e.target.value);
    form.setFieldsValue({ dni: formatted });
  };

  const selectedRoleInfo = ROLES.find((role) => role.value === selectedRole);

  return (
    <Modal
      title={
        <Flex align="center" gap="small">
          <PlusOutlined />
          Crear Usuario
        </Flex>
      }
      open={visible}
      icon={<PlusOutlined />}
      onCancel={onCancel}
      footer={null}
      width={700}
      style={{
        top: 5,
        paddingBottom: 0,
      }}
      styles={{
        body: {
          padding: "16px",
          maxHeight: "calc(100vh - 110px)",
          overflowY: "auto",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        {/* Asignación de Sucursal y Rol - Simplificado */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--ant-color-text)",
            }}
          >
            <AimOutlined
              style={{ marginRight: "6px", fontSize: "16px", color: "#1890ff" }}
            />
            Asignación de Sucursal y Rol
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="branch_id"
                label="Sucursal"
                rules={[{ required: true, message: "Selecciona una sucursal" }]}
              >
                <Select
                  placeholder="Seleccionar sucursal"
                  suffixIcon={<ShopOutlined />}
                  loading={loadingBranches}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {availableBranches.map((b) => (
                    <Select.Option
                      key={b.branch?.id || b.id}
                      value={b.branch?.id || b.id}
                    >
                      {b.branch?.business_name || b.business_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Rol"
              rules={[{ required: true, message: "Selecciona un rol" }]}
              extra={
                "El rol es obligatorio para todos los usuarios. Los SUPERUSER solo los crea el Super Admin."
              }
              >
                <Select
                  placeholder="Seleccionar rol"
                  showSearch
                  optionFilterProp="children"
                  onChange={setSelectedRole}
                >
                  {ROLES.map((role) => (
                    <Select.Option key={role.value} value={role.value}>
                      <Space>
                        <span style={{ color: role.color }}>{role.icon}</span>
                        {role.label}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Descripción del rol seleccionado */}
          {selectedRoleInfo && (
            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                background: `linear-gradient(135deg, ${selectedRoleInfo.color}15 0%, ${selectedRoleInfo.color}25 100%)`,
                borderRadius: "10px",
                border: `1px solid ${selectedRoleInfo.color}30`,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: selectedRoleInfo.color,
                    fontSize: "20px",
                    marginRight: "10px",
                  }}
                >
                  {selectedRoleInfo.icon}
                </span>
                <Text
                  strong
                  style={{
                    color: selectedRoleInfo.color,
                    fontSize: "16px",
                  }}
                >
                  {selectedRoleInfo.label}
                </Text>
              </div>
              <Text
                style={{
                  color: "var(--ant-color-text-secondary)",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {selectedRoleInfo.description}
              </Text>
            </div>
          )}
        </div>

        {/* Información Personal - Simplificado */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--ant-color-text)",
            }}
          >
            <UserOutlined
              style={{ marginRight: "6px", fontSize: "16px", color: "#52c41a" }}
            />
            Información Personal
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Nombre"
                rules={[{ required: true, message: "Ingresa el nombre" }]}
              >
                <Input
                  placeholder="Nombre del usuario"
                  prefix={<IdcardOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Apellido"
                rules={[{ required: true, message: "Ingresa el apellido" }]}
              >
                <Input
                  placeholder="Apellido del usuario"
                  prefix={<IdcardOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Ingresa el email" },
                  { type: "email", message: "Email inválido" },
                ]}
              >
                <Input
                  placeholder="email@ejemplo.com"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dni"
                label="RUT"
                rules={[{ required: true, message: "Ingresa el RUT" }]}
              >
                <Input
                  maxLength={12}
                  placeholder="12.345.678-9"
                  onChange={onChangeDni}
                  prefix={<IdcardOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Contraseña - Simplificado */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "var(--ant-color-text)",
            }}
          >
            <LockOutlined
              style={{ marginRight: "6px", fontSize: "16px", color: "#faad14" }}
            />
            Contraseña
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                  { required: true, message: "Ingresa la contraseña" },
                  { min: 8, message: "Mínimo 8 caracteres" },
                ]}
              >
                <Input.Password
                  placeholder="Mínimo 8 caracteres"
                  prefix={<MdOutlinePassword />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="password_confirmation"
                label="Confirmar Contraseña"
                rules={[
                  { required: true, message: "Confirma la contraseña" },
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
                  placeholder="Repetir contraseña"
                  prefix={<MdOutlinePassword />}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Botones */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid var(--ant-color-border)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button onClick={onCancel} size="large">
            Cancelar
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            <PlusOutlined style={{ marginRight: "6px" }} />
            Crear Usuario
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
