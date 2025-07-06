/** @jsxImportSource @emotion/react */
import React, { useContext, useState, useEffect, useCallback } from "react";

import { Form, Input, Button, Flex, Card, Table, App, Typography } from "antd";
import {
  PhoneOutlined,
  PushpinFilled,
  UserOutlined,
  MailOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { FaTruckFast } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";

import { rules } from "../rules_form";
import { OrdersContext } from "../../../../containers/Orders";
import { css } from "@emotion/react";
import { controller } from "../../../../controllers/sales";
import { PiContactlessPaymentFill } from "react-icons/pi";
import { controller as controllerClients } from "../../../../controllers/clients";
import api from "../../../../api/endpoints";

const ClientForm = ({ mobile }) => {
  const { state, dispatch } = useContext(OrdersContext);
  const { notification } = App.useApp();

  const rules_items = rules(state);
  const [newClient, setNewClient] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const [form] = Form.useForm();

  const flexStyled = css({
    width: "100%",
  });
  const itemStyled = css({
    marginBottom: "0",
  });

  const onSelectClient = (value) => {
    const selectedClient = (state.clients?.list || []).find(
      (client) => client.id === value
    );

    setNewClient(false);
    setDisabled(true);
    form.setFieldsValue({
      id: selectedClient.id,
      name: selectedClient.name,
      phone_number: selectedClient.phone_number,
      email: selectedClient.email,
    });
  };

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const filteredClients = (state.clients?.list || []).filter((client) => {
    const searchLower = searchValue.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.dni.toLowerCase().includes(searchLower)
    );
  });

  const onFinish = (values) => {
    if (newClient) {
      values = {
        ...values,
        is_active: false,
        branch: state.branchs.selected.id,
      };
      controllerClients
        .create(values, dispatch, form, notification)
        .then((r) => {
          dispatch({
            type: "selected_client",
            payload: r,
          });
          form.setFieldsValue({
            id: r.id,
            name: r.name,
            phone_number: r.phone_number,
            email: r.email,
          });
        });
    } else {
      const client = (state.clients?.list || []).find(
        (client) => client.id === values.id
      );
      controllerClients.update(client.id, values, dispatch, form, notification);
    }

    controller.get_clients(dispatch, state);
  };

  const updateOrder = useCallback(
    (values) => {
      api.orders.update(state.order.create_id, values);
    },
    [state.order.create_id]
  );

  useEffect(() => {
    controller.get_clients(dispatch, state);
    if (state.clients.selected) {
      updateOrder({
        client: state.clients.selected.id,
      });
      setDisabled(true);
      form.setFieldsValue({
        id: state.clients.selected.id,
        name: state.clients.selected.name,
        phone_number: state.clients.selected.phone_number,
        email: state.clients.selected.email,
      });
    }
  }, [state.clients.selected]);

  return (
    <Card hoverable style={{ width: "100%" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout={mobile ? "horizontal" : "vertical"}
      >
        <Flex
          css={flexStyled}
          justify="center"
          align="center"
          gap="small"
          vertical
        >
          <Flex gap="small" vertical={mobile}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="name" rules={rules_items.name} css={itemStyled}>
              <Input
                placeholder="Nombre Apellido"
                addonBefore={<UserOutlined />}
                value={searchValue}
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item
              name="phone_number"
              rules={rules_items.phone}
              css={itemStyled}
            >
              <Input
                placeholder="1234 5678"
                prefix={"+56 9"}
                addonBefore={<PhoneOutlined />}
                disabled={disabled}
              />
            </Form.Item>
            <Form.Item name="email" rules={rules_items.email} css={itemStyled}>
              <Input
                placeholder="correo@dominio.cl"
                disabled={disabled}
                addonBefore={<MailOutlined />}
              />
            </Form.Item>
          </Flex>
          <Flex gap="small" vertical={mobile} style={{ width: "100%" }}>
            {!state.clients.selected && (
              <Button
                icon={<UserAddOutlined />}
                block={mobile}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setDisabled(false);
                  setNewClient(true);
                  dispatch({
                    type: "selected_client",
                    payload: null,
                  });
                }}
              >
                crear
              </Button>
            )}
            <Button
              icon={<UserDeleteOutlined />}
              type="primary"
              disabled={!disabled}
              onClick={() => {
                form.resetFields();
                setDisabled(false);
                setNewClient(true);
                updateOrder({
                  client: null,
                  driver: null,
                  address: null,
                  driver_note: null,
                });

                dispatch({
                  type: "selected_client",
                  payload: null,
                });
              }}
            >
              quitar selección
            </Button>
            {state.clients.selected && (
              <Button
                icon={<FaTruckFast />}
                onClick={() => {
                  dispatch({
                    type: "set_current_step",
                    payload: {
                      current: 2,
                    },
                  });
                }}
              >
                Agregar reparto
              </Button>
            )}
            {state.clients.selected && (
              <Button
                icon={<IoDocumentText />}
                onClick={() => {
                  dispatch({
                    type: "set_current_step",
                    payload: {
                      current: 3,
                    },
                  });
                }}
              >
                Plan de pago
              </Button>
            )}
          </Flex>
          <Flex
            gap={"small"}
            justify="space-between"
            align="center"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <Flex vertical gap={"small"} style={{ width: "100%" }}>
              <Input.Search
                placeholder="Buscar por nombre/rut"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Table
                style={{ width: "100%" }}
                size={"small"}
                dataSource={filteredClients}
                pagination={{
                  pageSize: 4,
                  showSizeChanger: true,
                }}
                columns={[
                  {
                    title: "ID",
                    key: "id",
                    hidden: !mobile,
                    render: (text, record) => (
                      <Flex vertical gap={"small"}>
                        <Typography.Text style={{ fontWeight: "bold" }}>
                          {record.name}
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: "bold" }}>
                          {record.dni}
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: "bold" }}>
                          {record.phone_number}
                        </Typography.Text>
                        <Typography.Text style={{ fontWeight: "bold" }}>
                          {record.email}
                        </Typography.Text>
                      </Flex>
                    ),
                  },
                  {
                    title: "Nombre",
                    dataIndex: "name",
                    key: "name",
                    hidden: mobile,
                  },
                  {
                    title: "Rut",
                    dataIndex: "dni",
                    key: "dni",
                    hidden: mobile,
                  },
                  {
                    title: "Teléfono",
                    dataIndex: "phone_number",
                    key: "phone_number",
                    hidden: mobile,
                  },
                  {
                    title: "Email",
                    dataIndex: "email",
                    key: "email",
                    hidden: mobile,
                  },
                  {
                    render: (text, record) => (
                      <center>
                        <Button
                          disabled={state.clients.selected}
                          icon={<PushpinFilled />}
                          type="primary"
                          onClick={() => {
                            onSelectClient(record.id);
                            form.setFieldsValue({
                              id: record.id,
                              name: record.name,
                              phone_number: record.phone_number,
                              email: record.email,
                            });
                            dispatch({
                              type: "selected_client",
                              payload: record,
                            });
                          }}
                        >
                          Seleccionar
                        </Button>
                      </center>
                    ),
                  },
                ]}
              />
            </Flex>
          </Flex>
        </Flex>
      </Form>
    </Card>
  );
};

export default ClientForm;
