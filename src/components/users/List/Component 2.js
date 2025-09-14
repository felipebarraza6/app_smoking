import React, { useContext, useEffect, useState } from "react";
import { Table, App, Row, Col } from "antd";
import { UsersContext } from "../../../containers/Users";
import { controller } from "../../../controllers/users";
import { defaultColumn, shortColumn } from "./columns_table";
import { AppContext } from "../../../App";
import BranchFilter from "../../common/BranchFilter";

const List = () => {
  const { state, dispatch } = useContext(UsersContext);
  const { state: appState } = useContext(AppContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const { notification } = App.useApp();

  // Inicializar columnsTable después de obtener notification
  const [columnsTable, setColumnsTable] = useState([]);

  const pagination = {
    total: state.list?.count || 0,
    onChange: (page) => controller.pagination(page, dispatch),
    simple: true,
  };

  // Obtener el branch_id actual del contexto de la app
  const currentBranchId = appState.currentBranch?.id || 1;

  // Filtro de sucursales (multi)
  const branchIds = state.list?.branch_ids || [];

  useEffect(() => {
    controller.list(state, dispatch);
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
  }, [state.list?.countUpdate, state.list?.page, branchIds]);

  // Efecto separado para manejar las columnas cuando cambie el ancho de pantalla
  useEffect(() => {
    if (widthScreen < 600) {
      setColumnsTable(shortColumn(dispatch, notification, currentBranchId));
    } else {
      setColumnsTable(defaultColumn(dispatch, notification, currentBranchId));
    }
  }, [widthScreen, notification, dispatch, currentBranchId]);

  // Manejar cambio de filtro de sucursales
  const handleBranchFilterChange = (selectedBranchIds) => {
    dispatch({ type: "set_branch_ids", branch_ids: selectedBranchIds || [] });
    dispatch({ type: "update_list" });
  };

  return (
    <>
      <Row style={{ marginBottom: 16 }} gutter={[8, 8]}>
        <Col span={24}>
          <BranchFilter
            value={branchIds}
            onChange={handleBranchFilterChange}
            placeholder="Filtrar por sucursal"
            allowClear
            style={{ width: 320 }}
            mode="multiple"
          />
        </Col>
      </Row>
      <Table
        dataSource={state.list?.results || []}
        size="small"
        rowKey={(record) => record.id}
        loading={!state.list?.results}
        bordered
        pagination={pagination}
        columns={columnsTable}
      />
    </>
  );
};

export default List;
