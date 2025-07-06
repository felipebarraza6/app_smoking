import React, { createContext, useReducer } from "react";
import Create from "../components/sale/Create/Component";
import AnimatedContainer from "./AnimatedContainer";
import { saleReducer } from "../reducers/saleReducer";

/**
 * Container principal para la gestión de ventas.
 * Provee contexto y estado global para la sección de ventas.
 * Estructura:
 * - state: { branchs, products, order, drivers, clients, payments, steps }
 * - dispatch: acciones del reducer saleReducer
 * Renderiza el flujo de creación de ventas.
 */

export const SaleContext = createContext();

const Sale = () => {
  const initialState = {
    branchs: {
      list: [],
      count: 0,
      selected: null,
    },
    products: {
      list: [],
      selected_products: [],
      categories: [],
      page: 1,
      count: 0,
      filters: {
        search: "",
        code: "",
        category: "",
      },
    },
    order: {
      create_id: null,
      created: null,
    },
    drivers: {
      list: [],
      selected: null,
      count: 0,
    },
    clients: {
      list: [],
      selected: null,
      count: 0,
      page: 1,
      filters: {
        search: "",
      },
      is_created: true,
    },

    payments: {
      list: [],
      selected: null,
      type_payments: [],
      paytotal: 0,
      count: 0,
      validate: false,
    },
    steps: {
      current: 0,
      loading: false,
    },
  };

  const [state, dispatch] = useReducer(saleReducer, initialState);

  return (
    <AnimatedContainer>
      <SaleContext.Provider value={{ state, dispatch }}>
        <Create />
      </SaleContext.Provider>
    </AnimatedContainer>
  );
};

export default Sale;
