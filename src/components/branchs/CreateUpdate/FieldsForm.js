import React, { useContext } from "react";
import { Form, Input, Button, Row, Select, Tag } from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  MailOutlined,
  ProfileOutlined,
  UnorderedListOutlined,
  PhoneOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { BranchsContext } from "../../../containers/Branchs";
import { controller } from "../../../controllers/branchs";
import SelectLocations from "./fields/SelectLocations";
import { codes } from "../../../utils/sii_code";

import UploadLogo from "./fields/UploadLogo";
import RUT from "rut-chile";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(BranchsContext);

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
      <Form.Item name="business_name" rules={rules_items.business_name}>
        <Input maxLength={300} placeholder="Nombre" prefix={<ShopOutlined />} />
      </Form.Item>
      <Form.Item name="logo" rules={rules_items.logo}>
        <UploadLogo form={form} />
      </Form.Item>
      <Form.Item
        name="commercial_business"
        rules={rules_items.commercial_business}
      >
        <Select
          placeholder={"Giro"}
          suffixIcon={<UnorderedListOutlined />}
          showSearch
          options={codes.map((code) => ({
            label: `(${code.codigo}) ${code.glosa}`,
            value: `(${code.codigo}) ${code.glosa}`,
          }))}
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
      <Form.Item name="phone" rules={rules_items.phone}>
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
      <SelectLocations form={form} />
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
