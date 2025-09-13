import React, { useContext, useEffect, useState } from "react";
import { Table, App } from "antd";
import { BranchsContext } from "../../../containers/Branchs";
import { controller } from "../../../controllers/branchs";
import { defaultColumn, shortColumn, expandableRow } from "./columns_table";
import { AppContext } from "../../../App";

const List = ({ onManageUsers, canManageBranch, userRoles }) => {
  const { state, dispatch } = useContext(BranchsContext);
  const { state: appState } = useContext(AppContext);
  const user = appState.user;
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [columnsTable, setColumnsTable] = useState(defaultColumn(dispatch));
  const { notification } = App.useApp();

  // Asegurar que dataSource siempre sea un array
  const dataSource = Array.isArray(state.list?.results)
    ? state.list.results
    : [];

  const pagination = {
    total: state.list?.count || 0,
    onChange: (page) => controller.pagination(page, dispatch),
    simple: true,
  };

  const expandable = {
    expandedRowRender: (record) => expandableRow(record),
  };

  // Efecto SOLO para manejar el resize y columnas
  useEffect(() => {
    const handleResize = () => setWidthScreen(window.innerWidth);
    window.addEventListener("resize", handleResize);
    // Setea columnas según el tamaño
    if (widthScreen < 600) {
      setColumnsTable(
        shortColumn(
          dispatch,
          notification,
          onManageUsers,
          user,
          canManageBranch,
          userRoles
        )
      );
    } else {
      setColumnsTable(
        defaultColumn(
          dispatch,
          notification,
          onManageUsers,
          user,
          canManageBranch,
          userRoles
        )
      );
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [
    widthScreen,
    dispatch,
    notification,
    onManageUsers,
    user,
    canManageBranch,
    userRoles,
  ]);

  // Efecto para recargar cuando se actualice countUpdate
  useEffect(() => {
    if (state.list?.countUpdate > 0) {
      // Notificar al contexto padre que recargue las tiendas
      window.dispatchEvent(new CustomEvent('reloadBranches'));
    }
  }, [state.list?.countUpdate]);

  return (
    <Table
      dataSource={dataSource}
      expandable={expandable}
      bordered
      rowKey={(record) => record.id}
      size="small"
      loading={!Array.isArray(state.list?.results)}
      variant="bordered"
      pagination={pagination}
      columns={columnsTable}
    />
  );
};

export default List;
