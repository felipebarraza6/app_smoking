import React from "react";
import { Row, Col, Tag, Button, Popconfirm, Descriptions } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import RUT from "rut-chile";

export const defaultColumn = (onSelectDriver, onDeleteDriver, notification) => [
  {
    title: "Nombre",
    width: 200,
    render: (x) => (
      <Row>
        <Col span={24}>{x.name ? x.name.toUpperCase() : "Sin nombre"}</Col>
      </Row>
    ),
  },
  {
    title: "Patente",
    render: (x) => {
      return (
        <Row justify={"start"} gap={6}>
          <Tag color="yellow-inverse" style={{ color: "black" }}>
            {x.vehicle_plate ? x.vehicle_plate.toUpperCase() : "Sin patente"}
          </Tag>
        </Row>
      );
    },
  },
  {
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
            title={"Estas seguro de eliminar el repartidor?"}
            onConfirm={() => onDeleteDriver(x)}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              type="primary"
              icon={<DeleteFilled />}
              shape="round"
              size="small"
            ></Button>{" "}
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];

export const shortColumn = (onSelectDriver, onDeleteDriver, notification) => [
  {
    title: "Nombre",
    render: (x) => (
      <Row gutter={[{ xs: 5 }, { xs: 5 }]}>
        <Col span={24}>{x.name ? x.name : "Sin nombre"}</Col>
        <Col>
          <Tag color="yellow-inverse" style={{ color: "black" }}>
            {x.vehicle_plate ? x.vehicle_plate.toUpperCase() : "Sin patente"}
          </Tag>
        </Col>
        <Col>
          <Button
            size="small"
            shape="circle"
            onClick={() => onSelectDriver(x)}
            icon={<EditFilled />}
          ></Button>
        </Col>
        <Col>
          <Popconfirm
            title={"Estas seguro de eliminar el repartidor?"}
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
        <Descriptions.Item label="Rut">
          {record.dni ? RUT.format(record.dni) : "Sin RUT"}
        </Descriptions.Item>
        <Descriptions.Item label="Telefono">
          {record.phone_number
            ? `+56 9 ${record.phone_number.replace(/(\d{4})/g, "$1 ")}`
            : "Sin teléfono"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {record.email ? record.email.toUpperCase() : "Sin email"}
        </Descriptions.Item>
        <Descriptions.Item label="Sucursal">
          {record.branch?.business_name || "Sin sucursal"}
        </Descriptions.Item>
        <Descriptions.Item label="Costo por reparto">
          {record.amount
            ? record.amount.toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })
            : "Sin costo"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};
