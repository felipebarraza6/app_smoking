import React from "react";
import {
  Row,
  Col,
  Tag,
  Button,
  Popconfirm,
  Descriptions,
  Badge,
  Typography,
  Switch,
} from "antd";
import { DeleteFilled, EditFilled, CheckOutlined } from "@ant-design/icons";
import RUT from "rut-chile";
import { controller } from "../../../controllers/clients";
import AdminContacts from "./contacts/AdminContacts";

const { Paragraph } = Typography;

export const defaultColumn = (dispatch, notification, message) => [
  {
    title: "Nombre",
    dataIndex: "name",
  },
  {
    title: "Rut",
    render: (x) => {
      if (!x.dni) {
        return <Tag>Ingresar rut</Tag>;
      }
      return <Tag>{RUT.format(x.dni)}</Tag>;
    },
  },
  {
    title: "Contactos",
    render: (x) => <AdminContacts client={x} />,
  },
  {
    render: (x) => (
      <Row justify={"space-evenly"} align={"middle"} gutter={[12, 12]}>
        <Button
          size="small"
          onClick={() =>
            controller.create_update_form.select_to_edit(x, dispatch)
          }
          shape="round"
          icon={<EditFilled />}
        />
        <Switch
          defaultChecked={x.is_active}
          checkedChildren={<CheckOutlined />}
          disabled={
            !x.name ||
            !x.dni ||
            !x.email ||
            !x.region ||
            !x.province ||
            !x.commune
          }
          onChange={() => {
            controller.deactivate(x, dispatch, message, !x.is_active);
          }}
        />
        <Popconfirm
          title={"¿Estás seguro de eliminar el cliente?"}
          description={"Se eliminarán los registros asociados."}
          onConfirm={() => controller.delete(x, dispatch, notification)}
          cancelButtonProps={{ type: "primary" }}
        >
          <Button
            type="primary"
            icon={<DeleteFilled />}
            disabled={x.is_active}
            size="small"
            shape={"round"}
          />
        </Popconfirm>
      </Row>
    ),
  },
];

export const shortColumn = (dispatch, notification, message) => [
  {
    title: "Nombre",
    render: (x) => (
      <Row gutter={[5, 5]}>
        <Col>{x.name}</Col>
        <Col>
          <Tag>{x.email}</Tag>
          <Tag>{x.dni ? RUT.format(x.dni) : "Sin RUT"}</Tag>
        </Col>
        <Col>
          <Button
            size="small"
            shape="circle"
            onClick={() =>
              controller.create_update_form.select_to_edit(x, dispatch)
            }
            icon={<EditFilled />}
          />
        </Col>
        <Col>
          <Switch
            defaultChecked={x.is_active}
            checkedChildren={<CheckOutlined />}
            onChange={() => {
              controller.deactivate(x, dispatch, message, !x.is_active);
            }}
          />
        </Col>
        <Col>
          <AdminContacts client={x} />
        </Col>
        <Col>
          <Popconfirm
            title={"¿Estás seguro de eliminar el cliente?"}
            onConfirm={() => controller.delete(x, dispatch, notification)}
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
  return (
    <>
      <Descriptions bordered size="small" layout="vertical">
        <Descriptions.Item label="Nombre">
          {record.name ? record.name.toUpperCase() : "Ingresa el nombre"}
        </Descriptions.Item>
        <Descriptions.Item label="Rut">
          {record.dni ? RUT.format(record.dni) : "Ingresa el rut"}
        </Descriptions.Item>
        <Descriptions.Item label="Giro" style={{ width: "200px" }}>
          <Paragraph>
            {record.commercial_business
              ? record.commercial_business.toUpperCase()
              : "Ingresa el giro"}
          </Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Teléfono">
          {record.phone_number
            ? `+56 9 ${record.phone_number.replace(/(\d{4})/g, "$1 ")}`
            : "Ingresa el teléfono"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {record.email ? record.email.toLowerCase() : "Ingresa el email"}
        </Descriptions.Item>
        <Descriptions.Item label="Región">
          {record.region ? record.region.toUpperCase() : "Ingresa la región"}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {record.province
            ? record.province.toUpperCase()
            : "Ingresa la provincia"}
        </Descriptions.Item>
        <Descriptions.Item label="Comuna">
          {record.commune ? record.commune.toUpperCase() : "Ingresa la comuna"}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección" span={24}>
          {record.address
            ? record.address.toUpperCase()
            : "Ingresa la dirección"}
        </Descriptions.Item>
        <Descriptions.Item label="Sucursal">
          {record.branch && record.branch.business_name
            ? record.branch.business_name.toUpperCase()
            : "Ingresa la sucursal"}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de creación">
          {record.created ? record.created.slice(0, 10) : "Ingresa la fecha"}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          <Badge
            status={record.is_active ? "processing" : "error"}
            text={record.is_active ? "Activo" : "Desactivado"}
          />
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};
