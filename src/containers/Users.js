/**
 * Container principal para la gestión de usuarios.
 * Provee contexto y estado global para la sección de usuarios.
 * Estructura:
 * - state: { list, select_to_edit }
 * - dispatch: acciones del reducer usersReducer
 * Renderiza el listado y el formulario de creación/edición.
 */
import React, { createContext, useReducer, useMemo, memo } from "react";
import { Row, Col } from "antd";

import List from "../components/users/List/Component";
import AnimatedContainer from "./AnimatedContainer";

import CreateUpdate from "../components/users/CreateUpdate/Component";

import { usersReducer } from "../reducers/usersReducer";
import { defaultGutterRow } from "../utils/layout";

export const UsersContext = createContext();

const Users = memo(() => {
  const initialState = {
    list: {
      results: [],
      count: 0,
      page: 1,
      countUpdate: 0,
    },
    select_to_edit: null,
  };

  // Memoizar el gutter para evitar recreaciones
  const gutterRow = useMemo(() => defaultGutterRow, []);

  const [state, dispatch] = useReducer(usersReducer, initialState);

  return (
    <AnimatedContainer>
      <UsersContext.Provider value={{ state, dispatch }}>
        <Row justify={"space-around"} gutter={gutterRow}>
          <Col xl={17} xs={24}>
            <List />
          </Col>
          <Col xl={7} xs={24}>
            <CreateUpdate />
          </Col>
        </Row>
      </UsersContext.Provider>
    </AnimatedContainer>
  );
});

export default Users;
