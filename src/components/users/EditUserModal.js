import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
  Card,
  Typography,
  Switch,
  message,
} from "antd";
import {
  UserOutlined,
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
  EditOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";
import api from "../../api/endpoints";

const { Text, Title } = Typography;

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

// Componente para gestionar múltiples asignaciones de sucursales
const BranchAssignmentsSection = ({ user, onUpdate }) => {
  const assignments = user.branch_assignments || [];

  const handleToggleAssignmentStatus = async (assignment) => {
    try {
      await api.users.toggle_branch_assignment_status({
        assignment_id: assignment.id,
      });
      message.success(
        `Asignación ${
          !assignment.is_active ? "activada" : "desactivada"
        } exitosamente`
      );
      onUpdate();
    } catch (error) {
      message.error("Error al cambiar estado de asignación");
      console.error("Error:", error);
    }
  };

  const handleChangeAssignmentRole = async (assignment, newRole) => {
    try {
      await api.users.change_assignment_role({
        assignment_id: assignment.id,
        role: newRole,
      });
      message.success(`Rol cambiado exitosamente`);
      onUpdate();
    } catch (error) {
      message.error("Error al cambiar rol");
      console.error("Error:", error);
    }
  };

  if (assignments.length === 0) {
    return (
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
          Asignaciones de Sucursales
        </div>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Text type="secondary">
            Este usuario no tiene asignaciones de sucursales
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--ant-color-text)",
        }}
      >
        <AimOutlined
          style={{ marginRight: "6px", fontSize: "16px", color: "#1890ff" }}
        />
        Asignaciones de Sucursales ({assignments.length})
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {assignments.map((assignment, index) => {
          const roleInfo = ROLES.find((role) => role.value === assignment.role);

          return (
            <Card key={assignment.id} size="small">
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ShopOutlined
                      style={{
                        marginRight: "8px",
                        fontSize: "16px",
                        color: "#1890ff",
                      }}
                    />
                    <div>
                      <Text strong style={{ fontSize: "14px" }}>
                        {assignment.branch_name}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        ID: {assignment.branch_id}
                      </Text>
                    </div>
                  </div>
                </Col>

                <Col span={6}>
                  <div style={{ textAlign: "center" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Rol
                    </Text>
                    <br />
                    <Select
                      value={assignment.role}
                      size="small"
                      style={{ width: "100%" }}
                      onChange={(newRole) =>
                        handleChangeAssignmentRole(assignment, newRole)
                      }
                    >
                      {ROLES.map((role) => (
                        <Select.Option key={role.value} value={role.value}>
                          <Space size="small">
                            <span style={{ color: role.color }}>
                              {role.icon}
                            </span>
                            {role.label}
                          </Space>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </Col>

                <Col span={4}>
                  <div style={{ textAlign: "center" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Estado
                    </Text>
                    <br />
                    <Switch
                      size="small"
                      checked={assignment.is_active}
                      onChange={() => handleToggleAssignmentStatus(assignment)}
                      checkedChildren="Activo"
                      unCheckedChildren="Inactivo"
                    />
                  </div>
                </Col>

                <Col span={6}>
                  <div style={{ textAlign: "center" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Asignado el
                    </Text>
                    <br />
                    <Text style={{ fontSize: "12px" }}>
                      {new Date(assignment.assigned_at).toLocaleDateString()}
                    </Text>
                    {assignment.invited_by && (
                      <>
                        <br />
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          Por: {assignment.invited_by.full_name}
                        </Text>
                      </>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Descripción del rol */}
              {roleInfo && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    background: `linear-gradient(135deg, ${roleInfo.color}10 0%, ${roleInfo.color}20 100%)`,
                    borderRadius: "6px",
                    border: `1px solid ${roleInfo.color}30`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: roleInfo.color, fontSize: "16px" }}>
                      {roleInfo.icon}
                    </span>
                    <Text
                      strong
                      style={{ color: roleInfo.color, fontSize: "13px" }}
                    >
                      {roleInfo.label}
                    </Text>
                  </div>
                  <Text
                    style={{
                      color: "var(--ant-color-text-secondary)",
                      fontSize: "12px",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    {roleInfo.description}
                  </Text>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const EditUserModal = ({ visible, onCancel, onSuccess, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      // Solo cargar datos básicos del usuario en el formulario
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dni: user.dni,
        is_active: user.is_active !== false, // User.is_active global
      });
    }
  }, [visible, user, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Actualizar datos básicos del usuario
      await api.users.update(user.username, {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        dni: values.dni,
      });

      // Actualizar estado global del usuario si ha cambiado
      if (values.is_active !== user.is_active) {
        // Necesitamos un branch_id válido para el endpoint
        if (user.branch_assignments && user.branch_assignments.length > 0) {
          const firstBranch = user.branch_assignments[0];
          await api.users.toggle_user_status({
            user_id: user.id,
            branch_id: firstBranch.branch_id,
          });
        }
      }

      message.success("Usuario actualizado exitosamente");
      onSuccess();
      onCancel();
    } catch (error) {
      message.error("Error al actualizar usuario");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDni = (e) => {
    const formatted = RUT.format(e.target.value);
    form.setFieldsValue({ dni: formatted });
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <>
          <UserOutlined /> {user.email}
        </>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      style={{
        top: 5,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
      >
        {/* Estado del Usuario - Ultra Compacto */}

        {/* Asignaciones de Sucursales - Múltiples */}
        <BranchAssignmentsSection user={user} onUpdate={onSuccess} />

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
            <EditOutlined style={{ marginRight: "6px" }} />
            Actualizar Usuario
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
