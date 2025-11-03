import React from "react";
import { Row, Col, Tag, Button, Popconfirm, Space, Switch, Select } from "antd";
import { DeleteFilled, EditFilled, SettingOutlined } from "@ant-design/icons";
import RUT from "rut-chile";
import { controller } from "../../../controllers/users";
import api from "../../../api/endpoints";

const { Option } = Select;

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

export const defaultColumn = (dispatch, notification, branchId) => {

  const handleToggleStatus = async (user, isActive) => {
    try {
      await api.branchs.toggle_user_status({
        user_id: user.id,
        branch_id: branchId,
        is_active: !isActive,
      });

      notification.success({
        message: `Usuario ${
          !isActive ? "activado" : "desactivado"
        } exitosamente`,
      });

      // Recargar la lista
      dispatch({ type: "update_list" });
    } catch (error) {

      notification.error({
        message: "Error al cambiar estado del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await api.users.change_user_role({
        user_id: user.id,
        branch_id: branchId,
        role: newRole,
      });

      notification.success({
        message: `Rol cambiado a ${ROLE_LABELS[newRole]} exitosamente`,
      });

      // Recargar la lista
      dispatch({ type: "update_list" });
    } catch (error) {

      notification.error({
        message: "Error al cambiar rol del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  return [
    {
      title: "Nombre",
      render: (x) => (
        <Row>
          <Col span={24}>{x.first_name}</Col>
          <Col span={24}> {x.last_name}</Col>
        </Row>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => email.toLowerCase(),
    },
    {
      title: "Rut",
      dataIndex: "dni",
      render: (dni) => {
        return <Tag>{dni ? RUT.format(dni) : "Sin RUT"}</Tag>;
      },
    },

    {
      title: "Estado",
      render: (x) => {
        const isActive = x.branch_access?.is_active ?? true;

        return (
          <Switch
            checked={isActive}
            onChange={() => handleToggleStatus(x, isActive)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        );
      },
    },
    {
      title: "Rol",
      render: (x) => {
        const currentRole = x.branch_access?.role || "VIEWER";

        return (
          <Select
            value={currentRole}
            style={{ width: 120 }}
            onChange={(newRole) => handleChangeRole(x, newRole)}
            suffixIcon={<SettingOutlined />}
          >
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <Option key={key} value={key}>
                <Space>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: ROLE_COLORS[key],
                    }}
                  />
                  {label}
                </Space>
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Acciones",
      render: (x) => (
        <Row justify={"space-around"}>
          <Button
            size="small"
            onClick={() =>
              controller.create_update_form.select_to_edit(x, dispatch)
            }
            icon={<EditFilled />}
          >
            Editar
          </Button>
          <Popconfirm
            title={"Estas seguro de eliminar el usuario?"}
            onConfirm={() => {

              controller.delete(x, dispatch, notification);
            }}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              type="primary"
              icon={<DeleteFilled />}
              size="small"
            ></Button>
          </Popconfirm>
        </Row>
      ),
    },
  ];
};

export const shortColumn = (dispatch, notification, branchId) => {

  const handleToggleStatus = async (user, isActive) => {
    try {
      await api.users.toggle_user_status({
        user_id: user.id,
        branch_id: branchId,
        is_active: !isActive,
      });

      notification.success({
        message: `Usuario ${
          !isActive ? "activado" : "desactivado"
        } exitosamente`,
      });

      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar estado del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  const handleChangeRole = async (user, newRole) => {
    try {
      await api.users.change_user_role({
        user_id: user.id,
        branch_id: branchId,
        role: newRole,
      });

      notification.success({
        message: `Rol cambiado a ${ROLE_LABELS[newRole]} exitosamente`,
      });

      dispatch({ type: "update_list" });
    } catch (error) {
      notification.error({
        message: "Error al cambiar rol del usuario",
        description: error.response?.data?.error || "Error desconocido",
      });
    }
  };

  return [
    {
      title: "Nombre",
      render: (x) => (
        <Row>
          <Col span={24}>{x.first_name}</Col>
          <Col span={24}> {x.last_name}</Col>
        </Row>
      ),
    },
    {
      title: "Datos",
      render: (x) => {
        const isActive = x.branch_access?.is_active ?? true;
        const currentRole = x.branch_access?.role || "VIEWER";

        return (
          <Row
            justify={"space-between"}
            align={"middle"}
            gutter={[{ xs: 6 }, { xs: 6 }]}
          >
            <Col span={12}>
              <Row gutter={[{ xs: 5 }, { xs: 5 }]}>
                {x.email.toLowerCase()}
                <Tag> {x.dni ? RUT.format(x.dni) : "Sin RUT"}</Tag>
              </Row>
              <Row style={{ marginTop: 4 }}>
                <Switch
                  size="small"
                  checked={isActive}
                  onChange={() => handleToggleStatus(x, isActive)}
                  checkedChildren="Activo"
                  unCheckedChildren="Inactivo"
                />
                <Select
                  size="small"
                  value={currentRole}
                  style={{ width: 80, marginLeft: 8 }}
                  onChange={(newRole) => handleChangeRole(x, newRole)}
                >
                  {Object.entries(ROLE_LABELS).map(([key, label]) => (
                    <Option key={key} value={key}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </Row>
            </Col>

            <Col>
              <Popconfirm
                title={"Estas seguro de eliminar el cliente?"}
                onConfirm={() => {
                  console.log(
                    "🔍 Botón eliminar clickeado (short), notification:",
                    !!notification
                  );
                  controller.delete(x, dispatch, notification);
                }}
                cancelButtonProps={{ type: "primary" }}
              >
                <Button
                  type="primary"
                  danger
                  icon={<DeleteFilled />}
                  size="small"
                  shape={"circle"}
                ></Button>{" "}
              </Popconfirm>
              <Button
                size="small"
                onClick={() =>
                  controller.create_update_form.select_to_edit(x, dispatch)
                }
                icon={<EditFilled />}
                shape={"circle"}
              ></Button>
            </Col>
          </Row>
        );
      },
    },
  ];
};
