/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { controller } from "../../../controllers/users";
import { Card, Form, Modal, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { UsersContext } from "../../../containers/Users";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";
import DriverProfileManager from "../DriverProfileManager";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(UsersContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = [{ xl: 12, lg: 12 }, { xs: 24 }];

  function createOrUpdateUser(values) {
    if (state.select_to_edit) {
      controller.update(values, state, dispatch, form, notification);
    } else {
      if (values.password === values.password_confirmation) {
        const cleanEmail = values.email
          .split("@")[0]
          .replace(/[^a-zA-Z0-9]/g, "");
        values = { ...values, username: cleanEmail, type_user: "CL" };
        controller.create(values, dispatch, form, notification);
      } else {
        Modal.error({
          title: "ERROR",
          content: "Las contraseñas no coinciden, verifica e intenta de nuevo.",
        });
      }
    }
  }

  const titleCard = state.select_to_edit ? (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <UserOutlined css={iconStyle} />
      </Col>
      <Col>@{state.select_to_edit.username}</Col>
    </Row>
  ) : (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <UserAddOutlined css={iconStyle} />
      </Col>
      <Col>Crear Usuario</Col>
    </Row>
  );

  useEffect(() => {
    if (state.select_to_edit) {
      form.setFieldsValue(state.select_to_edit);
    }
  }, [state.select_to_edit, form]);

  return (
    <>
      <Card hoverable title={titleCard}>
        <Form form={form} onFinish={createOrUpdateUser}>
          <FieldsForm form={form} />
        </Form>
      </Card>

      {/* Gestión de perfil de conductor para usuarios con rol DRIVER */}
      {state.select_to_edit && (
        <DriverProfileManager
          user={state.select_to_edit}
          onUpdate={() => {
            // Recargar la lista de usuarios cuando se actualice el perfil
            dispatch({ type: "update_list" });
          }}
        />
      )}
    </>
  );
};

export default CreateUpdate;
