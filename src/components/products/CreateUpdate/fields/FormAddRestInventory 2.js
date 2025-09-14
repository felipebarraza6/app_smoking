import React, { useContext } from "react";
import { Form, InputNumber } from "antd";
import { rules } from "../rules_form";
import { ProductsContext } from "../../../../containers/Products";

const FormAddRestInventory = () => {
  const { state } = useContext(ProductsContext);
  const rules_items = rules(state);

  return (
    <Form.Item label="Cantidad" name="quantity" rules={rules_items.quantity}>
      <InputNumber placeholder={"0"} min={1} />
    </Form.Item>
  );
};

export default FormAddRestInventory;
