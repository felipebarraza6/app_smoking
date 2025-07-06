import React, { useState, useEffect, useContext } from "react";
import { Card, Typography, Button, Space, theme, Spin } from "antd";
import { RocketOutlined, ReloadOutlined } from "@ant-design/icons";
import { PING } from "../api/config";
import { ConnectionContext } from "../context/ConnectionContext";
import { useNavigate, useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const StatusPage = () => {
  const { isConnected, setIsConnected } = useContext(ConnectionContext);
  const [status, setStatus] = useState(isConnected ? "online" : "offline");
  const [lastCheck, setLastCheck] = useState(null);
  const [backendMsg, setBackendMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const checkStatus = async () => {
    setLoading(true);
    setStatus("checking");
    try {
      const response = await PING();
      if (response.status === 200) {
        setStatus("online");
        setBackendMsg(response.data.message || "");
        setIsConnected(true);
      } else {
        setStatus("offline");
        setBackendMsg("");
        setIsConnected(false);
      }
    } catch (e) {
      setStatus("offline");
      setBackendMsg("");
      setIsConnected(false);
    } finally {
      setLastCheck(new Date());
      setLoading(false);
    }
  };

  // Animación minimalista de cohete flotando
  const rocketStyle = {
    fontSize: 80,
    color: status === "online" ? token.colorSuccess : token.colorError,
    transition: "color 0.3s",
    animation:
      status === "online" ? "floatRocket 2s ease-in-out infinite" : "none",
    filter:
      status === "online"
        ? "drop-shadow(0 0 8px #52c41a88)"
        : "drop-shadow(0 0 8px #ff4d4f88)",
  };

  return (
    <Space
      direction="vertical"
      align="center"
      style={{ width: "100%", marginTop: 60 }}
    >
      <Card
        style={{
          maxWidth: 400,
          textAlign: "center",
          background: token.colorBgElevated,
          boxShadow: token.boxShadow,
        }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ marginBottom: 24 }}>
          <span style={rocketStyle}>
            <RocketOutlined />
          </span>
        </div>
        <Title level={2} style={{ marginBottom: 0 }}>
          {status === "online"
            ? "¡Todo en órbita!"
            : status === "checking"
            ? "Verificando conexión..."
            : "Sin conexión con el servidor"}
        </Title>
        <Text type={status === "online" ? "success" : "danger"}>
          {status === "online"
            ? backendMsg || "Conectado al servidor"
            : status === "offline"
            ? "No se pudo conectar al servidor central."
            : ""}
        </Text>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Última verificación:{" "}
            {lastCheck ? lastCheck.toLocaleTimeString() : "-"}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={checkStatus}
          loading={loading}
          style={{
            marginTop: 24,
            background:
              status === "online" ? token.colorSuccess : token.colorPrimary,
            borderColor:
              status === "online" ? token.colorSuccess : token.colorPrimary,
            color: "#fff",
            animation:
              status === "online"
                ? "pulseGreen 1.2s infinite alternate"
                : "none",
          }}
          type={status === "online" ? "default" : "primary"}
        >
          Volver a verificar
        </Button>
      </Card>
      <style>{`
        @keyframes floatRocket {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 ${token.colorSuccess}44; }
          100% { box-shadow: 0 0 12px 4px ${token.colorSuccess}88; }
        }
      `}</style>
    </Space>
  );
};

export default StatusPage;
