import React, { useContext, useEffect, useState } from "react";
import { Table, App } from "antd";
import { ClientsContext } from "../../../containers/Clients";
import { controller } from "../../../controllers/clients";
import { defaultColumn, shortColumn, expandableRow } from "./columns_table";
import Filters from "./form_filters/Filters";
import Footer from "./Footer";

const List = () => {
  const { state, dispatch } = useContext(ClientsContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [columnsTable, setColumnsTable] = useState(defaultColumn(dispatch));
  const { notification, message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const pagination = {
    total: state.list?.count || 0,
    onChange: (page) => controller.list_table.change_page(page, dispatch),
  };

  const expandable = {
    expandedRowRender: (record) => expandableRow(record),
  };

  useEffect(() => {
    controller.list(state, dispatch, setLoading);
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
    if (widthScreen < 600) {
      setColumnsTable(shortColumn(dispatch, notification, message));
    } else {
      setColumnsTable(defaultColumn(dispatch, notification, message));
    }
  }, [state.list?.countUpdate, state.list?.page, widthScreen, state.filters]);

  return (
    <Table
      dataSource={state.list?.results || []}
      expandable={expandable}
      title={Filters}
      rowKey={(record) => record.id}
      size="small"
      loading={loading}
      bordered
      pagination={pagination}
      columns={columnsTable}
      footer={Footer}
    />
  );
};

export default List;
