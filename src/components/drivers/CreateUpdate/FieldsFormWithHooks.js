import React, { useMemo } from "react";
import { Form, Input, Select, Button, InputNumber, Space, Divider } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  BankOutlined,
  DollarOutlined,
  PlusOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import RUT from "rut-chile";

const FieldsForm = ({
  form,
  userBranches,
  selectedDriver,
  onClearSelection,
}) => {
  // Memoizar las opciones de sucursales
  const branchOptions = useMemo(() => {
    return userBranches.map((branch) => ({
      value: branch.id,
      label: branch.business_name,
    }));
  }, [userBranches]);

  return (
    <>
      <Divider orientation="left" style={{ color: "#fff", fontWeight: 600 }}>
        Datos del repartidor
      </Divider>

      <Form.Item
        label="Nombre completo"
        name="name"
        rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
      >
        <Input
          prefix={<UserOutlined />}
          autoComplete="off"
          placeholder="Nombre"
        />
      </Form.Item>

      <Form.Item
        label="RUT"
        name="dni"
        rules={[
          { required: true, message: "Por favor ingresa el RUT" },
          {
            validator: (_, value) => {
              if (value && !RUT.validate(value)) {
                return Promise.reject(new Error("RUT inválido"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          autoComplete="off"
          placeholder="RUT"
          onChange={(e) =>
            form.setFieldsValue({ dni: RUT.format(e.target.value) })
          }
        />
      </Form.Item>

      <Form.Item
        label="Teléfono"
        name="phone_number"
        rules={[{ required: true, message: "Por favor ingresa el teléfono" }]}
      >
        <Input
          prefix={<PhoneOutlined />}
          autoComplete="off"
          placeholder="Teléfono"
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Por favor ingresa el email" },
          { type: "email", message: "Por favor ingresa un email válido" },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          autoComplete="off"
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        label="Patente del vehículo"
        name="vehicle_plate"
        rules={[{ required: true, message: "Por favor ingresa la patente" }]}
      >
        <Input
          prefix={<CarOutlined />}
          autoComplete="off"
          placeholder="Patente"
        />
      </Form.Item>

      <Form.Item
        label="Sucursal"
        name="branch"
        rules={[
          { required: true, message: "Por favor selecciona una sucursal" },
        ]}
      >
        <Select
          prefix={<BankOutlined />}
          options={branchOptions}
          placeholder="Selecciona una sucursal"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item
        label="Costo por reparto"
        name="amount"
        rules={[
          { required: true, message: "Por favor ingresa el costo por reparto" },
        ]}
      >
        <InputNumber
          prefix={<DollarOutlined />}
          style={{ width: "100%" }}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder="$"
        />
      </Form.Item>

      <Form.Item>
        <Space style={{ width: "100%", justifyContent: "end" }}>
          <Button icon={<PlusOutlined />} type="primary" htmlType="submit">
            {selectedDriver ? "Actualizar" : "Crear"}
          </Button>
          <Button
            icon={<UndoOutlined />}
            htmlType="button"
            onClick={onClearSelection}
            danger
          >
            Limpiar
          </Button>
        </Space>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
