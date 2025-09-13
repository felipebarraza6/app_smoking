import React from "react";
import {
  Row,
  Col,
  Tag,
  Button,
  Popconfirm,
  Descriptions,
  Typography,
  Image,
  Flex,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";
import { controller } from "../../../controllers/branchs";
import { DEVURL } from "../../../api/config";

const { Paragraph } = Typography;

export const defaultColumn = (
  dispatch,
  notification,
  onManageUsers,
  user,
  canManageBranch,
  userRoles
) => {
  const isSystemAdmin = user?.type_user === "ADM";

  return [
    {
      title: "Nombre",
      render: (x) => (
        <Row>
          <Col span={24}>{x.business_name}</Col>
        </Row>
      ),
    },
    {
      title: "Rut",
      render: (x) => {
        return <Tag>{x.dni ? RUT.format(x.dni) : "Sin RUT"}</Tag>;
      },
    },
    {
      title: "Usuarios",
      render: (x) => <Tag>{x.users_count || 0} usuarios</Tag>,
    },
    {
      title: "Acciones",
      render: (x) => {
        const canManage = canManageBranch ? canManageBranch(x.id) : false;

        // Solo mostrar acciones si el usuario puede gestionar esta sucursal
        if (!canManage && !isSystemAdmin) {
          return null;
        }

        return (
          <Flex justify="space-between" gap={"small"} align="center" vertical>
            {canManage && (
              <Button
                size="small"
                onClick={() =>
                  controller.create_update_form.select_to_edit(x, dispatch)
                }
                block
                icon={<EditFilled />}
              >
                Editar
              </Button>
            )}
            {canManage && (
              <Button
                size="small"
                type="default"
                onClick={() => onManageUsers && onManageUsers(x)}
                block
                icon={<TeamOutlined />}
              >
                Usuarios
              </Button>
            )}
            {(canManage || isSystemAdmin) && (
              <Popconfirm
                title={"Estas seguro de eliminar la tienda?"}
                onConfirm={() => controller.delete(x, dispatch, notification)}
                cancelButtonProps={{ type: "primary" }}
              >
                <Button
                  size="small"
                  type="primary"
                  block
                  icon={<DeleteFilled />}
                >
                  Eliminar
                </Button>
              </Popconfirm>
            )}
          </Flex>
        );
      },
    },
  ];
};

export const shortColumn = (
  dispatch,
  notification,
  onManageUsers,
  user,
  canManageBranch,
  userRoles
) => {
  const isSystemAdmin = user?.type_user === "ADM";

  return [
    {
      title: "Nombre",
      render: (x) => {
        const userRole = userRoles?.[x.id] || null;
        const canManage = canManageBranch ? canManageBranch(x.id) : false;
        const isOwner = x.owner?.id === user?.id;

        return (
          <Row gutter={[{ xs: 5 }, { xs: 5 }]}>
            <Col>{x.business_name}</Col>
            <Col>
              <Tag>{x.email}</Tag>
              <Tag> {x.dni ? RUT.format(x.dni) : "Sin RUT"}</Tag>
              <Tag color="blue">{x.users_count || 0} usuarios</Tag>
            </Col>
            {canManage && (
              <Col>
                <Button
                  size="small"
                  shape="circle"
                  onClick={() =>
                    controller.create_update_form.select_to_edit(x, dispatch)
                  }
                  icon={<EditFilled />}
                ></Button>
              </Col>
            )}
            {canManage && (
              <Col>
                <Button
                  size="small"
                  shape="circle"
                  onClick={() => onManageUsers && onManageUsers(x)}
                  icon={<UserOutlined />}
                ></Button>
              </Col>
            )}
            {(canManage || isSystemAdmin) && (
              <Col>
                <Popconfirm
                  title={"Estas seguro de eliminar la sucursal?"}
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
            )}
          </Row>
        );
      },
    },
  ];
};

export const expandableRow = (record) => {
  return (
    <>
      <Descriptions title="Sucursal" bordered size="small" layout="vertical">
        <Descriptions.Item label="Nombre">
          {record.business_name.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Rut">
          {record.dni ? RUT.format(record.dni) : "Sin RUT"}
        </Descriptions.Item>
        <Descriptions.Item label="Telefono">
          +56 9 {record.phone.replace(/(\d{4})/g, "$1 ")}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {record.email.toLowerCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Región">
          {record.region.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {record.province.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Comuna">
          {record.commune.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección" span={24}>
          {record.address.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Giro" style={{ width: "200px" }}>
          <Paragraph>{record.commercial_business.toUpperCase()}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Logo">
          {console.log(DEVURL.slice(0, -5) + record.logo)}

          {console.log(`${DEVURL}${record.logo}`)}
          {record.logo ? (
            <center>
              <Image
                src={`${DEVURL.slice(0, -5)}${record.logo}`}
                alt="logo"
                preview={false}
                style={{ width: "100px", objectFit: "contain" }}
              />
            </center>
          ) : (
            ""
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};
