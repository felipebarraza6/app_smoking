/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Image,
  Flex,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import logo from "../assets/img/logo.png";
import {
  loginContainer,
  formElements,
  titleContainer,
  formContainer,
} from "../assets/styles/pages/LoginStyles";
import api from "../api/endpoints";

const { Title } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.users.reset_password_confirm({
        token,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
      message.success("¡Contraseña restablecida exitosamente!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      let errorMessage = "Error al restablecer la contraseña";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) errorMessage = errorData.error;
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.new_password)
          errorMessage = errorData.new_password[0];
        else if (typeof errorData === "string") errorMessage = errorData;
        else if (typeof errorData === "object") {
          const firstError = Object.values(errorData)[0];
          if (Array.isArray(firstError)) errorMessage = firstError[0];
          else if (typeof firstError === "string") errorMessage = firstError;
        }
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div css={loginContainer}>
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
          <Image
            src={logo}
            preview={false}
            alt="logo"
            width={100}
            style={{ marginTop: 16, marginBottom: 8 }}
          />
          <h2 css={titleContainer} style={{ fontSize: 28, marginBottom: 8 }}>
            Restablecer Contraseña
          </h2>
          <Form
            form={form}
            name="reset_password"
            onFinish={onFinish}
            layout="vertical"
            style={{ width: "100%", maxWidth: 260, margin: "0 auto" }}
          >
            <div css={formContainer} style={{ width: "100%", marginBottom: 0 }}>
              <Form.Item
                name="new_password"
                label="Nueva contraseña"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu nueva contraseña",
                  },
                  {
                    min: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nueva contraseña"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label="Confirmar contraseña"
                dependencies={["new_password"]}
                rules={[
                  { required: true, message: "Confirma tu nueva contraseña" },
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
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirmar contraseña"
                  size="large"
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
                >
                  Restablecer
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Flex>
    </div>
  );
};

export default ResetPassword;
