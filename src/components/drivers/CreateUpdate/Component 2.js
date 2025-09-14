/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useCallback, useMemo } from "react";
import { controller } from "../../../controllers/drivers";
import { Card, Form, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { DriversContext } from "../../../containers/Drivers";
import { TruckOutlined, TruckFilled } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(DriversContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = useMemo(() => [{ xl: 12, lg: 12 }, { xs: 24 }], []);

  const createOrUpdate = useCallback(
    (values) => {
      if (state.select_to_edit) {
        controller.update(values, state, dispatch, form, notification);
      } else {
        controller.create(values, dispatch, form, notification);
      }
    },
    [state.select_to_edit, state, dispatch, form, notification]
  );

  const formStyled = css({
    padding: "10px 10px",
  });

  const titleCard = useMemo(() => {
    if (state.select_to_edit) {
      return (
        <Row justify={"start"} gutter={gutterRow}>
          <Col>
            <TruckFilled css={iconStyle} />
          </Col>
          <Col>{state.select_to_edit.name}</Col>
        </Row>
      );
    } else {
      return (
        <Row justify={"start"} gutter={gutterRow}>
          <Col>
            <TruckOutlined css={iconStyle} />
          </Col>
          <Col>Crear repartidor</Col>
        </Row>
      );
    }
  }, [state.select_to_edit, gutterRow, iconStyle]);

  useEffect(() => {
    if (state.select_to_edit) {
      try {
        const driverData = {
          ...state.select_to_edit,
          branch:
            state.select_to_edit.branch?.id || state.select_to_edit.branch,
        };
        form.setFieldsValue(driverData);
      } catch (error) {

        notification.error({
          message: "Error al cargar los datos del repartidor",
          description: "Por favor, intenta nuevamente",
        });
      }
    }
  }, [state.select_to_edit, form, notification]);

  return (
    <Card hoverable title={titleCard} size="small">
      <Form form={form} onFinish={createOrUpdate} css={formStyled}>
        <FieldsForm form={form} />
      </Form>
    </Card>
  );
};

export default CreateUpdate;
