import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, App } from "antd";
import { defaultColumn, shortColumn, expandableRow } from "./columns_table";
import Filters from "./form_filters/FiltersWithHooks";

const List = ({
  drivers,
  filters,
  loading,
  branchOptions,
  onPageChange,
  onFilterChange,
  onFilterReset,
  onSelectDriver,
  onDeleteDriver,
}) => {
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const { notification } = App.useApp();

  // Memoizar las columnas para evitar re-creaciones
  const columnsTable = useMemo(() => {
    if (widthScreen < 600) {
      return shortColumn(onSelectDriver, onDeleteDriver, notification);
    } else {
      return defaultColumn(onSelectDriver, onDeleteDriver, notification);
    }
  }, [widthScreen, onSelectDriver, onDeleteDriver, notification]);

  // Memoizar la paginación
  const pagination = useMemo(
    () => ({
      total: drivers?.count || 0,
      onChange: onPageChange,
      simple: true,
    }),
    [drivers?.count, onPageChange]
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
    // Agregar event listener para resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Memoizar el dataSource para evitar re-renderizaciones
  const dataSource = useMemo(() => {
    console.log("🚚 ComponentWithHooks - drivers data:", drivers);
    console.log("🚚 ComponentWithHooks - drivers.results:", drivers?.results);
    return drivers?.results || [];
  }, [drivers?.results]);

  return (
    <Table
      dataSource={dataSource}
      expandable={expandable}
      rowKey={(record) => record.id}
      title={() => (
        <Filters
          filters={filters}
          branchOptions={branchOptions}
          onFilterChange={onFilterChange}
          onFilterReset={onFilterReset}
        />
      )}
      size="small"
      loading={loading}
      bordered
      pagination={pagination}
      columns={columnsTable}
    />
  );
};

export default List;
