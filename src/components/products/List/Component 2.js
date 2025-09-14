import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { App, Table } from "antd";
import { ProductsContext } from "../../../containers/Products";
import { defaultColumn, shortColumn } from "./columns_table";
import FooterAction from "./FooterAction";
import FormFilters from "./FormFilters";
import { controller } from "../../../controllers/products";
import { AppContext } from "../../../App";

const List = () => {
  const { state, dispatch } = useContext(ProductsContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();
  const { state: appState } = useContext(AppContext);
  const userBranches = Array.isArray(appState?.branches)
    ? appState.branches
    : [];

  // Memoizar las columnas para evitar recálculos
  const columnsTable = useMemo(() => {
    if (widthScreen < 600) {
      return shortColumn(dispatch, notification);
    } else {
      return defaultColumn(dispatch, notification);
    }
  }, [widthScreen, dispatch, notification]);

  // Memoizar la paginación
  const pagination = useMemo(
    () => ({
      total: state.list?.count || 0,
      pageSize: 4,
      onChange: (page) => dispatch({ type: "change_page", page: page }),
    }),
    [state.list?.count, dispatch]
  );

  // Optimizar el handler de resize
  const handleResize = useCallback(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  useEffect(() => {
    controller.list(state, dispatch, setLoading);

    // Agregar event listener con cleanup
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [state.countUpdate, state.list?.page, state.filters, handleResize]);

  return (
    <>
      <Table
        dataSource={state.list?.results || []}
        title={FormFilters}
        bordered
        loading={loading}
        rowKey={"id"}
        size="small"
        pagination={pagination}
        columns={columnsTable}
        footer={FooterAction}
      />
    </>
  );
};

export default List;
