import React, { createContext, useReducer, useMemo, useEffect } from "react";
import { Col, Row } from "antd";
import List from "../components/type_payments/List/Component";
import CreateUpdate from "../components/type_payments/CreateUpdate/Component";
import AnimatedContainer from "./AnimatedContainer";
import { typePaymentsReducer } from "../reducers/typePaymentsReducer";
import { defaultGutterRow } from "../utils/layout";
import { my_branches_for_filters } from "../api/endpoints/branchs";

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

  useEffect(() => {
    const loadBranches = async () => {
      try {
        console.log("🔄 Loading branches...");
        const response = await my_branches_for_filters();
        console.log("✅ Branches response:", response);

        // Handle different response structures
        let branchList = [];
        if (Array.isArray(response)) {
          branchList = response;
        } else if (response?.results && Array.isArray(response.results)) {
          branchList = response.results;
        } else if (response?.data && Array.isArray(response.data)) {
          branchList = response.data;
        }

        // Filter out the "all" option since it's not a real branch
        branchList = branchList.filter(
          (branch) => branch.id !== "all" && branch.is_all_option !== true
        );

        console.log("📋 Final branch list:", branchList);
        dispatch({
          type: "set_branchs",
          payload: {
            list: branchList,
            count: branchList.length,
          },
        });
      } catch (error) {
        console.error("Error loading branches:", error);
        dispatch({
          type: "set_branchs",
          payload: {
            list: [],
            count: 0,
          },
        });
      }
    };

    loadBranches();
  }, []);

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
