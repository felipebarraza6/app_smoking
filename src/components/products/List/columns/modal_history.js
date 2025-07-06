import React from "react";
import { Tag, Flex } from "antd";
import { FaTruckFast } from "react-icons/fa6";

export const columns = [
  {
    title: `Fecha`,
    dataIndex: `created`,
    render: (x) => (
      <>
        {x.slice(2, 10)} {x.slice(11, 16)} hrs
      </>
    ),
  },
  {
    title: `Cantidad`,
    align: "right",
    render: (r) => (
      <>
        {r.quantity === r.product.quantity_alert ? (
          <Tag style={{ color: "red" }}>
            <b>{r.quantity}</b>
          </Tag>
        ) : (
          <Tag>
            {r.quantity > 0 && "+"}
            {r.quantity}
          </Tag>
        )}{" "}
        ({r.actual_quantity}) {r.product.type_medition}{" "}
      </>
    ),
  },
  {
    title: `Usuario`,
    dataIndex: `user`,
    align: "center",
    render: (user) => user && user.first_name + " " + user.last_name,
  },
  {
    title: `Procedencía`,
    align: "center",
    render: (r) =>
      r.is_sale_order === true ? (
        <Flex justify="space-between">
          {r.is_delivery && (
            <FaTruckFast
              style={{ marginRight: "5px", color: "green", fontSize: "15px" }}
            />
          )}
          {r.order.is_order === true && (
            <>
              <Tag>Pedido</Tag> {r.order.id}
            </>
          )}{" "}
          {r.order.is_sale === true && (
            <>
              <Tag>Venta</Tag> {r.order.id}
            </>
          )}{" "}
        </Flex>
      ) : (
        `Gestión de inventario`
      ),
  },
];
