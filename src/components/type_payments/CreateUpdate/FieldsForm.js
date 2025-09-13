import React, { useContext } from "react";
import { Form, Button, Row, Select } from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { TypePaymentsContext } from "../../../containers/TypePayments";
import { FaMoneyCheck, FaMoneyBills } from "react-icons/fa6";
import { BiTransferAlt } from "react-icons/bi";
import { RiBankLine } from "react-icons/ri";

import { controller } from "../../../controllers/type_payments";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(TypePaymentsContext);

  // Debug: Ver qué datos tenemos
  console.log("🔍 TypePayments state.branchs:", state.branchs);

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
      <Form.Item name="branch" rules={rules_items.branch}>
        <Select 
          placeholder={
            !Array.isArray(state.branchs?.list) 
              ? "Cargando sucursales..." 
              : state.branchs.list.length === 0 
              ? "Sin sucursales disponibles"
              : "Selecciona una sucursal"
          }
          style={{ width: "100%" }}
          loading={!Array.isArray(state.branchs?.list)}
          notFoundContent="Sin sucursales disponibles"
          disabled={!Array.isArray(state.branchs?.list) || state.branchs.list.length === 0}
        >
          {Array.isArray(state.branchs?.list) && state.branchs.list.length > 0 
            ? state.branchs.list.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  <ShopOutlined style={{ marginRight: 8 }} />
                  {branch.business_name || branch.name || `Sucursal ${branch.id}`}
                </Select.Option>
              ))
            : []
          }
        </Select>
      </Form.Item>

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
            disabled={!Array.isArray(state.branchs?.list) || state.branchs.list.length === 0}
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
