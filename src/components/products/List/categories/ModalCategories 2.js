import React, { useState, useContext } from "react";
import { Modal, Button } from "antd";
import { OrderedListOutlined } from "@ant-design/icons";
import ListCategories from "./ListCategories";
import { ProductsContext } from "../../../../containers/Products";
import { controller } from "../../../../controllers/products";

const ModalCategories = () => {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(ProductsContext);

  const openModal = () => {
    setOpen(true);
    controller.list(state, dispatch);
  };

  return (
    <>
      <Modal
        title="Categorías"
        open={open}
        onOk={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        footer={[]}
      >
        <ListCategories />
      </Modal>
      <Button icon={<OrderedListOutlined />} onClick={openModal}>
        Categorías
      </Button>
    </>
  );
};

export default ModalCategories;
