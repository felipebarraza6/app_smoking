/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { controller } from "../../../controllers/clients";
import { Card, Form, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { ClientsContext } from "../../../containers/Clients";
import { BuildOutlined, BuildFilled } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(ClientsContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = [{ xl: 12, lg: 12 }, { xs: 24 }];

  function createOrUpdate(values) {
    if (state.select_to_edit) {
      controller.update(values, state, dispatch, form, notification);
    } else {
      controller.create(values, dispatch, form, notification);
    }
  }

  const formStyled = css({
    padding: "10px 10px",
  });

  const titleCard = state.select_to_edit ? (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <BuildFilled css={iconStyle} />
      </Col>
      <Col>{state.select_to_edit.name}</Col>
    </Row>
  ) : (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <BuildOutlined css={iconStyle} />
      </Col>
      <Col>Crear Cliente</Col>
    </Row>
  );

  useEffect(() => {
    if (state.select_to_edit) {
      const values = {
        ...state.select_to_edit,
        branch: state.select_to_edit.branch.id,
      };

      form.setFieldsValue(values);
    }
  }, [state.select_to_edit, form]);

  return (
    <Card hoverable title={titleCard} size="small">
      <Form form={form} onFinish={createOrUpdate} css={formStyled}>
        <FieldsForm form={form} />
      </Form>
    </Card>
  );
};

export default CreateUpdate;
