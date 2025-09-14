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
  UnorderedListOutlined,
  PhoneOutlined,
  BuildOutlined,
  ShopFilled,
} from "@ant-design/icons";
import { ClientsContext } from "../../../containers/Clients";
import { controller } from "../../../controllers/clients";
import SelectLocations from "./fields/SelectLocations";
import { codes } from "../../../utils/sii_code";
import { AppContext } from "../../../App";
import BranchSelector from "../../common/BranchSelector";

import RUT from "rut-chile";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(ClientsContext);
  const { state: appState } = useContext(AppContext);

  const rules_items = rules(state);

  // Obtener sucursal filtrada globalmente (si existe)
  const globalBranchFilter = appState?.filters?.branch || null;
  const userBranches = Array.isArray(appState?.branches)
    ? appState.branches
    : [];

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
        <Input placeholder="Nombre" prefix={<BuildOutlined />} />
      </Form.Item>
      <Form.Item name="branch" rules={rules_items.branch}>
        <BranchSelector
          value={globalBranchFilter || form.getFieldValue("branch")}
          onChange={(val) => form.setFieldsValue({ branch: val })}
          placeholder="Selecciona una sucursal"
          showRole={true}
          style={{ minWidth: 200 }}
          hookOptions={{
            includeAllOption: false,
            showRoles: true,
            filterByRole: null,
          }}
          disabled={!!globalBranchFilter}
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
      <Form.Item name="phone_number" rules={rules_items.phone}>
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
      <Form.Item
        name="commercial_business"
        rules={rules_items.commercial_business}
      >
        <Select
          placeholder={"Giro"}
          suffixIcon={<UnorderedListOutlined />}
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            option.value.toLowerCase().includes(input.toLowerCase())
          }
          options={codes.map((code) => ({
            label: `(${code.codigo}) ${code.glosa}`,
            value: `(${code.codigo}) ${code.glosa}`,
          }))}
        />
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
