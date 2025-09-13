import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Row,
  Col,
  Divider,
  message,
} from "antd";
import {
  CarOutlined,
  DollarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  IdcardOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import api from "../../api/endpoints";

const { Text, Title } = Typography;
const { Option } = Select;

const DriverProfileManager = ({ user, onUpdate }) => {
  const [driverProfile, setDriverProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Cargar perfil de conductor del usuario
  const loadDriverProfile = async () => {
    if (!user || user.branch_access?.role !== "DRIVER") return;

    setLoading(true);
    try {
      // Buscar el perfil de conductor del usuario
      const response = await api.drivers.list(1, {
        user: user.id,
        branch: user.branch_access?.branch_id,
      });

      if (response.results && response.results.length > 0) {
        setDriverProfile(response.results[0]);
      } else {
        setDriverProfile(null);
      }
    } catch (error) {
      console.error("Error loading driver profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverProfile();
  }, [user]);

  // Crear o actualizar perfil de conductor
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (driverProfile) {
        // Actualizar
        await api.drivers.update(driverProfile.id, values);
        message.success("Perfil de conductor actualizado");
      } else {
        // Crear
        const newProfile = {
          ...values,
          user: user.id,
          branch: user.branch_access?.branch_id,
        };
        await api.drivers.create(newProfile);
        message.success("Perfil de conductor creado");
      }

      await loadDriverProfile();
      setModalVisible(false);
      form.resetFields();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error("Error al guardar perfil de conductor");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar perfil de conductor
  const handleDelete = async () => {
    if (!driverProfile) return;

    Modal.confirm({
      title: "¿Eliminar perfil de conductor?",
      content: "Esta acción no se puede deshacer.",
      onOk: async () => {
        setLoading(true);
        try {
          await api.drivers.delete(driverProfile.id);
          message.success("Perfil de conductor eliminado");
          await loadDriverProfile();
          if (onUpdate) onUpdate();
        } catch (error) {
          message.error("Error al eliminar perfil de conductor");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Abrir modal para crear/editar
  const openModal = () => {
    if (driverProfile) {
      form.setFieldsValue(driverProfile);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  if (user?.branch_access?.role !== "DRIVER") {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <CarOutlined />
          <span>Perfil de Conductor</span>
        </Space>
      }
      size="small"
      style={{ marginTop: 16 }}
      extra={
        <Space>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={openModal}
            disabled={loading}
          >
            {driverProfile ? "Editar" : "Crear"} Perfil
          </Button>
          {driverProfile && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              disabled={loading}
            />
          )}
        </Space>
      }
    >
      {driverProfile ? (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Vehículo:</Text>
              <br />
              <Tag color="blue" icon={<CarOutlined />}>
                {driverProfile.vehicle_plate || "Sin patente"}
              </Tag>
              {driverProfile.vehicle_model && (
                <Tag color="cyan">{driverProfile.vehicle_model}</Tag>
              )}
            </Col>
            <Col span={12}>
              <Text strong>Disponibilidad:</Text>
              <br />
              <Tag color={driverProfile.is_available ? "green" : "red"}>
                {driverProfile.is_available ? "Disponible" : "No disponible"}
              </Tag>
            </Col>
          </Row>

          <Divider style={{ margin: "8px 0" }} />

          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Tarifas:</Text>
              <br />
              <Tag color="green" icon={<DollarOutlined />}>
                Base: ${driverProfile.base_delivery_fee}
              </Tag>
              <br />
              <Tag color="orange">/km: ${driverProfile.price_per_km}</Tag>
            </Col>
            <Col span={12}>
              <Text strong>Rendimiento:</Text>
              <br />
              <Text>Entregas: {driverProfile.total_deliveries || 0}</Text>
              <br />
              <Text>Ganancias: ${driverProfile.total_earnings || 0}</Text>
            </Col>
          </Row>

          {driverProfile.license_number && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <Text strong>Licencia:</Text>
              <br />
              <Tag icon={<IdcardOutlined />}>
                {driverProfile.license_number}
              </Tag>
              {driverProfile.license_expiry && (
                <Tag icon={<CalendarOutlined />}>
                  Vence: {driverProfile.license_expiry}
                </Tag>
              )}
            </>
          )}
        </Space>
      ) : (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text type="secondary">
            Este usuario tiene rol de conductor pero no tiene perfil creado.
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Crea un perfil para configurar vehículo, tarifas y disponibilidad.
          </Text>
        </Space>
      )}

      <Modal
        title={
          driverProfile
            ? "Editar Perfil de Conductor"
            : "Crear Perfil de Conductor"
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider orientation="left">Información del Vehículo</Divider>

          <Form.Item
            name="vehicle_plate"
            label="Patente"
            rules={[{ required: true, message: "Ingresa la patente" }]}
          >
            <Input
              prefix={<CarOutlined />}
              placeholder="Patente del vehículo"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="vehicle_model" label="Modelo">
                <Input placeholder="Modelo del vehículo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vehicle_year" label="Año">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Año del vehículo"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Sistema de Tarifas</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="base_delivery_fee"
                label="Tarifa Base"
                rules={[{ required: true, message: "Ingresa la tarifa base" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="$"
                  placeholder="Tarifa base"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price_per_km"
                label="Precio por KM"
                rules={[
                  { required: true, message: "Ingresa el precio por km" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="$"
                  placeholder="Precio por km"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="min_delivery_fee"
                label="Tarifa Mínima"
                rules={[
                  { required: true, message: "Ingresa la tarifa mínima" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="$"
                  placeholder="Tarifa mínima"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="max_delivery_fee"
                label="Tarifa Máxima"
                rules={[
                  { required: true, message: "Ingresa la tarifa máxima" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  prefix="$"
                  placeholder="Tarifa máxima"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Licencia de Conducir</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="license_number" label="Número de Licencia">
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="Número de licencia"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="license_expiry" label="Fecha de Vencimiento">
                <Input prefix={<CalendarOutlined />} placeholder="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Configuración</Divider>

          <Form.Item
            name="is_available"
            label="Disponibilidad"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Disponible"
              unCheckedChildren="No disponible"
            />
          </Form.Item>

          <Form.Item name="max_delivery_distance" label="Distancia Máxima (km)">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Distancia máxima de entrega"
              min={0}
              max={1000}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {driverProfile ? "Actualizar" : "Crear"} Perfil
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancelar
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DriverProfileManager;
