/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { controller } from "../../../controllers/products";
import { Card, Form, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { ProductsContext } from "../../../containers/Products";
import { ContainerOutlined, ContainerFilled } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(ProductsContext);
  const { notification, message } = App.useApp();
  const [form] = Form.useForm();

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = [{ xl: 12, lg: 12 }, { xs: 24 }];

  function createOrUpdate(values) {
    if (state.select_to_edit) {
      controller.update(values, state, dispatch, form, notification, message);
    } else {
      controller.create(values, dispatch, form, notification);
    }
  }

  const titleCard = state.select_to_edit ? (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <ContainerFilled css={iconStyle} />
      </Col>
      <Col>{state.select_to_edit.name}</Col>
    </Row>
  ) : (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <ContainerOutlined css={iconStyle} />
      </Col>
      <Col>Crear Producto</Col>
    </Row>
  );

  useEffect(() => {
    if (state.select_to_edit) {
      let parse = {
        ...state,
        select_to_edit: {
          ...state.select_to_edit,
          branch: state.select_to_edit.branch.id,
          category: state.select_to_edit.category.id,
        },
      };
      form.setFieldsValue(parse.select_to_edit);
    }
    if (state.add_quantity || state.sus_quantity) {
      form.setFieldValue("quantity", parseFloat(0));
    }
  }, [state.select_to_edit, form]);

  return (
    <Card hoverable title={titleCard} size="small">
      <Form form={form} onFinish={createOrUpdate}>
        <FieldsForm form={form} />
      </Form>
    </Card>
  );
};

export default CreateUpdate;
