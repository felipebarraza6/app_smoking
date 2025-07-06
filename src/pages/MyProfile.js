/** @jsxImportSource @emotion/react */
import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Avatar,
  Space,
  Divider,
  Flex,
  Tag,
  Row,
  Col,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  IdcardOutlined,
  EditOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { AppContext } from "../App";
import api from "../api/endpoints";
import { css } from "@emotion/react";
import RUT from "rut-chile";
import InvitationsSection from "../components/profile/InvitationsSection";
import MyBranchesSection from "../components/profile/MyBranchesSection";

const { Title, Text, Paragraph } = Typography;

const USER_TYPE_LABELS = {
  ADM: "Administrador",
  BDG: "Bodega",
};

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

const cardStyle = (theme) =>
  css({
    background: theme === "dark" ? "rgba(20,20,20,0.95)" : "#fff",
    borderRadius: 12,
    boxShadow:
      theme === "dark"
        ? "0 2px 16px 0 rgba(230,0,122,0.08)"
        : "0 2px 16px 0 rgba(0,0,0,0.06)",
    border: theme === "dark" ? "1px solid #2d2d2d" : "1px solid #f0f0f0",
    padding: 24,
    marginBottom: 24,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow:
        theme === "dark"
          ? "0 4px 24px 0 rgba(230,0,122,0.12)"
          : "0 4px 24px 0 rgba(0,0,0,0.1)",
    },
  });

const InfoPersonal = ({ user, onUpdate, theme }) => {
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        dni: user.dni,
      });
    }
  }, [editing, user, form]);

  const handleSave = async (values) => {
    setLoading(true);

    try {
      await api.users.update(user.username, values);
      message.success("Perfil actualizado exitosamente");
      setEditing(false);
      onUpdate();
    } catch (error) {
      message.error("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <Card hoverable css={cardStyle(theme)}>
      <Flex justify="space-between" align="center">
        <Flex>
          <Avatar
            size={64}
            icon={getInitials(user.first_name, user.last_name)}
            style={{
              backgroundColor: "#e6007a",
              marginRight: 16,
              fontSize: 24,
            }}
          />
          <Flex vertical>
            <Text type="secondary">
              <MailOutlined style={{ marginRight: 8 }} />
              {user.email}
            </Text>
            <Title level={3} style={{ margin: 0, color: "#e6007a" }}>
              {user.first_name} {user.last_name}
            </Title>
          </Flex>
        </Flex>
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            style={{
              background: "#e6007a",
              borderColor: "#e6007a",
            }}
          >
            Editar
          </Button>
        </div>
      </Flex>

      {editing ? (
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Nombre"
                rules={[{ required: true, message: "Ingresa tu nombre" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Apellido"
                rules={[{ required: true, message: "Ingresa tu apellido" }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, type: "email", message: "Correo inválido" },
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="dni"
            label="RUT"
            rules={[{ required: true, message: "Ingresa tu RUT" }]}
          >
            <Input prefix={<IdcardOutlined />} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<CheckCircleOutlined />}
                style={{
                  background: "#e6007a",
                  borderColor: "#e6007a",
                  fontWeight: 600,
                }}
              >
                Guardar cambios
              </Button>
              <Button onClick={() => setEditing(false)}>Cancelar</Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <Descriptions column={2} size="small" layout="vertical">
            <Descriptions.Item label="Nombre">
              <Text strong>{user.first_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Apellido">
              <Text strong>{user.last_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Correo electrónico">
              <Text>{user.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="RUT">
              <Text>{user.dni}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de usuario" span={2}>
              <Tag>{USER_TYPE_LABELS[user.type_user]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Miembro desde" span={2}>
              <Text>
                {new Date(user.created).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Card>
  );
};

const Seguridad = ({ user, theme }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      await api.users.change_password(values);
      message.success("Contraseña cambiada exitosamente");
      form.resetFields();
    } catch (error) {
      message.error("Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hoverable css={cardStyle(theme)}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <SafetyOutlined
          style={{ fontSize: 32, color: "#e6007a", marginRight: 16 }}
        />
        <Title level={3} style={{ margin: 0, color: "#e6007a" }}>
          Seguridad
        </Title>
      </div>

      <Form form={form} onFinish={handleChangePassword} layout="vertical">
        <Form.Item
          name="old_password"
          label="Contraseña actual"
          rules={[{ required: true, message: "Ingresa tu contraseña actual" }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Nueva contraseña"
          rules={[
            { required: true, message: "Ingresa la nueva contraseña" },
            {
              min: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          label="Confirmar nueva contraseña"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Confirma la nueva contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SafetyOutlined />}
            style={{
              background: "#e6007a",
              borderColor: "#e6007a",
              fontWeight: 600,
            }}
          >
            Cambiar contraseña
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const MyProfile = () => {
  const { state } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {

        if (state.user) {
          // Usar los datos del usuario del contexto global

          setUser(state.user);
          setLoading(false);
        } else {
          // Si no hay usuario en el contexto, intentar cargar desde la API

          const response = await api.users.retrieve(
            state.user?.username || "me"
          );
          setUser(response);
          setLoading(false);
        }
      } catch (error) {

        message.error("No se pudo cargar el perfil");
        setLoading(false);
      }
    };

    loadUser();
  }, [state.user, refresh]);

  const handleUpdate = () => setRefresh((r) => !r);

  const isMobile = window.innerWidth < 768;

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <div>No se pudo cargar el perfil</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 32, color: "#e6007a" }}>
        Mi Perfil
      </Title>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <InfoPersonal
            user={user}
            onUpdate={handleUpdate}
            theme={state.algorithm}
          />
          <Seguridad user={user} theme={state.algorithm} />
          <InvitationsSection />
          <MyBranchesSection />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <InfoPersonal
                user={user}
                onUpdate={handleUpdate}
                theme={state.algorithm}
              />
            </Col>
            <Col xs={24} lg={12}>
              <Seguridad user={user} theme={state.algorithm} />
            </Col>
          </Row>
          <MyBranchesSection />
        </>
      )}
    </div>
  );
};

export default MyProfile;
