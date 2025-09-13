import React from "react";
import {
  Row,
  Col,
  Tag,
  Button,
  Popconfirm,
  Descriptions,
  Space,
  Typography,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  CarOutlined,
  DollarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";

const { Text } = Typography;

export const defaultColumn = (onSelectDriver, onDeleteDriver, notification) => [
  {
    title: "Conductor",
    width: 200,
    render: (x) => (
      <Row>
        <Col span={24}>
          <Text strong>
            {x.user?.first_name} {x.user?.last_name}
          </Text>
        </Col>
        <Col span={24}>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {x.user?.email}
          </Text>
        </Col>
      </Row>
    ),
  },
  {
    title: "Vehículo",
    render: (x) => (
      <Row justify={"start"} gap={6}>
        <Tag color="blue" icon={<CarOutlined />}>
          {x.vehicle_plate ? x.vehicle_plate.toUpperCase() : "Sin patente"}
        </Tag>
        {x.vehicle_model && <Tag color="cyan">{x.vehicle_model}</Tag>}
      </Row>
    ),
  },
  {
    title: "Tarifas",
    render: (x) => (
      <Space direction="vertical" size="small">
        <Tag color="green" icon={<DollarOutlined />}>
          Base: ${x.base_delivery_fee}
        </Tag>
        <Tag color="orange">/km: ${x.price_per_km}</Tag>
      </Space>
    ),
  },
  {
    title: "Estado",
    render: (x) => (
      <Space>
        <Tag
          color={x.is_available ? "green" : "red"}
          icon={
            x.is_available ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
        >
          {x.is_available ? "Disponible" : "No disponible"}
        </Tag>
        {x.customer_rating && (
          <Tag color="gold" icon={<StarOutlined />}>
            {x.customer_rating}/5
          </Tag>
        )}
      </Space>
    ),
  },
  {
    title: "Acciones",
    render: (x) => (
      <Row justify={"space-evenly"} align={"middle"}>
        <Col>
          <Button
            size="small"
            shape="round"
            onClick={() => onSelectDriver(x)}
            icon={<EditFilled />}
          >
            Editar
          </Button>
        </Col>
        <Col>
          <Popconfirm
            title={"¿Estás seguro de eliminar el conductor?"}
            onConfirm={() => onDeleteDriver(x)}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              type="primary"
              icon={<DeleteFilled />}
              shape="round"
              size="small"
            />
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];

export const shortColumn = (onSelectDriver, onDeleteDriver, notification) => [
  {
    title: "Conductor",
    render: (x) => (
      <Row gutter={[{ xs: 5 }, { xs: 5 }]}>
        <Col span={24}>
          <Text strong>
            {x.user?.first_name} {x.user?.last_name}
          </Text>
        </Col>
        <Col span={24}>
          <Tag color="blue" icon={<CarOutlined />}>
            {x.vehicle_plate ? x.vehicle_plate.toUpperCase() : "Sin patente"}
          </Tag>
        </Col>
        <Col span={24}>
          <Tag color={x.is_available ? "green" : "red"}>
            {x.is_available ? "Disponible" : "No disponible"}
          </Tag>
        </Col>
        <Col>
          <Button
            size="small"
            shape="circle"
            onClick={() => onSelectDriver(x)}
            icon={<EditFilled />}
          />
        </Col>
        <Col>
          <Popconfirm
            title={"¿Estás seguro de eliminar el conductor?"}
            onConfirm={() => onDeleteDriver(x)}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              danger
              icon={<DeleteFilled />}
              size="small"
              shape={"circle"}
            />
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];

export const expandableRow = (record) => {
  if (!record) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <>
      <Descriptions bordered size="small" layout="vertical">
        <Descriptions.Item label="Usuario">
          <Space direction="vertical" size="small">
            <Text strong>
              {record.user?.first_name} {record.user?.last_name}
            </Text>
            <Text type="secondary">{record.user?.email}</Text>
            {record.user?.dni && (
              <Text type="secondary">RUT: {RUT.format(record.user.dni)}</Text>
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Vehículo">
          <Space direction="vertical" size="small">
            <Text>Patente: {record.vehicle_plate || "Sin patente"}</Text>
            <Text>Modelo: {record.vehicle_model || "Sin modelo"}</Text>
            <Text>Año: {record.vehicle_year || "Sin año"}</Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Tarifas">
          <Space direction="vertical" size="small">
            <Text>Tarifa base: ${record.base_delivery_fee}</Text>
            <Text>Por kilómetro: ${record.price_per_km}</Text>
            <Text>Mínima: ${record.min_delivery_fee}</Text>
            <Text>Máxima: ${record.max_delivery_fee}</Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Sucursal">
          {record.branch?.business_name || "Sin sucursal"}
        </Descriptions.Item>

        <Descriptions.Item label="Rendimiento">
          <Space direction="vertical" size="small">
            <Text>Entregas totales: {record.total_deliveries || 0}</Text>
            <Text>Ganancias totales: ${record.total_earnings || 0}</Text>
            <Text>
              Tiempo promedio: {record.average_delivery_time || "N/A"}
            </Text>
            {record.customer_rating && (
              <Text>Calificación: {record.customer_rating}/5 ⭐</Text>
            )}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Licencia">
          <Space direction="vertical" size="small">
            <Text>Número: {record.license_number || "Sin licencia"}</Text>
            <Text>Vencimiento: {record.license_expiry || "Sin fecha"}</Text>
            <Text>
              Estado: {record.is_license_valid ? "Válida" : "Vencida"}
            </Text>
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};
