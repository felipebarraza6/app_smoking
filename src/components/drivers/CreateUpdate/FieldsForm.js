import React, { useContext } from "react";
import { Form, Input, Button, Row, Select } from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  MailOutlined,
  ProfileOutlined,
  FileProtectOutlined,
  PhoneOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { DriversContext } from "../../../containers/Drivers";
import { controller } from "../../../controllers/drivers";

import RUT from "rut-chile";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(DriversContext);

  const rules_items = rules(state);

  const iconBtnLeft = state.select_to_edit ? (
    <RetweetOutlined />
  ) : (
    <PlusCircleFilled />
  );

  const iconBtnRight = state.select_to_edit ? (
    <ArrowLeftOutlined />
  ) : (
    <ClearOutlined />
  );

  const onClickCreateOrClear = () => {
    controller.create_update_form.create_or_clear({ state, dispatch, form });
  };

  const validatorDni = (e) => {
    let rut = RUT.format(e.target.value);
    form.setFieldsValue({ dni: rut });
    if (!RUT.validate(rut)) {
      form.setFields([{ name: "dni", errors: ["Rut invalido"] }]);
    }
  };

  return (
    <>
      <Form.Item name="name" rules={rules_items.name}>
        <Input
          maxLength={300}
          placeholder="Nombre"
          prefix={<TruckOutlined />}
        />
      </Form.Item>

      <Form.Item name="vehicle_plate" rules={rules_items.name}>
        <Input
          maxLength={300}
          placeholder="Patente"
          prefix={<FileProtectOutlined />}
        />
      </Form.Item>
      <Form.Item name="dni" rules={rules_items.dni}>
        <Input
          maxLength={12}
          placeholder="Rut"
          onChange={validatorDni}
          prefix={<ProfileOutlined />}
        />
      </Form.Item>
      <Form.Item name="phone_number" rules={rules_items.phone_number}>
        <Input
          prefix={
            <>
              <PhoneOutlined /> <i>+56 9</i>
            </>
          }
          maxLength={9}
          placeholder="Teléfono"
        />
      </Form.Item>
      <Form.Item name="email" rules={rules_items.email}>
        <Input placeholder="Email" prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item name="branch" rules={rules_items.branch}>
        <Select placeholder="Sucursal">
          {state.branchs.map((branch) => (
            <Select.Option key={branch.id} value={branch.id}>
              {branch.business_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="amount" rules={rules_items.amount}>
        <Input
          placeholder="Monto por reparto"
          prefix={<ProfileOutlined />}
          type="number"
        />
      </Form.Item>

      <Form.Item>
        <Row justify={"space-evenly"} gutter={[{ xs: 12, xl: 12 }, {}]}>
          <Button htmlType="submit" type={"primary"} icon={iconBtnLeft}>
            {state.select_to_edit ? "Actualizar" : "Crear"}
          </Button>
          <Button onClick={onClickCreateOrClear} icon={iconBtnRight}>
            {state.select_to_edit ? "Crear" : "Limpiar"}
          </Button>
        </Row>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
