import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Table, App } from "antd";
import { DriversContext } from "../../../containers/Drivers";
import { controller } from "../../../controllers/drivers";
import { defaultColumn, shortColumn, expandableRow } from "./columns_table";
import Filters from "./form_filters/Filters";

const List = () => {
  const { state, dispatch } = useContext(DriversContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const { notification } = App.useApp();

  // Memoizar las columnas para evitar re-creaciones
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
      onChange: (page) => controller.pagination(page, dispatch),
      simple: true,
    }),
    [state.list?.count, dispatch]
  );

  // Memoizar el expandable
  const expandable = useMemo(
    () => ({
      expandedRowRender: (record) => expandableRow(record),
    }),
    []
  );

  // Optimizar el event listener de resize
  const handleResize = useCallback(() => {
    setWidthScreen(window.innerWidth);
  }, []);

  useEffect(() => {
    // Cargar datos iniciales
    controller.list(state, dispatch);

    // Agregar event listener para resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch, handleResize]);

  // Efecto separado para recargar datos cuando cambien los filtros o página
  useEffect(() => {
    if (state.list?.countUpdate > 0 || state.list?.page > 1) {
      controller.list(state, dispatch);
    }
  }, [state.list?.countUpdate, state.list?.page, state.filters, dispatch]);

  // Memoizar el dataSource para evitar re-renderizaciones
  const dataSource = useMemo(() => {
    return state.list?.results || [];
  }, [state.list?.results]);

  // Memoizar el loading state
  const loading = useMemo(() => {
    return !state.list?.results;
  }, [state.list?.results]);

  return (
    <Table
      dataSource={dataSource}
      expandable={expandable}
      rowKey={(record) => record.id}
      title={() => <Filters />}
      size="small"
      loading={loading}
      bordered
      pagination={pagination}
      columns={columnsTable}
    />
  );
};

export default List;
