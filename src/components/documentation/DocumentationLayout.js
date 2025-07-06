import React, { useState } from "react";
import {
  Layout,
  FloatButton,
  theme,
  Typography,
  Divider,
  Affix,
  Space,
  Card,
} from "antd";
import {
  MenuOutlined,
  MailOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useBreakpoint, isMobile } from "../../utils/breakpoints";
import Sidebar from "./Sidebar";
import CodeBlock from "./CodeBlock";
import WelcomeDoc from "./WelcomeDoc";

// Import sections
import IndicatorsSection from "./sections/IndicatorsSection";
import OrdersSection from "./sections/OrdersSection";
import SalesSection from "./sections/SalesSection";
import PaymentsSection from "./sections/PaymentsSection";
import ReceiptsSection from "./sections/ReceiptsSection";
import UsersSection from "./sections/UsersSection";
import ApiDocSection from "./sections/ApiDocSection";
import StoresSection from "./sections/StoresSection";
import ProductsSection from "./sections/ProductsSection";
import DeliverySection from "./sections/DeliverySection";
import ClientsSection from "./sections/ClientsSection";
import PaymentMethodsSection from "./sections/PaymentMethodsSection";

const { Content } = Layout;
const { Title, Paragraph, Link } = Typography;

// Contact card component
function ContactCard({ icon, title, value, link, token, style }) {
  return (
    <Card
      hoverable
      bordered={false}
      style={{
        background: token.colorBgContainer,
        color: token.colorText,
        borderRadius: 14,
        boxShadow: token.boxShadowSecondary,
        display: "flex",
        alignItems: "center",
        padding: 0,
        ...style,
      }}
      bodyStyle={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <span style={{ fontSize: 28, minWidth: 32 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
        {link ? (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: token.colorPrimary,
              fontWeight: 500,
              wordBreak: "break-all",
              overflowWrap: "anywhere",
              display: "inline-block",
              maxWidth: "100%",
              userSelect: "all",
            }}
          >
            {value}
          </Link>
        ) : (
          <span style={{ fontWeight: 500, userSelect: "all" }}>{value}</span>
        )}
      </div>
    </Card>
  );
}

// Content mapping
const contentMap = (token) => ({
  bienvenida: <WelcomeDoc token={token} />,
  indicators: <IndicatorsSection token={token} />,
  orders: <OrdersSection token={token} />,
  sales: <SalesSection token={token} />,
  payments: <PaymentsSection token={token} />,
  receipts: <ReceiptsSection token={token} />,
  users: <UsersSection token={token} />,
  stores: <StoresSection token={token} />,
  products: <ProductsSection token={token} />,
  delivery: <DeliverySection token={token} />,
  clients: <ClientsSection token={token} />,
  "payment-methods": <PaymentMethodsSection token={token} />,
  "api-doc": <ApiDocSection token={token} />,
});

function DocumentationLayout() {
  const breakpoint = useBreakpoint();
  const mobile = isMobile(breakpoint);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { token } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("bienvenida");

  // --- IMPORTANTE: No ocultar el overflow global (body/html) ---
  // Si ocultas el overflow global, los modals y drawers de Ant Design pueden quedar "tapados"
  // y el scroll de otras partes de la app puede romperse. El único overflow-y: auto debe estar
  // en el contenedor de la documentación (el div que envuelve sidebar y content).
  // Así, el layout es profesional, responsivo y sin bugs de overlays ni scrolls indeseados.

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        background: token.colorBgLayout,
        overflow: "hidden", // Solo un scroll
      }}
    >
      {/* Botón móvil */}
      {mobile && (
        <FloatButton
          icon={<MenuOutlined />}
          style={{
            left: 16,
            top: 24,
            background: token.colorBgContainer,
            color: token.colorText,
          }}
          onClick={() => setDrawerOpen(true)}
          shape="circle"
        />
      )}

      {/* Sidebar */}
      {!mobile && (
        <div
          style={{
            top: 0,
            left: 0,
            background: "transparent",
            flexDirection: "column",
          }}
        >
          <Affix offsetTop={0}>
            <Sidebar
              selectedKey={selectedKey}
              setSelectedKey={setSelectedKey}
              mobile={mobile}
              visible={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              token={token}
            />
          </Affix>
        </div>
      )}

      {/* Content principal, un solo scroll, width 100% */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          marginLeft: !mobile ? 28 : 0,
          paddingTop: mobile ? 80 : 24,
          paddingBottom: 24,
          paddingLeft: mobile ? 16 : 0,
          paddingRight: mobile ? 16 : 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            overflowY: "auto", // El único scroll permitido
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {/* Mostrar solo la sección seleccionada */}
          {contentMap(token)[selectedKey]}
          <Content
            style={{
              width: "100%",
              color: token.colorText,
              boxShadow: token.boxShadowSecondary,
              border: `1.5px solid ${token.colorBorderSecondary}`,
              margin: 0,
              padding: mobile ? 16 : 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              boxSizing: "border-box",
              alignSelf: "center",
            }}
          >
            <Divider style={{ borderColor: token.colorBorderSecondary }} />
            <Paragraph
              type="secondary"
              style={{ marginTop: 32, color: token.colorTextSecondary }}
            >
              ¿Tienes dudas? Contacta a soporte o revisa la documentación
              oficial.
            </Paragraph>
            <Divider />
            <Title level={5} style={{ marginTop: 32, marginBottom: 0 }}>
              Soporte y contacto
            </Title>
            <Space
              wrap
              align="center"
              size={24}
              style={{
                width: "100%",
                justifyContent: "center",
                margin: "24px 0 0 0",
              }}
            >
              <ContactCard
                icon={<MailOutlined />}
                title="Correo"
                value="felipe.barraza.vega@icloud.com"
                link="mailto:felipe.barraza.vega@icloud.com"
                token={token}
                style={{
                  minWidth: mobile ? "100%" : 220,
                  flex: mobile ? "1 1 100%" : "1 1 320px",
                  wordBreak: "break-all",
                }}
              />
              <ContactCard
                icon={<WhatsAppOutlined style={{ color: "#25D366" }} />}
                title="WhatsApp"
                value={
                  <span style={{ userSelect: "all" }}>+56 9 3393 2112</span>
                }
                link="https://wa.me/56933932112"
                token={token}
                style={{
                  minWidth: mobile ? "100%" : 220,
                  flex: mobile ? "1 1 100%" : "1 1 220px",
                }}
              />
              <ContactCard
                icon={<LinkedinOutlined style={{ color: "#0077b5" }} />}
                title="LinkedIn"
                value="Perfil profesional"
                link="https://www.linkedin.com/in/luis-felipe-andr%C3%A9s-barraza-vega-56692551/"
                token={token}
                style={{
                  minWidth: mobile ? "100%" : 220,
                  flex: mobile ? "1 1 100%" : "1 1 220px",
                }}
              />
              <ContactCard
                icon={<InstagramOutlined style={{ color: "#E1306C" }} />}
                title="Instagram"
                value="Agregar link"
                link="#"
                token={token}
                style={{
                  minWidth: mobile ? "100%" : 220,
                  flex: mobile ? "1 1 100%" : "1 1 220px",
                }}
              />
            </Space>
          </Content>
        </div>
      </div>

      {/* Sidebar móvil */}
      {mobile && (
        <Sidebar
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          mobile={mobile}
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          token={token}
        />
      )}
    </div>
  );
}

export default DocumentationLayout;
