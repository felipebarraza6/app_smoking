/** @jsxImportSource @emotion/react */
import React, { useState, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  message,
  Modal,
  Image,
  Flex,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import api from "../api/endpoints";
import logo from "../assets/img/logo.png";
import Logo from "./../components/home/Logo";
import {
  loginContainer,
  formElements,
  titleContainer,
  formContainer,
} from "../assets/styles/pages/LoginStyles";

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [resetForm] = Form.useForm();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.auth.login(values);
      const token =
        response.data.access ||
        response.data.token ||
        response.data.access_token;
      const user = response.data.user || null;
      dispatch({ type: "LOGIN", payload: { token, user } });
      if (token) {
        message.success("¡Inicio de sesión exitoso!");
        navigate("/app/");
      } else {
        message.error("No se recibió token de autenticación.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Error al iniciar sesión";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setResetLoading(true);
    try {
      await api.users.forgot_password({ email: values.email });
      message.success(
        "Se ha enviado un enlace de recuperación a tu correo electrónico"
      );
      setResetModalVisible(false);
      resetForm.resetFields();
    } catch (error) {
      let errorMessage = "Error al enviar el email de recuperación";

      // Manejar diferentes tipos de errores de validación
      if (error.response?.data) {
        const errorData = error.response.data;

        // Error específico del campo email (formato de DRF)
        if (errorData.email && Array.isArray(errorData.email)) {
          errorMessage = errorData.email[0];
        }
        // Error general
        else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        // Error de validación general
        else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
        // Otros errores
        else if (errorData.error) {
          errorMessage = errorData.error;
        }
        // Si es un objeto con mensajes de error
        else if (typeof errorData === "object") {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === "string") {
            errorMessage = firstError;
          }
        }
      }

      message.error(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div css={loginContainer} translate="no">
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: "100vh", padding: 16 }}
      >
        <div
          css={formElements}
          style={{
            width: "100%",
            maxWidth: 380,
            minWidth: 0,
            boxSizing: "border-box",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 24,
              gap: 8,
            }}
          >
            <Image
              src={logo}
              preview={false}
              alt="logo"
              width={100}
              style={{ marginTop: 16, marginBottom: -24 }}
            />
            <Logo />
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: 260, margin: "0 auto" }}
            translate="no"
          >
            <div css={formContainer} style={{ width: "100%", marginBottom: 0 }}>
              <Form.Item
                name="email"
                label="Correo electrónico"
                rules={[
                  { required: true, message: "Por favor ingresa tu correo" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Correo electrónico"
                  autoComplete="email"
                  size="large"
                  translate="no"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu contraseña",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  size="large"
                  translate="no"
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    background: "#e6007a",
                    borderColor: "#e6007a",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                  translate="no"
                >
                  Entrar
                </Button>
              </Form.Item>
            </div>
          </Form>
          <Divider plain style={{ color: "#fff", margin: "16px 0 0 0" }}>
            o
          </Divider>
          <Button
            type="link"
            block
            onClick={() => setResetModalVisible(true)}
            style={{
              color: "#fff",
              fontWeight: 500,
              fontSize: 16,
              marginTop: 20,
              marginBottom: 10,
              paddingBottom: 20,
              width: "100%",
              textAlign: "center",
            }}
            translate="no"
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </div>
      </Flex>
      <Modal
        title="Recuperar contraseña"
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={null}
        destroyOnClose
        translate="no"
      >
        <Form
          form={resetForm}
          name="reset"
          onFinish={handleResetPassword}
          layout="vertical"
          translate="no"
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Correo electrónico"
              autoComplete="email"
              translate="no"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={resetLoading}
              translate="no"
            >
              Enviar enlace
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Login;
