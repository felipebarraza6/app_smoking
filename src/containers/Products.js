import React, { createContext, useReducer, useMemo, memo } from "react";
import { Col, Row } from "antd";
import CreateUpdate from "../components/products/CreateUpdate/Component";
import List from "../components/products/List/Component";
import AnimatedContainer from "./AnimatedContainer";
import { productsReducer } from "../reducers/productsReducer";
import AdminCategories from "../components/products/List/categories/AdminCategories";
import { defaultGutterRow } from "../utils/layout";

/**
 * Container principal para la gestión de productos.
 * Provee contexto y estado global para la sección de productos.
 * Estructura:
 * - state: { list, categories, branchs, countUpdate, select_to_edit, add_quantity, sus_quantity, filters }
 * - dispatch: acciones del reducer productsReducer
 * Renderiza el listado, categorías y el formulario de creación/edición.
 */

export const ProductsContext = createContext();

const Products = memo(() => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
    },
    categories: {
      list: [],
      count: 0,
      select_to_edit: null,
    },
    branchs: {
      list: [],
      count: 0,
    },
    countUpdate: 0,
    select_to_edit: null,
    add_quantity: false,
    sus_quantity: false,
    filters: {
      search: "",
      category: null,
      branch: null,
      code: null,
    },
  };

  const gutterRow = useMemo(() => defaultGutterRow, []);

  const [state, dispatch] = useReducer(productsReducer, initialState);

  return (
    <AnimatedContainer>
      <ProductsContext.Provider value={{ state, dispatch }}>
        <Row justify={"space-around"} gutter={gutterRow} gap={"small"}>
          <Col xl={18} xs={24}>
            <AdminCategories />
            <List />
          </Col>
          <Col xl={6} xs={24}>
            <CreateUpdate />
          </Col>
        </Row>
      </ProductsContext.Provider>
    </AnimatedContainer>
  );
});

export default Products;
