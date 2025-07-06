import React, { useState, useContext, useEffect } from "react";
import {
  Drawer,
  Button,
  Flex,
  Table,
  Tag,
  InputNumber,
  Popconfirm,
} from "antd";
import { ShoppingCartOutlined, DeleteFilled } from "@ant-design/icons";
import { OrdersContext } from "../../../../containers/Orders";
import { MdDeleteSweep } from "react-icons/md";
import api from "../../../../api/endpoints";

const SiderCart = () => {
  const [visible, setVisible] = useState(false);
  const { state, dispatch } = useContext(OrdersContext);
  const products = state.products.selected_products;

  useEffect(() => {}, [products]);

  return (
    <>
      <Button
        icon={
          <Flex>
            <ShoppingCartOutlined style={{ marginRight: "3px" }} />
            {state.products.selected_products.length}
          </Flex>
        }
        disabled={state.products.selected_products.length === 0}
        style={{ margin: "8px 0" }}
        onClick={() => setVisible(true)}
      >
        Producto{state.products.selected_products.length > 1 ? "s" : ""}
      </Button>
      <Drawer
        width={700}
        title="Productos seleccionados"
        theme="light"
        open={visible}
        onClose={() => setVisible(false)}
      >
        <Table
          scroll={{ x: "max-content" }}
          footer={() => (
            <Flex justify="end">
              <Popconfirm
                title="¿Estás seguro de vaciar el carrito, se reiniciara la venta?"
                onConfirm={async () => {
                  dispatch({ type: "clear_selected_products" });
                  setVisible(false);
                  if (state.order.create_id) {
                    await api.orders
                      .delete(state.order.create_id)
                      .then(() => {
                        dispatch({ type: "reset_all" });
                      })
                      .catch((error) => {

                      });
                  }
                }}
                okText="Si"
                cancelText="No"
              >
                <Button type="primary" icon={<MdDeleteSweep />}>
                  Vaciar carrito
                </Button>
              </Popconfirm>
            </Flex>
          )}
          dataSource={[
            ...products,

            ...(products.length > 1
              ? [
                  {
                    id: "total",
                    name: <b>Total</b>,

                    quantity: products.reduce(
                      (acc, product) => acc + product.quantity,
                      0
                    ),
                    price: products.reduce(
                      (acc, product) => acc + product.price * product.quantity,
                      0
                    ),
                  },
                ]
              : []),
          ]}
          rowKey=""
          bordered
          pagination={false}
          size="small"
          columns={[
            {
              title: "Producto",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Cantidad",
              align: "center",
              key: "quantity",
              render: (record) =>
                record.id !== "total" ? (
                  <Flex justify="center">
                    <InputNumber
                      min={1}
                      max={record.actual_quantity > 0 && record.actual_quantity}
                      style={{ textAlign: "center" }}
                      defaultValue={record.quantity}
                      placeholder={record.quantity}
                      onChange={(value) => {
                        dispatch({
                          type: "update_select_products",
                          payload: {
                            id: record.id,
                            quantity: value,
                          },
                        });
                        if (state.order.create_id) {
                          api.orders.register_products
                            .update(record.id_order_product, {
                              quantity: value,
                            })
                            .then((response) => {

                            })
                            .catch((error) => {

                            });
                        }
                      }}
                    />
                  </Flex>
                ) : (
                  <Flex justify="center">{record.quantity}</Flex>
                ),
            },
            {
              title: "Inventario",
              align: "center",
              key: "quantity",
              render: (record) =>
                record.id !== "total" ? (
                  <Flex justify="center">
                    {record.actual_quantity > 0 ? (
                      <Tag>
                        {record.actual_quantity} (
                        {record.actual_quantity - record.quantity})
                      </Tag>
                    ) : (
                      "S/GI"
                    )}
                  </Flex>
                ) : (
                  <Flex justify="center">
                    <Tag>
                      {products.filter((p) => p.id === record.id)[0]}
                      {products
                        .filter((p) => p.actual_quantity > 0)
                        .reduce((acc, product) => acc + product.quantity, 0)}
                    </Tag>
                  </Flex>
                ),
            },
            {
              title: "Precio unitario",
              key: "price",
              align: "end",
              render: (record) => (
                <Flex justify="end">
                  {record.id == "total"
                    ? ""
                    : parseInt(record.price).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                      })}
                </Flex>
              ),
            },
            {
              title: "Subtotal",
              key: "subtotal",
              align: "end",
              render: (record) =>
                record.id !== "total" ? (
                  <Flex justify="end">
                    {isNaN(record.price * record.quantity)
                      ? ""
                      : (record.price * record.quantity).toLocaleString(
                          "es-CL",
                          {
                            style: "currency",
                            currency: "CLP",
                          }
                        )}
                  </Flex>
                ) : (
                  <Flex justify="end">
                    {isNaN(record.price)
                      ? ""
                      : record.price.toLocaleString("es-CL", {
                          style: "currency",
                          currency: "CLP",
                        })}
                  </Flex>
                ),
            },
            {
              align: "center",
              render: (record) => {
                return record.id !== "total" ? (
                  <Popconfirm
                    title="¿Estás seguro de eliminar este producto?"
                    onConfirm={async () => {
                      dispatch({
                        type: "remove_selected_products",
                        payload: { id: record.id },
                      });
                      if (state.order.create_id) {
                        if (state.products.selected_products.length === 1) {
                          await api.orders
                            .delete(state.order.create_id)
                            .then((r) => {
                              dispatch({ type: "reset_all" });
                            });
                          setVisible(false);
                        } else {
                          await api.orders.register_products.destroy(
                            record.id_order_product
                          );
                        }
                      }
                    }}
                    okText="Si"
                    cancelText="No"
                    disabled={state.products.selected_products.length === 0}
                  >
                    <Button icon={<DeleteFilled />} type="primary" danger />
                  </Popconfirm>
                ) : null;
              },
            },
          ]}
        />
      </Drawer>
    </>
  );
};

export default SiderCart;
