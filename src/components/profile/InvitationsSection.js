import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  List,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
  Empty,
  Avatar,
  Row,
  Col,
  Divider,
} from "antd";
import {
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useBreakpoint } from "../../utils/breakpoints";
import api from "../../api/endpoints";
import { AppContext } from "../../App";

const { Title, Text } = Typography;

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

const InvitationsSection = () => {
  const { state } = useContext(AppContext);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const loadInvitations = async () => {
    setLoading(true);
    try {

      const response = await api.branchs.my_invitations();
      console.log("API Response my_invitations:", response); // Debug log

      // Asegurar que siempre sea un array
      const invitationsData = Array.isArray(response)
        ? response
        : response.data || [];

      setInvitations(invitationsData);

      if (invitationsData.length === 0) {

      } else {

      }
    } catch (error) {

      message.error("Error al cargar las invitaciones");
      setInvitations([]); // Asegurar que sea un array vacío
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleAcceptInvitation = async (branchId) => {
    try {
      await api.branchs.accept_invitation(branchId);
      message.success("Invitación aceptada exitosamente");
      loadInvitations(); // Recargar lista
    } catch (error) {

      message.error("Error al aceptar la invitación");
    }
  };

  const handleRejectInvitation = async (branchId) => {
    try {
      await api.branchs.reject_invitation(branchId);
      message.success("Invitación rechazada");
      loadInvitations(); // Recargar lista
    } catch (error) {

      message.error("Error al rechazar la invitación");
    }
  };

  if (invitations.length === 0) {
    return (
      <Card
        title={
          <Space>
            <MailOutlined />
            Invitaciones Pendientes
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Empty
          description="No tienes invitaciones pendientes"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <MailOutlined />
          Invitaciones Pendientes ({invitations.length})
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <List
        loading={loading}
        dataSource={invitations}
        renderItem={(invitation) => (
          <List.Item
            actions={
              isMobile
                ? []
                : [
                    <Button
                      type="primary"
                      icon={<CheckOutlined />}
                      size="small"
                      onClick={() =>
                        handleAcceptInvitation(invitation.branch.id)
                      }
                    >
                      Aceptar
                    </Button>,
                    <Popconfirm
                      title="¿Estás seguro de rechazar esta invitación?"
                      onConfirm={() =>
                        handleRejectInvitation(invitation.branch.id)
                      }
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button danger icon={<CloseOutlined />} size="small">
                        Rechazar
                      </Button>
                    </Popconfirm>,
                  ]
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#1890ff" }}
                />
              }
              title={
                <Space wrap>
                  <Text strong>
                    {invitation.branch?.business_name || "Sucursal sin nombre"}
                  </Text>
                  <Tag
                    color={ROLE_COLORS[invitation.role]}
                    icon={<ClockCircleOutlined />}
                  >
                    {ROLE_LABELS[invitation.role]}
                  </Tag>
                </Space>
              }
              description={
                <div>
                  <Space
                    direction="vertical"
                    size={0}
                    style={{ width: "100%" }}
                  >
                    <Text type="secondary">
                      <EnvironmentOutlined style={{ marginRight: 8 }} />
                      {invitation.branch?.address || "Sin dirección"},{" "}
                      {invitation.branch?.commune || "Sin comuna"}
                    </Text>
                    <Text type="secondary">
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {invitation.branch?.phone || "Sin teléfono"}
                    </Text>
                    <Text type="secondary">
                      👤 Invitado por: {invitation.invited_by_name || "Sistema"}
                    </Text>
                    <Text type="secondary">
                      📅{" "}
                      {new Date(invitation.invited_at).toLocaleDateString(
                        "es-CL"
                      )}
                    </Text>
                  </Space>

                  {/* Botones para móvil */}
                  {isMobile && (
                    <>
                      <Divider style={{ margin: "12px 0" }} />
                      <Row gutter={8}>
                        <Col span={12}>
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            block
                            onClick={() =>
                              handleAcceptInvitation(invitation.branch.id)
                            }
                          >
                            Aceptar
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Popconfirm
                            title="¿Estás seguro de rechazar esta invitación?"
                            onConfirm={() =>
                              handleRejectInvitation(invitation.branch.id)
                            }
                            okText="Sí"
                            cancelText="No"
                          >
                            <Button
                              danger
                              icon={<CloseOutlined />}
                              size="small"
                              block
                            >
                              Rechazar
                            </Button>
                          </Popconfirm>
                        </Col>
                      </Row>
                    </>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default InvitationsSection;
