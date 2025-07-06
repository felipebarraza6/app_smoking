import React, { createContext, useReducer } from "react";
import Create from "../components/orders/Create/OrderCreateMain";
import { ordersReducer } from "../reducers/ordersReducer";
import AnimatedContainer from "./AnimatedContainer";

/**
 * Container principal para la gestión de órdenes.
 * Provee contexto y estado global para la sección de órdenes.
 * Estructura:
 * - state: { branchs, products, order, drivers, clients, payments, steps }
 * - dispatch: acciones del reducer ordersReducer
 * Renderiza el flujo de creación de órdenes.
 */

export const OrdersContext = createContext();

const Orders = () => {
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

  const [state, dispatch] = useReducer(ordersReducer, initialState);

  return (
    <OrdersContext.Provider value={{ state, dispatch }}>
      <AnimatedContainer>
        <Create />
      </AnimatedContainer>
    </OrdersContext.Provider>
  );
};

export default Orders;
