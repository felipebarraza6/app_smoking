/** @jsxImportSource @emotion/react */

import React, { useContext } from "react";
import { Table, Button, Row, Input, Popconfirm, Tag, Form, App } from "antd";
import { ProductsContext } from "../../../../containers/Products";
import { controller } from "../../../../controllers/products";
import { DeleteFilled } from "@ant-design/icons";
import { css } from "@emotion/react";

const ListCategories = () => {
  const { state, dispatch } = useContext(ProductsContext);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const dataSource = state.categories?.list || [];

  console.log("🏷️ Categories state:", state.categories);
  console.log("📋 Categories dataSource:", dataSource);

  const onChangeInput = (e) => {
    if (e.target.value.length > 0) {
      controller.category.update(e, dispatch);
      message.success("Categoría actualizada");
      form.resetFields();
    }
  };

  const inputStyled = css({
    width: "150px",
  });

  const columns = [
    {
      title: "Nombre",
      render: (text) => (
        <Form layout="inline" form={form}>
          <Form.Item
            name={text.id}
            rules={[{ required: true, message: "Ingresa el nombre" }]}
            help={false}
          >
            <Input
              name={text.id}
              placeholder={text.name}
              onBlur={onChangeInput}
              css={inputStyled}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Sucursal",
      render: (x) => (
        <Row justify={"center"}>
          <Tag color="blue">{x.branch_name || "Sin asignar"}</Tag>
        </Row>
      ),
    },
    {
      title: "Productos",
      render: (x) => (
        <Row justify={"center"}>
          <Tag>{x.product_count || 0}</Tag>
        </Row>
      ),
    },
    {
      render: (x) => (
        <Row justify={"center"}>
          <Popconfirm
            title="¿Estás seguro de eliminar esta categoría ?"
            description="Se eliminaran todos los productos y sus historiales de inventario."
            onConfirm={async () => {
              try {
                console.log("🚀 Starting category deletion for ID:", x.id);
                await controller.category.destroy(x.id, dispatch);
                message.success("Categoría eliminada correctamente");
              } catch (error) {
                console.error("💥 Category deletion failed:", error);
                message.error("Error al eliminar la categoría");
              }
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="primary"
              size="small"
              icon={<DeleteFilled />}
            ></Button>
          </Popconfirm>
        </Row>
      ),
    },
  ];

  const sortedDataSource = Array.isArray(dataSource)
    ? [...dataSource].sort(
        (a, b) => (b.product_count || 0) - (a.product_count || 0)
      )
    : [];

  return (
    <Table
      bordered
      columns={columns}
      dataSource={sortedDataSource}
      size="small"
      style={{ marginTop: "20px" }}
    />
  );
};

export default ListCategories;
