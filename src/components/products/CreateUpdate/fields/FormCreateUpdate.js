import React, { useContext } from "react";
import { Form, Input, Select } from "antd";
import { rules } from "../rules_form";
import {
  BarcodeOutlined,
  DollarOutlined,
  ShopFilled,
  OrderedListOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import IsStock from "../IsStock";
import { ProductsContext } from "../../../../containers/Products";

const FormCreateUpdate = ({ isStock, setIsStock, form }) => {
  const { state } = useContext(ProductsContext);
  const rules_items = rules(state);

  const filterOption = (input, option) =>
    option.label.toLowerCase().includes(input.toLowerCase());

  const optionsBranchs = state.branchs.list.map((branch) => ({
    key: branch.id,
    label: branch.business_name,
    value: branch.id,
  }));

  const optionsCategories = state.categories.list.map((category) => ({
    key: category.id,
    label: category.name,
    value: category.id,
  }));

  return (
    <>
      <Form.Item name="name" rules={rules_items.name}>
        <Input placeholder="Nombre" prefix={<ContainerOutlined />} />
      </Form.Item>
      <Form.Item name="code" rules={rules_items.code}>
        <Input placeholder="Código" prefix={<BarcodeOutlined />} />
      </Form.Item>
      <Form.Item name="branch" rules={rules_items.branch}>
        <Select
          placeholder="Sucursal"
          suffixIcon={<ShopFilled />}
          showSearch
          value={state.select_to_edit ? state.select_to_edit.branch.id : null}
          options={optionsBranchs}
          filterOption={filterOption}
        />
      </Form.Item>
      <Form.Item name="category" rules={rules_items.category}>
        <Select
          placeholder={"Categoría"}
          showSearch
          suffixIcon={<OrderedListOutlined />}
          value={state.select_to_edit ? state.select_to_edit.category.id : null}
          options={optionsCategories}
          filterOption={filterOption}
        ></Select>
      </Form.Item>
      <Form.Item name="price" rules={rules_items.price}>
        <Input placeholder="Precio" prefix={<DollarOutlined />} />
      </Form.Item>
      <Form.Item name="price_internal" rules={rules_items.price_internal}>
        <Input placeholder="Costo" prefix={<DollarOutlined />} />
      </Form.Item>
      <IsStock form={form} isStock={isStock} setIsStock={setIsStock} />
    </>
  );
};

export default FormCreateUpdate;
