import React from "react";
import { Card, Alert, Space, Typography, Button, Divider } from "antd";
import {
  InfoCircleOutlined,
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const DriverSystemInfo = () => {
  return (
    <Card
      title={
        <Space>
          <InfoCircleOutlined />
          <span>Nuevo Sistema de Conductores</span>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Alert
          message="Sistema Actualizado"
          description="El sistema de conductores ha sido completamente refactorizado para integrarse con el sistema de usuarios y sucursales."
          type="info"
          showIcon
        />

        <div>
          <Title level={5}>
            <UserOutlined /> ¿Cómo crear un nuevo conductor?
          </Title>
          <Space direction="vertical" size="small">
            <Text>
              1. Ve a <strong>Usuarios → Crear Usuario</strong>
            </Text>
            <Text>2. Completa los datos del usuario</Text>
            <Text>
              3. Selecciona el rol <strong>"Conductor"</strong>
            </Text>
            <Text>4. Asigna a una sucursal</Text>
            <Text>
              5. Regresa aquí para crear el <strong>Perfil de Conductor</strong>
            </Text>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={5}>
            <CarOutlined /> Perfil de Conductor
          </Title>
          <Space direction="vertical" size="small">
            <Text>• Información del vehículo (patente, modelo, año)</Text>
            <Text>• Sistema de tarifas avanzado</Text>
            <Text>• Licencia de conducir</Text>
            <Text>• Configuración de disponibilidad</Text>
            <Text>• Métricas de rendimiento</Text>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={5}>
            <DollarOutlined /> Sistema de Tarifas
          </Title>
          <Space direction="vertical" size="small">
            <Text>• Tarifa base por entrega</Text>
            <Text>• Costo por kilómetro</Text>
            <Text>• Precios por zona</Text>
            <Text>• Precios por tipo de entrega</Text>
            <Text>• Tarifas mínimas y máximas</Text>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={5}>
            <CheckCircleOutlined /> Beneficios del Nuevo Sistema
          </Title>
          <Space direction="vertical" size="small">
            <Text>✅ Integración completa con usuarios y sucursales</Text>
            <Text>✅ Sistema de tarifas flexible y avanzado</Text>
            <Text>✅ Gestión de disponibilidad en tiempo real</Text>
            <Text>✅ Métricas de rendimiento y calificaciones</Text>
            <Text>✅ Cálculo automático de costos de entrega</Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default DriverSystemInfo;
