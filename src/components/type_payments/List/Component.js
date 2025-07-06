import React, { useContext, useEffect, useState } from "react";
import { Table, App } from "antd";
import { TypePaymentsContext } from "../../../containers/TypePayments";
import { controller } from "../../../controllers/type_payments";
import { defaultColumn, shortColumn } from "./columns_table";

const List = () => {
  const { state, dispatch } = useContext(TypePaymentsContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [columnsTable, setColumnsTable] = useState(defaultColumn(dispatch));
  const { notification } = App.useApp();

  const pagination = {
    total: state.list?.count || 0,
    onChange: (page) => controller.pagination(page, dispatch),
  };

  useEffect(() => {
    controller.list(state, dispatch);
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
    if (widthScreen < 600) {
      setColumnsTable(shortColumn(dispatch, notification));
    } else {
      setColumnsTable(defaultColumn(dispatch, notification));
    }
  }, [state.countUpdate, state.list?.page, widthScreen, state.filters]);

  return (
    <Table
      dataSource={state.list?.results || []}
      rowKey={(record) => record.id}
      size="small"
      loading={!state.list?.results}
      bordered
      pagination={pagination}
      columns={columnsTable}
    />
  );
};

export default List;
