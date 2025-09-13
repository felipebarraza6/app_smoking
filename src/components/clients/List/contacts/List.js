import React, { useContext } from "react";
import {
  List,
  Button,
  Flex,
  Typography,
  Popconfirm,
  App,
  Tag,
  Card,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  MailFilled,
  PhoneFilled,
  ContactsFilled,
  BuildFilled,
  IdcardOutlined,
  TeamOutlined,
  CrownOutlined,
  MessageOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ClientsContext } from "../../../../containers/Clients";
import { controller } from "../../../../controllers/clients";
import { AppContext } from "../../../../App";

const { Text, Paragraph } = Typography;

const ListContacts = ({ openSecond, setOpenSecond }) => {
  const { notification } = App.useApp();

  const { state, dispatch } = useContext(ClientsContext);
  const { state: appState } = useContext(AppContext);
  const contacts = state.contacts.list;

  // ✅ Función para obtener colores del tema
  const getThemeColors = () => {
    const isDark = appState?.algorithm === "dark";
    return {
      primary: isDark ? "#eb2f96" : "#722ed1", // magenta[6] : purple[7]
      background: isDark ? "#1f1f1f" : "#F0F2F2",
      cardBg: isDark ? "#262626" : "#ffffff",
      text: isDark ? "#ffffff" : "#000000",
      textSecondary: isDark ? "#d9d9d9" : "#666666",
      border: isDark ? "#434343" : "#d9d9d9",
      success: isDark ? "#52c41a" : "#52c41a",
      warning: isDark ? "#faad14" : "#faad14",
      error: isDark ? "#ff4d4f" : "#ff4d4f",
    };
  };

  const colors = getThemeColors();

  // ✅ Función para obtener color del tipo de contacto
  const getContactTypeColor = (contactType) => {
    const isDark = appState?.algorithm === "dark";
    const typeColors = {
      PRIMARY: isDark ? "magenta" : "purple",
      SECONDARY: isDark ? "cyan" : "blue",
      BILLING: isDark ? "orange" : "orange",
      TECHNICAL: isDark ? "magenta" : "purple",
      ADMINISTRATIVE: isDark ? "cyan" : "blue",
      DECISION_MAKER: isDark ? "red" : "red",
    };
    return typeColors[contactType] || "default";
  };

  // ✅ Función para obtener texto del tipo de contacto
  const getContactTypeText = (contactType) => {
    const texts = {
      PRIMARY: "Principal",
      SECONDARY: "Secundario",
      BILLING: "Facturación",
      TECHNICAL: "Técnico",
      ADMINISTRATIVE: "Administrativo",
      DECISION_MAKER: "Tomador de Decisiones",
    };
    return texts[contactType] || contactType;
  };

  const selectToEdit = (contact) => {
    controller.list_table.contacts.select_edit(contact, dispatch);
    setOpenSecond(true);
  };

  // ✅ Funciones para botones de acción
  const handleCall = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, "_self");
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, "_self");
    }
  };

  const handleWhatsApp = (phone) => {
    if (phone) {
      // Limpiar el número de teléfono para WhatsApp
      const cleanPhone = phone.replace(/[^\d]/g, "");
      window.open(`https://wa.me/${cleanPhone}`, "_blank");
    }
  };

  const renderItem = (item) => {
    // ✅ Construir nombre completo desde first_name y last_name
    const fullName =
      `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
      item.name ||
      "Sin nombre";

    return (
      <Card
        size="small"
        hoverable
        style={{
          borderRadius: "8px",
          margin: "4px",
          border: `1px solid ${colors.border}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
        bodyStyle={{ padding: "12px" }}
      >
        {/* ✅ Header compacto */}
        <Flex
          justify="space-between"
          align="center"
          style={{ marginBottom: "8px" }}
        >
          <Text strong style={{ fontSize: "14px", color: colors.primary }}>
            {fullName?.toUpperCase() || "Sin nombre"}
          </Text>
          {item.contact_type && (
            <Tag
              color={getContactTypeColor(item.contact_type)}
              icon={
                item.contact_type === "DECISION_MAKER" ? (
                  <CrownOutlined />
                ) : (
                  <UserOutlined />
                )
              }
              style={{ borderRadius: "12px", fontSize: "10px", margin: 0 }}
            >
              {getContactTypeText(item.contact_type)}
            </Tag>
          )}
        </Flex>

        {/* ✅ Información compacta */}
        <Flex vertical gap="4px" style={{ marginBottom: "8px" }}>
          {/* ✅ Cargo y Departamento en una línea */}
          <Flex gap="6px" wrap>
            {item.job_title_display && (
              <Tag
                icon={<BuildFilled />}
                color={colors.primary}
                style={{ borderRadius: "4px", fontSize: "11px", margin: 0 }}
              >
                <Text strong style={{ fontSize: "11px", color: colors.text }}>
                  {item.job_title_display}
                </Text>
              </Tag>
            )}
            {item.department_display &&
              item.department_display !== "Sin departamento" && (
                <Tag
                  icon={<TeamOutlined />}
                  color="success"
                  style={{ borderRadius: "4px", fontSize: "11px", margin: 0 }}
                >
                  <Text style={{ fontSize: "11px", color: colors.text }}>
                    {item.department_display}
                  </Text>
                </Tag>
              )}
          </Flex>

          {/* ✅ Información de contacto compacta */}
          <Flex vertical gap="2px">
            {item.email && (
              <Flex align="center" gap="6px">
                <MailFilled
                  style={{ color: colors.primary, fontSize: "12px" }}
                />
                <Text style={{ fontSize: "12px", color: colors.textSecondary }}>
                  {item.email.toLowerCase()}
                </Text>
              </Flex>
            )}
            {item.phone && (
              <Flex align="center" gap="6px">
                <PhoneFilled
                  style={{ color: colors.success, fontSize: "12px" }}
                />
                <Text style={{ fontSize: "12px", color: colors.textSecondary }}>
                  {item.phone}
                </Text>
              </Flex>
            )}
            {item.dni && (
              <Flex align="center" gap="6px">
                <IdcardOutlined
                  style={{ color: colors.warning, fontSize: "12px" }}
                />
                <Text style={{ fontSize: "12px", color: colors.textSecondary }}>
                  {item.dni}
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* ✅ Botones de acción compactos */}
        <Flex justify="space-between" align="center">
          <Flex gap="2px">
            {item.phone && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<PhoneOutlined />}
                  onClick={() => handleCall(item.phone)}
                  style={{
                    borderRadius: "4px",
                    height: "24px",
                    fontSize: "10px",
                    backgroundColor: colors.success,
                    borderColor: colors.success,
                  }}
                  title="Llamar"
                />
                <Button
                  type="default"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => handleWhatsApp(item.phone)}
                  style={{
                    borderRadius: "4px",
                    height: "24px",
                    fontSize: "10px",
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                  title="WhatsApp"
                />
              </>
            )}
            {item.email && (
              <Button
                type="default"
                size="small"
                icon={<MailFilled />}
                onClick={() => handleEmail(item.email)}
                style={{
                  borderRadius: "4px",
                  height: "24px",
                  fontSize: "10px",
                  borderColor: colors.border,
                  color: colors.text,
                }}
                title="Enviar email"
              />
            )}
          </Flex>

          <Flex gap="2px">
            <Button
              type="primary"
              onClick={() => selectToEdit(item)}
              size="small"
              icon={<EditOutlined />}
              style={{
                borderRadius: "4px",
                height: "24px",
                fontSize: "10px",
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              }}
              title="Editar contacto"
            />
            <Popconfirm
              title="¿Estás seguro de eliminar este contacto?"
              onConfirm={() =>
                controller.list_table.contacts.delete(
                  item,
                  dispatch,
                  notification
                )
              }
              okText="Sí"
              cancelText="No"
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{
                  borderRadius: "4px",
                  height: "24px",
                  fontSize: "10px",
                }}
                title="Eliminar contacto"
              />
            </Popconfirm>
          </Flex>
        </Flex>
      </Card>
    );
  };

  return (
    <List
      dataSource={contacts}
      extra={<ContactsFilled />}
      renderItem={renderItem}
      size="small"
    />
  );
};

export default ListContacts;
