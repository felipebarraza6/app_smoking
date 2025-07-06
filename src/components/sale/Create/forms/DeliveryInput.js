/** @jsxImportSource @emotion/react */
import React, { useContext, useCallback, useEffect } from "react";
import { Form, Input, Select, Flex, Col, Button, Card } from "antd";
import {
  DollarCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  RetweetOutlined,
} from "@ant-design/icons";
import { CarFilled } from "@ant-design/icons";
import { rules } from "../rules_form";
import { FaTruck } from "react-icons/fa";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { SaleContext } from "../../../../containers/Sale";
import { css } from "@emotion/react";
import { controller } from "../../../../controllers/sales";
import api from "../../../../api/endpoints";

const DeliveryInput = ({ mobile }) => {
  const { state, dispatch } = useContext(SaleContext);
  const rules_items = rules(state);
  const flexStyled = css({
    width: "100%",
  });

  const itemStyled = css({
    marginBottom: "0",
  });
  const [form] = Form.useForm();

  const updateOrder = useCallback((values) => {
    api.orders.update(state.order.create_id, values);
  }, []);

  const onFinish = (values) => {
    dispatch({ type: "set_current_step", payload: { current: 3 } });
    const selected_driver = state.drivers.list.find(
      (driver) => driver.id === values.driver
    );
    dispatch({
      type: "selected_driver",
      payload: {
        ...selected_driver,
        charge_amount: values.charge_amount,
        address: values.address,
        note: values.note,
      },
    });
    updateOrder({
      driver: selected_driver.id,
      address: values.address,
      driver_note: values.note,
    });
  };

  useEffect(() => {
    controller.get_drivers(dispatch, state);
    if (state.drivers.selected) {
      form.setFieldsValue({
        driver: state.drivers.selected.id,
        charge_amount: state.drivers.selected.charge_amount,
        address: state.drivers.selected.address,
        note: state.drivers.selected.note,
      });
    }
  }, [state.steps.current]);

  return (
    <Flex vertical gap={"large"} style={{ width: "100%" }} justify="top">
      <Card
        hoverable
        title="Datos de entrega"
        style={{ width: "100%", minHeight: "55vh" }}
        extra={
          <Flex gap={"small"}>
            {state.drivers.selected ? (
              <Flex gap={"small"}>
                <CheckCircleFilled />
                Datos ingresados
              </Flex>
            ) : (
              <Flex gap={"small"}>
                <CloseCircleFilled />
                Sin conductor
              </Flex>
            )}
          </Flex>
        }
      >
        <Form
          form={form}
          layout={mobile ? "vertical" : "horizontal"}
          style={mobile ? { padding: 12 } : {}}
          onFinish={onFinish}
          initialValues={{
            address: state.clients.selected?.address,
          }}
        >
          <Flex vertical={mobile} gap={mobile ? 12 : 0}>
            <Flex gap={"small"} css={flexStyled}>
              <Col span={12}>
                <Form.Item
                  name="driver"
                  rules={rules_items.driver}
                  css={itemStyled}
                  label="Conductor"
                >
                  <Select
                    placeholder="Seleccione un conductor"
                    disabled={state.drivers.selected}
                    suffixIcon={<FaTruck />}
                    onSelect={(value) => {
                      const selected_driver = state.drivers.list.find(
                        (driver) => driver.id === value
                      );
                      form.setFieldsValue({
                        charge_amount: selected_driver.amount,
                      });
                    }}
                    showSearch
                    options={state.drivers.list.map((driver) => ({
                      label: driver.name,
                      value: driver.id,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="charge_amount"
                  rules={rules_items.charge_amount}
                  css={itemStyled}
                  label="Cargo"
                >
                  <Input
                    placeholder="Monto a cancelar por reparto"
                    disabled={state.drivers.selected}
                    type="number"
                    addonBefore={<DollarCircleOutlined />}
                  />
                </Form.Item>
              </Col>
            </Flex>
            <Flex gap={"small"} css={flexStyled}>
              <Col span={12}>
                <Form.Item
                  name="address"
                  rules={rules_items.address}
                  css={itemStyled}
                  label="Dirección"
                >
                  <Input.TextArea
                    placeholder="Dirección de entrega"
                    rows={3}
                    disabled={state.drivers.selected}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nota para conductor"
                  name="note"
                  rules={rules_items.note}
                  css={itemStyled}
                >
                  <Input.TextArea
                    disabled={state.drivers.selected}
                    placeholder="Describe..."
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Flex>
            <Flex gap="small" justify={"end"}>
              <Button
                type="primary"
                shape="round"
                icon={<PiContactlessPaymentFill style={{ fontSize: "20px" }} />}
                htmlType="submit"
                disabled={state.drivers.selected}
              >
                Guardar
              </Button>
              <Button
                shape="round"
                icon={<RetweetOutlined />}
                disabled={!state.drivers.selected}
                onClick={() => {
                  updateOrder({
                    driver: null,
                    address: null,
                    driver_note: null,
                  });
                  form.resetFields();
                  dispatch({
                    type: "selected_driver",
                    payload: null,
                  });
                }}
              >
                Reiniciar
              </Button>
            </Flex>
          </Flex>
        </Form>
      </Card>
    </Flex>
  );
};

export default DeliveryInput;
