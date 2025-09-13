import React, { useState, useContext } from "react";
import { Modal, Button } from "antd";
import { OrderedListOutlined } from "@ant-design/icons";
import ListCategories from "./ListCategories";
import { ProductsContext } from "../../../../containers/Products";
import { categories } from "../../../../api/endpoints/products";

const ModalCategories = () => {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(ProductsContext);

  const openModal = async () => {
    setOpen(true);
    // Verificar si ya hay categorías cargadas
    if (!state.categories?.list || state.categories.list.length === 0) {
      // Solo cargar si no hay categorías ya cargadas
      try {
        console.log("🔄 Categories not loaded yet, fetching...");
        const response = await categories.list();
        console.log("✅ Categories response:", response);
        
        const categoriesData = response?.results || response || [];
        console.log("📊 Categories data:", categoriesData);
        
        dispatch({
          type: "set_categories",
          payload: {
            categories: categoriesData,
          },
        });
      } catch (error) {
        console.error("❌ Error loading categories:", error);
        console.error("❌ Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        dispatch({
          type: "set_categories",
          payload: {
            categories: [],
          },
        });
      }
    } else {
      console.log("✅ Categories already loaded:", state.categories.list.length, "categories");
    }
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
