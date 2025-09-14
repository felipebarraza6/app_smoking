import React from "react";
import { Typography, Card, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function UsersSection({ token }) {
  return (
    <>
      <Title level={3}>
        <UserOutlined style={{ marginRight: 8 }} />
        Usuarios y Permisos
      </Title>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 32,
          justifyContent: "flex-start",
          minWidth: 0,
          width: "100%",
        }}
      >
        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Crear Usuario
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Agrega nuevos usuarios al sistema con roles específicos.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Datos personales</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Asignar rol</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Configurar sucursal
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Establecer contraseña
            </li>
          </ol>
        </Card>

        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Roles Disponibles
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Diferentes niveles de acceso según responsabilidades.
          </Paragraph>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Tag color="red">Administrador</Tag>
            <Tag color="blue">Vendedor</Tag>
            <Tag color="green">Cajero</Tag>
            <Tag color="orange">Inventario</Tag>
            <Tag color="purple">Repartidor</Tag>
          </div>
        </Card>

        <Card
          hoverable
          bordered={false}
          style={{
            background: token.colorBgContainer,
            color: token.colorText,
            borderRadius: 14,
            minWidth: 220,
            maxWidth: 260,
            flex: "1 1 220px",
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚙️</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
            Gestión
          </div>
          <Paragraph style={{ margin: "8px 0 16px 0" }}>
            Administra usuarios existentes y sus permisos.
          </Paragraph>
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            <li style={{ marginBottom: 8, fontSize: 15 }}>Editar datos</li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Cambiar contraseña
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Activar/desactivar
            </li>
            <li style={{ marginBottom: 8, fontSize: 15 }}>
              Modificar permisos
            </li>
          </ol>
        </Card>
      </div>
    </>
  );
}

export default UsersSection;
