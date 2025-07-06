import React, { createContext, useReducer, useMemo } from "react";
import { Col, Row } from "antd";
import List from "../components/type_payments/List/Component";
import CreateUpdate from "../components/type_payments/CreateUpdate/Component";
import AnimatedContainer from "./AnimatedContainer";
import { typePaymentsReducer } from "../reducers/typePaymentsReducer";
import { defaultGutterRow } from "../utils/layout";

export const TypePaymentsContext = createContext();

/**
 * Container principal para la gestión de tipos de pago.
 * Provee contexto y estado global para la sección de tipos de pago.
 * Estructura:
 * - state: { list, branchs, countUpdate, select_to_edit, filters }
 * - dispatch: acciones del reducer typePaymentsReducer
 * Renderiza el listado y el formulario de creación/edición.
 */
const TypePayments = () => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
    },
    branchs: {
      list: [],
      count: 0,
    },
    countUpdate: 0,
    select_to_edit: null,
    filters: {
      branch: null,
    },
  };

  const gutterRow = useMemo(() => defaultGutterRow, []);

  const [state, dispatch] = useReducer(typePaymentsReducer, initialState);

  return (
    <AnimatedContainer>
      <TypePaymentsContext.Provider value={{ state, dispatch }}>
        <Row justify={"space-around"} gutter={gutterRow}>
          <Col xl={12} xs={24}>
            <List />
          </Col>
          <Col xl={7} xs={24}>
            <CreateUpdate />
          </Col>
        </Row>
      </TypePaymentsContext.Provider>
    </AnimatedContainer>
  );
};

export default TypePayments;
