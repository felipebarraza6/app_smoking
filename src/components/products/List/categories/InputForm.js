import React, { useContext, useState, useEffect } from "react";
import { Form, Input, Button, Flex } from "antd";
import { PlusCircleFilled, ClearOutlined } from "@ant-design/icons";
import { controller } from "../../../../controllers/products";
import { ProductsContext } from "../../../../containers/Products";

const InputForm = () => {
  const { dispatch } = useContext(ProductsContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  const rules = {
    name: [{ required: true, message: "Ingresa el nombre", min: 1 }],
  };
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.name.length > 0) {
      controller.category.create(values, dispatch, form);
    }
  };

  const FlexButtons = () => (
    <Flex gap={"small"}>
      <Button
        type="primary"
        block={isMobile === "horizontal" ? true : false}
        shape={isMobile === "horizontal" ? "round" : "default"}
        children={isMobile === "horizontal" ? "Agregar" : ""}
        htmlType="submit"
        icon={<PlusCircleFilled />}
      />
      <Button
        type="default"
        block={isMobile === "horizontal" ? true : false}
        shape={isMobile === "horizontal" ? "round" : "default"}
        children={isMobile === "horizontal" ? "Limpiar" : ""}
        onClick={() => form.resetFields()}
        icon={<ClearOutlined />}
      />
    </Flex>
  );

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
    if (widthScreen < 600) {
      setIsMobile("horizontal");
    } else {
      setIsMobile("inline");
    }
  }, [widthScreen]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value.length > 0) {
      form.setFieldsValue({ name: value });
    }
  };

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        layout={widthScreen > 600 ? "inline" : "horizontal"}
      >
        <Form.Item name="name" rules={rules.name}>
          <Input placeholder="Nombre categoría" onChange={handleInputChange} />
        </Form.Item>
        <FlexButtons />
      </Form>
    </>
  );
};

export default InputForm;
