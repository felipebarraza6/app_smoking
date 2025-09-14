import React, { useContext, useCallback, useMemo } from "react";
import { DriversContext } from "../../../../containers/Drivers";
import { Flex, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  FileProtectOutlined,
} from "@ant-design/icons";
import { controller } from "../../../../controllers/drivers";
import BranchSelector from "../../../common/BranchSelector";

const Filters = () => {
  const { state, dispatch } = useContext(DriversContext);

  // Memoizar los handlers
  const onSelectBranch = useCallback(
    (filter) => {
      controller.list_table.change_filters_selects("branch", filter, dispatch);
    },
    [dispatch]
  );

  const onChangeInputFilter = useCallback(
    (e) => {
      controller.list_table.change_filters_selects(
        e.target.name,
        e.target.value,
        dispatch
      );
    },
    [dispatch]
  );

  const onResetFilters = useCallback(() => {
    controller.list_table.reset_filters_selects(dispatch);
  }, [dispatch]);

  // Memoizar el icono del filtro
  const renderIcon = useMemo(() => {
    if (
      state.filters.search ||
      state.filters.code ||
      state.filters.branch ||
      state.filters.category
    ) {
      return <FilterFilled />;
    } else {
      return <FilterOutlined />;
    }
  }, [
    state.filters.search,
    state.filters.code,
    state.filters.branch,
    state.filters.category,
  ]);

  // Memoizar el estado disabled del botón
  const renderDisabled = useMemo(() => {
    if (
      state.filters.search ||
      state.filters.code ||
      state.filters.branch ||
      state.filters.category
    ) {
      return false;
    } else {
      return true;
    }
  }, [
    state.filters.search,
    state.filters.code,
    state.filters.branch,
    state.filters.category,
  ]);

  // Memoizar la orientación vertical
  const renderVertical = useMemo(() => {
    if (window.innerWidth < 768) {
      return true;
    } else {
      return false;
    }
  }, []);

  return (
    <Flex gap="small" vertical={renderVertical}>
      <BranchSelector
        placeholder="Selecciona sucursales"
        value={state.filters.branch}
        onChange={onSelectBranch}
        mode="multiple"
        showRole={true}
        showCount={true}
        style={{ minWidth: 250 }}
        maxTagCount="responsive"
        hookOptions={{
          includeAllOption: true,
          showRoles: true,
          filterByRole: null, // Mostrar todas las sucursales
        }}
      />
      <Input
        placeholder="Patente"
        suffix={<FileProtectOutlined />}
        value={state.filters.vehicle_plate}
        name="vehicle_plate"
        onChange={onChangeInputFilter}
        allowClear
      />

      <Button
        icon={renderIcon}
        disabled={renderDisabled}
        shape="round"
        type="primary"
        onClick={onResetFilters}
      >
        Quitar filtros
      </Button>
    </Flex>
  );
};

export default Filters;
