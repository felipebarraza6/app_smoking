/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { controller } from "../../../controllers/type_payments";
import { Card, Form, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { TypePaymentsContext } from "../../../containers/TypePayments";
import { DollarCircleFilled } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(TypePaymentsContext);
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
    width: "100%",
  });

  const titleCard = state.select_to_edit ? (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <DollarCircleFilled css={iconStyle} />
      </Col>
      <Col>{state.select_to_edit.name}</Col>
    </Row>
  ) : (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <DollarCircleFilled css={iconStyle} />
      </Col>
      <Col>Agregar método de pago</Col>
    </Row>
  );

  useEffect(() => {
    if (state.select_to_edit) {
      form.setFieldsValue(state.select_to_edit);
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
