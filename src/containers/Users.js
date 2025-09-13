/**
 * Container principal para la gestión de usuarios.
 * Provee contexto y estado global para la sección de usuarios.
 * Estructura:
 * - state: { list, select_to_edit }
 * - dispatch: acciones del reducer usersReducer
 * Renderiza el listado y el formulario de creación/edición.
 */
import React, { createContext, useReducer, memo } from "react";

import List from "../components/users/List/Component";
import AnimatedContainer from "./AnimatedContainer";

import { usersReducer } from "../reducers/usersReducer";

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

  const [state, dispatch] = useReducer(usersReducer, initialState);

  return (
    <AnimatedContainer>
      <UsersContext.Provider value={{ state, dispatch }}>
        <List />
      </UsersContext.Provider>
    </AnimatedContainer>
  );
});

export default Users;
