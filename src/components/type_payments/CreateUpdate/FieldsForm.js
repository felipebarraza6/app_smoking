import React, { useContext } from "react";
import { Form, Button, Row, Select } from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { TypePaymentsContext } from "../../../containers/TypePayments";
import { FaMoneyCheck, FaMoneyBills } from "react-icons/fa6";
import { BiTransferAlt } from "react-icons/bi";
import { RiBankLine } from "react-icons/ri";

import { controller } from "../../../controllers/type_payments";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(TypePaymentsContext);

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

  return (
    <>
      <Form.Item name="name" rules={rules_items.name}>
        <Select placeholder="Seleccione una opción" style={{ width: "100%" }}>
          <Select.Option value="efectivo">
            <FaMoneyBills /> Efectivo
          </Select.Option>
          <Select.Option value="debito">
            <FaMoneyCheck /> Debito
          </Select.Option>
          <Select.Option value="credito">
            <FaMoneyCheck /> Credito
          </Select.Option>
          <Select.Option value="transferencia">
            <BiTransferAlt /> Transferencia
          </Select.Option>
          <Select.Option value="deposito">
            <RiBankLine /> Depósito
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Row
          justify={"space-evenly"}
          gutter={[
            { xs: 12, xl: 12 },
            { xl: 5, xs: 5 },
          ]}
        >
          <Button
            htmlType="submit"
            type={"primary"}
            icon={iconBtnLeft}
            size="small"
            block
          >
            {state.select_to_edit ? "Actualizar" : "Agregar"}
          </Button>
          <Button
            onClick={onClickCreateOrClear}
            icon={iconBtnRight}
            block
            size="small"
          >
            {state.select_to_edit ? "Crear" : "Limpiar"}
          </Button>
        </Row>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
