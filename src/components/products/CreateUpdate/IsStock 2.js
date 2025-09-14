import React, { useContext, useEffect } from "react";
import { Form, Input, Select, Checkbox } from "antd";
import {
  FieldNumberOutlined,
  HighlightOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { rules } from "./rules_form";

import { ProductsContext } from "../../../containers/Products";

const IsStock = ({ form, isStock, setIsStock }) => {
  const { state } = useContext(ProductsContext);
  const rules_items = rules(state);

  const options = [
    { label: "Unidad (ud)", value: "ud" },
    { label: "Kilogramos (kg)", value: "kg" },
    { label: "Litros (lt)", value: "lt" },
    { label: "Metros (m)", value: "m" },
    { label: "Gramos (g)", value: "g" },
    { label: "Mililitros (ml)", value: "ml" },
    { label: "Centímetros (cm)", value: "cm" },
    { label: "Milímetros (mm)", value: "mm" },
  ];

  const onChange = (e) => {
    if (e.target.checked) {
      setIsStock(true);
      form.resetFields(["quantity", "quantity_altert"]);
    } else {
      form.resetFields(["quantity", "quantity_altert"]);
      setIsStock(false);
    }
  };

  useEffect(() => {
    if (state.select_to_edit) {
      let edit = parseInt(state.select_to_edit.quantity);

      if (!isNaN(edit)) {
        setIsStock(true);
      } else {
        setIsStock(false);
        form.setFieldsValue({ quantity: null, quantity_altert: null });
      }
    } else {
      setIsStock(false);
    }
  }, [state.select_to_edit]);

  return (
    <>
      <Checkbox
        style={{ marginBottom: "10px" }}
        onChange={onChange}
        checked={isStock}
      />{" "}
      Gestión de inventario?
      {isStock && (
        <>
          <Form.Item name="type_medition" rules={rules_items.type_medition}>
            <Select
              placeholder="Medida"
              options={options}
              suffixIcon={<HighlightOutlined />}
            />
          </Form.Item>
          <Form.Item name="quantity" rules={rules_items.quantity}>
            <Input
              placeholder="Cantidad inicial"
              prefix={<FieldNumberOutlined />}
              suffix={form.getFieldValue("type_medition")}
            />
          </Form.Item>
          <Form.Item name="quantity_altert" rules={rules_items.quantity_altert}>
            <Input
              placeholder="Cantidad de alerta"
              suffix={form.getFieldValue("type_medition")}
              prefix={<AlertOutlined />}
            />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default IsStock;
