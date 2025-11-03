import React, { useContext, useEffect } from "react";
import { Form, Input, Button, Flex, App } from "antd";
import {
  ClearOutlined,
  PlusCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ContactsOutlined,
  PartitionOutlined,
  ArrowLeftOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import { ClientsContext } from "../../../../containers/Clients";
import { controller } from "../../../../controllers/clients";

const CreateUpdate = ({ setOpenSecond, client }) => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(ClientsContext);
  const { notification } = App.useApp();

  const validateNumber = (_, value, text) => {
    if (isNaN(value)) {
      return Promise.reject(new Error(text));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (state.contacts.select_to_edit) {
      form.setFieldsValue(state.contacts.select_to_edit);
    } else {
      form.resetFields();
    }
  }, [state.contacts.select_to_edit]);

  const clearOrBack = () => {
    if (state.contacts.select_to_edit) {
      controller.list_table.contacts.select_edit(null, dispatch);
      setOpenSecond(false);
    } else {
      form.resetFields();
    }
  };

  const onFinish = (values) => {
    if (state.contacts.select_to_edit) {
      values = { ...values, id: state.contacts.select_to_edit.id };
      controller.list_table.contacts.update(
        values,
        dispatch,
        notification,
        setOpenSecond
      );
    } else {
      values = { ...values, client: client.id };
      controller.list_table.contacts.create(
        values,
        dispatch,
        notification,
        setOpenSecond
      );
      form.resetFields();
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Ingresa el nombre" }]}
      >
        <Input placeholder="Nombre" prefix={<ContactsOutlined />} />
      </Form.Item>
      <Form.Item
        name="phone_number"
        rules={[
          {
            validator: (_, value) =>
              validateNumber(_, value, "El teléfono debe ser un número"),
          },
          { min: 8, message: "El teléfono debe tener 8 dígitos" },
        ]}
      >
        <Input
          placeholder="Telefono"
          prefix="+56 9"
          suffix={<PhoneOutlined />}
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ type: "email", message: "Ingresa un email valido" }]}
      >
        <Input placeholder="Email" prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item name="job_title">
        <Input placeholder="Cargo" prefix={<PartitionOutlined />} />
      </Form.Item>
      <Form.Item>
        <Flex gap={"small"}>
          <Button
            type="primary"
            htmlType="submit"
            icon={
              state.contacts.select_to_edit ? (
                <RetweetOutlined />
              ) : (
                <PlusCircleOutlined />
              )
            }
          >
            {state.contacts.select_to_edit ? "Actualizar" : "Crear"}
          </Button>
          <Button
            type="default"
            onClick={clearOrBack}
            icon={
              state.contacts.select_to_edit ? (
                <ArrowLeftOutlined />
              ) : (
                <ClearOutlined />
              )
            }
          >
            {state.contacts.select_to_edit ? "Volver" : "Limpiar"}
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default CreateUpdate;
