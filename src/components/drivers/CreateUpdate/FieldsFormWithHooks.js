import React, { useMemo, useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Row,
  Col,
  Divider,
  Switch,
  Space,
  Typography,
  Card,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  BankOutlined,
  DollarOutlined,
  PlusOutlined,
  UndoOutlined,
  IdcardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";

const { Text } = Typography;

const FieldsForm = ({
  form,
  userBranches,
  selectedDriver,
  onClearSelection,
}) => {
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Memoizar las opciones de sucursales
  const branchOptions = useMemo(() => {
    return userBranches.map((branch) => ({
      value: branch.id,
      label: branch.business_name,
    }));
  }, [userBranches]);

  // Efecto para determinar si estamos creando un usuario nuevo
  useEffect(() => {
    setIsCreatingUser(!selectedDriver);
  }, [selectedDriver]);

  return (
    <>
      {/* Sección de Usuario */}
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        <UserOutlined /> Datos del Usuario
      </Divider>

      {isCreatingUser ? (
        <Card
          size="small"
          style={{ marginBottom: 16, backgroundColor: "#f0f2f5" }}
        >
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              💡 <strong>Nuevo Sistema:</strong> Los conductores ahora son
              usuarios con rol DRIVER. Primero crea el usuario y luego asigna el
              perfil de conductor.
            </Text>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              Ve a <strong>Usuarios → Crear Usuario</strong> y selecciona el rol
              "Conductor" para crear un nuevo conductor.
            </Text>
          </Space>
        </Card>
      ) : (
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Text strong>
            Usuario: {selectedDriver?.user?.first_name}{" "}
            {selectedDriver?.user?.last_name}
          </Text>
          <Text type="secondary">{selectedDriver?.user?.email}</Text>
        </Space>
      )}

      {/* Sección de Vehículo */}
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        <CarOutlined /> Información del Vehículo
      </Divider>

      <Form.Item
        name="vehicle_plate"
        rules={[{ required: true, message: "Por favor ingresa la patente" }]}
      >
        <Input
          prefix={<CarOutlined />}
          autoComplete="off"
          placeholder="Patente del vehículo"
        />
      </Form.Item>

      <Form.Item name="vehicle_model">
        <Input
          autoComplete="off"
          placeholder="Modelo del vehículo (opcional)"
        />
      </Form.Item>

      <Form.Item name="vehicle_year">
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Año del vehículo (opcional)"
          min={1900}
          max={new Date().getFullYear() + 1}
        />
      </Form.Item>

      {/* Sección de Tarifas */}
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        <DollarOutlined /> Sistema de Tarifas
      </Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="base_delivery_fee"
            rules={[
              { required: true, message: "Por favor ingresa la tarifa base" },
            ]}
          >
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Tarifa base"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="price_per_km"
            rules={[
              { required: true, message: "Por favor ingresa el precio por km" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Precio por km"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="min_delivery_fee"
            rules={[
              { required: true, message: "Por favor ingresa la tarifa mínima" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Tarifa mínima"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="max_delivery_fee"
            rules={[
              { required: true, message: "Por favor ingresa la tarifa máxima" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Tarifa máxima"
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Sección de Licencia */}
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        <IdcardOutlined /> Licencia de Conducir
      </Divider>

      <Form.Item name="license_number">
        <Input
          prefix={<IdcardOutlined />}
          autoComplete="off"
          placeholder="Número de licencia (opcional)"
        />
      </Form.Item>

      <Form.Item name="license_expiry">
        <Input
          prefix={<CalendarOutlined />}
          autoComplete="off"
          placeholder="Fecha de vencimiento (YYYY-MM-DD)"
        />
      </Form.Item>

      {/* Sección de Configuración */}
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        <CheckCircleOutlined /> Configuración
      </Divider>

      <Form.Item
        name="branch"
        rules={[
          { required: true, message: "Por favor selecciona una sucursal" },
        ]}
      >
        <Select
          options={branchOptions}
          placeholder="Selecciona una sucursal"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        name="is_available"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch
          checkedChildren="Disponible"
          unCheckedChildren="No disponible"
        />
      </Form.Item>

      <Form.Item name="max_delivery_distance">
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Distancia máxima de entrega (km)"
          min={0}
          max={1000}
        />
      </Form.Item>

      <Form.Item>
        <Row
          justify={"space-evenly"}
          gutter={[
            { xs: 12, xl: 12 },
            { xl: 5, xs: 5 },
          ]}
        >
          <Button
            icon={selectedDriver ? <UndoOutlined /> : <PlusOutlined />}
            type="primary"
            htmlType="submit"
            block
            size="small"
            disabled={isCreatingUser}
          >
            {selectedDriver ? "Actualizar Perfil" : "Crear Perfil"}
          </Button>
          <Button
            icon={selectedDriver ? <PlusOutlined /> : <UndoOutlined />}
            htmlType="button"
            onClick={onClearSelection}
            block
            size="small"
          >
            {selectedDriver ? "Nuevo Perfil" : "Limpiar"}
          </Button>
        </Row>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
