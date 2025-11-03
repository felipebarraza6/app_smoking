import React from "react";
import { Menu, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import {
  InfoCircleOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  BarChartOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  CarOutlined,
  CreditCardOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const SIDEBAR_WIDTH = 220; // Debe coincidir con el sidebar principal

const sections = [
  {
    key: "bienvenida",
    label: (
      <>
        <SmileOutlined style={{ marginRight: 8 }} />
        Bienvenido/a
      </>
    ),
  },
  {
    key: "indicators",
    label: (
      <>
        <BarChartOutlined style={{ marginRight: 8 }} />
        Indicadores
      </>
    ),
  },
  {
    key: "orders",
    label: (
      <>
        <InfoCircleOutlined style={{ marginRight: 8 }} />
        Pedidos
      </>
    ),
  },
  {
    key: "sales",
    label: (
      <>
        <ShoppingCartOutlined style={{ marginRight: 8 }} />
        Ventas
      </>
    ),
  },
  {
    key: "payments",
    label: (
      <>
        <DollarCircleOutlined style={{ marginRight: 8 }} />
        Pagos
      </>
    ),
  },
  {
    key: "receipts",
    label: (
      <>
        <FileTextOutlined style={{ marginRight: 8 }} />
        Boletas
      </>
    ),
  },
  {
    key: "users",
    label: (
      <>
        <UserOutlined style={{ marginRight: 8 }} />
        Usuarios
      </>
    ),
  },
  {
    key: "stores",
    label: (
      <>
        <HomeOutlined style={{ marginRight: 8 }} />
        Tiendas
      </>
    ),
  },
  {
    key: "products",
    label: (
      <>
        <AppstoreOutlined style={{ marginRight: 8 }} />
        Productos
      </>
    ),
  },
  {
    key: "delivery",
    label: (
      <>
        <CarOutlined style={{ marginRight: 8 }} />
        Repartidores
      </>
    ),
  },
  {
    key: "clients",
    label: (
      <>
        <UserOutlined style={{ marginRight: 8 }} />
        Clientes
      </>
    ),
  },
  {
    key: "payment-methods",
    label: (
      <>
        <CreditCardOutlined style={{ marginRight: 8 }} />
        Métodos de Pago
      </>
    ),
  },
  {
    key: "api",
    label: "API",
    children: [
      {
        key: "api-doc",
        label: (
          <>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Documentación API
          </>
        ),
      },
    ],
  },
];

function Sidebar({
  selectedKey,
  setSelectedKey,
  mobile,
  visible,
  onClose,
  token,
}) {
  if (mobile) {
    return (
      <Drawer
        open={visible}
        onClose={onClose}
        placement="left"
        width={SIDEBAR_WIDTH}
        bodyStyle={{ padding: 0, background: token.colorBgContainer }}
        headerStyle={{
          background: token.colorBgContainer,
          color: token.colorText,
        }}
        closeIcon={<MenuOutlined style={{ color: token.colorText }} />}
      >
        <Menu
          mode="inline"
          defaultOpenKeys={["api"]}
          selectedKeys={[selectedKey]}
          items={sections}
          onClick={({ key }) => {
            setSelectedKey(key);
            if (mobile && onClose) onClose();
          }}
          style={{
            height: "100%",
            fontWeight: 500,
            background: token.colorBgContainer,
            color: token.colorText,
          }}
        />
      </Drawer>
    );
  }

  // --- Sticky puro con CSS, sin height: 100vh, para que sticky funcione bien ---
  return (
    <div
      style={{
        width: SIDEBAR_WIDTH,
        minWidth: SIDEBAR_WIDTH,
        position: "sticky", // Sticky puro
        top: 0,
        left: 0,
        background: "transparent",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Menu
        mode="inline"
        defaultOpenKeys={["api"]}
        selectedKeys={[selectedKey]}
        items={sections}
        onClick={({ key }) => {
          setSelectedKey(key);
          if (mobile && onClose) onClose();
        }}
        style={{
          fontWeight: 500,
          background: "transparent",
          color: token.colorText,
          border: "none",
          width: "100%",
        }}
      />
    </div>
  );
}

export default Sidebar;
