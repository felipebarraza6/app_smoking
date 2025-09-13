import React, { useContext } from "react";
import { Form, Input, Select } from "antd";
import { rules } from "../rules_form";
import {
  BarcodeOutlined,
  DollarOutlined,
  ShopFilled,
  OrderedListOutlined,
  ContainerOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import IsStock from "../IsStock";
import { ProductsContext } from "../../../../containers/Products";

const FormCreateUpdate = ({ isStock, setIsStock, form }) => {
  const { state } = useContext(ProductsContext);
  const rules_items = rules(state);

  const filterOption = (input, option) =>
    option.label.toLowerCase().includes(input.toLowerCase());

  const branchsList = state.branchs?.list || [];
  console.log("🏢 Branches in form:", branchsList);
  
  const optionsBranchs = Array.isArray(branchsList)
    ? branchsList
        .filter((branch) => branch.value !== "all") // Excluir la opción "Todas"
        .map((branch) => ({
          key: branch.value,
          label: branch.label,
          value: branch.value,
        }))
    : [];

  const categoriesList = state.categories?.list || [];
  const optionsCategories = Array.isArray(categoriesList)
    ? categoriesList.map((category) => ({
        key: category.id,
        label: category.name,
        value: category.id,
      }))
    : [];

  // Opciones de tipo de producto
  const productTypeOptions = [
    { key: "SALE", label: "Producto de Venta", value: "SALE" },
    { key: "TOOL", label: "Herramienta/Equipo", value: "TOOL" },
    { key: "RAW_MATERIAL", label: "Materia Prima", value: "RAW_MATERIAL" },
    { key: "FINISHED_GOOD", label: "Producto Terminado", value: "FINISHED_GOOD" },
    { key: "MIXED", label: "Uso Mixto", value: "MIXED" },
  ];

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
      <Form.Item name="product_type" rules={rules_items.product_type}>
        <Select
          placeholder="Tipo de Producto"
          suffixIcon={<TagsOutlined />}
          showSearch
          value={state.select_to_edit ? state.select_to_edit.product_type : "SALE"}
          options={productTypeOptions}
          filterOption={filterOption}
        />
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
