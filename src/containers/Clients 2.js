import React, { createContext, useReducer, useMemo, memo } from "react";
import { Row, Col } from "antd";
import { clientsReducer } from "../reducers/clientsReducer";
import List from "../components/clients/List/Component";
import CreateUpdate from "../components/clients/CreateUpdate/Component";
import AnimatedContainer from "./AnimatedContainer";
import { defaultGutterRow } from "../utils/layout";

/**
 * Container principal para la gestión de clientes.
 * Provee contexto y estado global para la sección de clientes.
 * Estructura:
 * - state: { list, form, select_to_edit, contacts, branchs, filters }
 * - dispatch: acciones del reducer clientsReducer
 * Renderiza el listado y el formulario de creación/edición.
 */

export const ClientsContext = createContext();

const Clients = memo(() => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
      countUpdate: 0,
    },
    form: {
      region: true,
      province: false,
      commune: false,
    },
    select_to_edit: null,
    contacts: {
      list: [],
      count: 0,
      select_to_edit: null,
    },
    branchs: [],
    filters: {
      name: null,
      dni: null,
      branch: null,
    },
  };

  const gutterRow = useMemo(() => defaultGutterRow, []);

  const [state, dispatch] = useReducer(clientsReducer, initialState);

  return (
    <AnimatedContainer>
      <ClientsContext.Provider value={{ state, dispatch }}>
        <Row justify={"space-around"} gutter={gutterRow}>
          <Col xl={17} xs={24}>
            <List />
          </Col>
          <Col xl={7} xs={24}>
            <CreateUpdate />
          </Col>
        </Row>
      </ClientsContext.Provider>
    </AnimatedContainer>
  );
});

export default Clients;
