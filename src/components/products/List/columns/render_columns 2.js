import React from "react";
import { controller } from "../../../../controllers/products";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { selectProduct } from "../../../../controllers/products/create_update_form";
import { Button, Descriptions, Flex, Popconfirm, Tag } from "antd";
import {
  DeleteFilled,
  PlusOutlined,
  MinusOutlined,
  DisconnectOutlined,
  BarcodeOutlined,
  EditFilled,
} from "@ant-design/icons";
import ModalHistory from "../ModalHistory";

export const renderName = (x) => {
  let render = (
    <Flex vertical gap={"small"}>
      <b>{x.name}</b>
      {x.code && <Tag icon={<BarcodeOutlined />}>{x.code.toUpperCase()}</Tag>}
    </Flex>
  );
  return render;
};

export const renderPriceCost = (x) => {
  const items = [
    { label: "Venta", children: formatCurrency(x.price) },
    { label: "Costo", children: formatCurrency(x.price_internal) },
    {
      label: "Utilidad",
      children: (
        <Tag>
          {(((x.price - x.price_internal) / x.price) * 100).toFixed(2)}%
        </Tag>
      ),
    },
  ];
  return (
    <Descriptions size="small" layout="vertical" colon={false} items={items} />
  );
};

export const renderInventory = (x, dispatch) => {
  x.quantity = parseInt(x.quantity);

  if (isNaN(x.quantity)) {
    return (
      <center>
        Sin gestión de inventario
        <br />
        <DisconnectOutlined />
      </center>
    );
  } else {
    return (
      <Flex gap={"small"}>
        <ModalHistory product={x} />
        <Button
          icon={<PlusOutlined />}
          type="primary"
          shape="circle"
          size="small"
          onClick={() => {
            controller.list_table.select_add_or_substract(x, true, dispatch);
          }}
        />
        <Button
          icon={<MinusOutlined />}
          type="primary"
          shape="circle"
          disabled={x.quantity === 0}
          size="small"
          onClick={() => {
            controller.list_table.select_add_or_substract(x, false, dispatch);
          }}
        />
      </Flex>
    );
  }
};

export const renderButtons = (x, dispatch, notification) => {
  return (
    <Flex gap={"small"} vertical>
      <Button
        size="small"
        block
        onClick={() => selectProduct(x, dispatch)}
        icon={<EditFilled />}
      >
        Editar
      </Button>
      <Popconfirm
        title={"Estas seguro de eliminar el producto?"}
        onConfirm={() => controller.delete(x, dispatch, notification)}
      >
        <Button type="primary" icon={<DeleteFilled />} size="small" block />
      </Popconfirm>
    </Flex>
  );
};

export const renderNameForShort = (x, dispatch) => {
  let render = (
    <Flex vertical gap={"small"}>
      <b>{x.name}</b>
      {x.code && <Tag icon={<BarcodeOutlined />}>{x.code.toUpperCase()}</Tag>}
      {renderInventory(x, dispatch)}
    </Flex>
  );
  return render;
};
