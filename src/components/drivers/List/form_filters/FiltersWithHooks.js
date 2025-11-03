import React, { useCallback, useMemo } from "react";
import { Flex, Select, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  FileProtectOutlined,
} from "@ant-design/icons";

const Filters = ({ filters, branchOptions, onFilterChange, onFilterReset }) => {
  // Memoizar los handlers
  const onSelectBranch = useCallback(
    (value) => {
      onFilterChange({ branch: value });
    },
    [onFilterChange]
  );

  const onClearBranch = useCallback(() => {
    onFilterChange({ branch: null });
  }, [onFilterChange]);

  const onChangeInputFilter = useCallback(
    (e) => {
      onFilterChange({ [e.target.name]: e.target.value });
    },
    [onFilterChange]
  );

  const onResetFilters = useCallback(() => {
    onFilterReset();
  }, [onFilterReset]);

  // Memoizar el icono del filtro
  const renderIcon = useMemo(() => {
    if (
      filters.search ||
      filters.code ||
      filters.branch ||
      filters.category ||
      filters.vehicle_plate
    ) {
      return <FilterFilled />;
    } else {
      return <FilterOutlined />;
    }
  }, [
    filters.search,
    filters.code,
    filters.branch,
    filters.category,
    filters.vehicle_plate,
  ]);

  // Memoizar el estado disabled del botón
  const renderDisabled = useMemo(() => {
    if (
      filters.search ||
      filters.code ||
      filters.branch ||
      filters.category ||
      filters.vehicle_plate
    ) {
      return false;
    } else {
      return true;
    }
  }, [
    filters.search,
    filters.code,
    filters.branch,
    filters.category,
    filters.vehicle_plate,
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
      <Select
        placeholder="Selecciona una sucursal"
        value={filters.branch}
        options={branchOptions}
        key="branch"
        onChange={onSelectBranch}
        onClear={onClearBranch}
        allowClear
        style={{ minWidth: 200 }}
      />
      <Input
        placeholder="Patente"
        suffix={<FileProtectOutlined />}
        value={filters.vehicle_plate}
        name="vehicle_plate"
        onChange={onChangeInputFilter}
        allowClear
        style={{ minWidth: 150 }}
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
