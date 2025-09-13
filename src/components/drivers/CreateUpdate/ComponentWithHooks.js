/** @jsxImportSource @emotion/react */
import React, { useEffect, useCallback, useMemo } from "react";
import { Card, Form, Row, Col, Space } from "antd";
import { css } from "@emotion/react";
import { TruckOutlined, TruckFilled } from "@ant-design/icons";
import FieldsForm from "./FieldsFormWithHooks";

const CreateUpdate = ({
  selectedDriver,
  loading,
  userBranches,
  onCreate,
  onUpdate,
  onClearSelection,
}) => {
  const [form] = Form.useForm();

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = useMemo(() => [{ xl: 12, lg: 12 }, { xs: 24 }], []);

  // Memoizar la función createOrUpdate
  const createOrUpdate = useCallback(
    (values) => {
      if (selectedDriver) {
        onUpdate(values, form);
      } else {
        onCreate(values, form);
      }
    },
    [selectedDriver, onUpdate, onCreate, form]
  );

  const formStyled = css({
    padding: "10px 10px",
  });

  // Memoizar el título de la tarjeta
  const titleCard = useMemo(() => {
    if (selectedDriver) {
      return (
        <Row justify={"start"} gutter={gutterRow}>
          <Col>
            <TruckFilled css={iconStyle} />
          </Col>
          <Col>
            <Space direction="vertical" size="small">
              <div>
                {selectedDriver.user?.first_name}{" "}
                {selectedDriver.user?.last_name}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Perfil de Conductor
              </div>
            </Space>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row justify={"start"} gutter={gutterRow}>
          <Col>
            <TruckOutlined css={iconStyle} />
          </Col>
          <Col>
            <Space direction="vertical" size="small">
              <div>Crear Perfil de Conductor</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Para usuarios con rol DRIVER
              </div>
            </Space>
          </Col>
        </Row>
      );
    }
  }, [selectedDriver, gutterRow, iconStyle]);

  // Efecto para manejar la edición de un driver
  useEffect(() => {
    if (selectedDriver) {
      try {
        // Crear una copia del objeto para evitar mutaciones
        const driverData = {
          ...selectedDriver,
          branch: selectedDriver.branch?.id || selectedDriver.branch,
        };
        form.setFieldsValue(driverData);
      } catch (error) {}
    } else {
      // Limpiar formulario cuando no hay driver seleccionado
      form.resetFields();
    }
  }, [selectedDriver, form]);

  return (
    <Card hoverable title={titleCard} size="small">
      <Form form={form} onFinish={createOrUpdate} css={formStyled}>
        <FieldsForm
          form={form}
          userBranches={userBranches}
          selectedDriver={selectedDriver}
          onClearSelection={onClearSelection}
        />
      </Form>
    </Card>
  );
};

export default CreateUpdate;
