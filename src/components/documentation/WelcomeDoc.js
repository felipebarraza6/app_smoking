import React, { useContext } from "react";
import { Typography, Card, Divider, Row, Col, Tag, Flex } from "antd";
import {
  SmileOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import logo from "../../assets/img/logo.png";
import logo_white from "../../assets/img/logo_white.png";
import logo_black from "../../assets/img/logo_black.png";
import { useToken } from "antd/es/theme/internal";
import { AppContext } from "../../App";

const { Title, Paragraph, Text } = Typography;

const WelcomeDoc = () => {
  const { state } = useContext(AppContext);

  return (
    <Row justify="center" style={{ marginBottom: 20 }}>
      <Col xs={24} sm={20} md={16} lg={14} xl={20}>
        <Card
          bordered
          style={{
            borderRadius: 16,
            boxShadow: "0 4px 24px 0 rgba(44,0,122,0.08)",
          }}
        >
          <Flex
            justify="center"
            align="center"
            vertical
            style={{ textAlign: "center", marginBottom: 24 }}
          >
            <Flex>
              <img
                src={state.algorithm === "dark" ? logo_white : logo_black}
                alt="logo"
                style={{
                  width: "200px",
                  objectFit: "contain",
                }}
              />
            </Flex>
            <Flex>
              <Text type="secondary" style={{ fontSize: 18 }}>
                Plataforma integral de gestión para empresas modernas
              </Text>
            </Flex>
          </Flex>
          <Divider />
          <Paragraph style={{ fontSize: 16 }}>
            <b>Smoking ERP</b> es una solución digital todo-en-uno para la
            administración de ventas, pedidos, sucursales, clientes y mucho más.
            Diseñada para empresas que buscan eficiencia, control y
            escalabilidad en sus operaciones.
          </Paragraph>
          <Paragraph>
            <b>Objetivo:</b> Centralizar y simplificar la gestión comercial,
            permitiendo a cada empresa y usuario operar de forma segura, aislada
            y eficiente.
          </Paragraph>
          <Divider />
          <Title level={4} style={{ marginTop: 24 }}>
            Módulos principales
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Tag color="magenta" icon={<ShopOutlined />}>
                Sucursales
              </Tag>
              <Paragraph>
                Gestión de tiendas, acceso por roles y multiempresa.
              </Paragraph>
              <Tag color="blue" icon={<SolutionOutlined />}>
                Ventas & Pedidos
              </Tag>
              <Paragraph>Control total de ventas, pedidos y estados.</Paragraph>
              <Tag color="green" icon={<TeamOutlined />}>
                Usuarios & Roles
              </Tag>
              <Paragraph>
                Permisos avanzados, multiusuario y seguridad.
              </Paragraph>
            </Col>
            <Col xs={24} sm={12}>
              <Tag color="purple" icon={<SmileOutlined />}>
                Clientes
              </Tag>
              <Paragraph>Base de datos de clientes y contactos.</Paragraph>
              <Tag color="orange">Productos</Tag>
              <Paragraph>Catálogo, stock y gestión de productos.</Paragraph>
              <Tag color="gold">Pagos & Boletas</Tag>
              <Paragraph>Registro de pagos y boletas electrónicas.</Paragraph>
            </Col>
          </Row>
          <Divider />
          <Paragraph style={{ fontSize: 15, textAlign: "center" }}>
            <b>¿A quién está dirigido?</b>
            <br />A empresas y grupos que buscan una plataforma moderna, segura
            y colaborativa para gestionar todas sus operaciones comerciales.
          </Paragraph>
        </Card>
      </Col>
    </Row>
  );
};

export default WelcomeDoc;
