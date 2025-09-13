import React, { useCallback, useMemo } from "react";
import { Flex, Select, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  FileProtectOutlined,
  UserOutlined,
  CheckCircleOutlined,
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

  const onSelectAvailability = useCallback(
    (value) => {
      onFilterChange({ is_available: value });
    },
    [onFilterChange]
  );

  const onClearAvailability = useCallback(() => {
    onFilterChange({ is_available: null });
  }, [onFilterChange]);

  const onResetFilters = useCallback(() => {
    onFilterReset();
  }, [onFilterReset]);

  // Memoizar el icono del filtro
  const renderIcon = useMemo(() => {
    if (
      filters.name ||
      filters.branch ||
      filters.vehicle_plate ||
      filters.is_available !== null
    ) {
      return <FilterFilled />;
    } else {
      return <FilterOutlined />;
    }
  }, [
    filters.name,
    filters.branch,
    filters.vehicle_plate,
    filters.is_available,
  ]);

  // Memoizar el estado disabled del botón
  const renderDisabled = useMemo(() => {
    if (
      filters.name ||
      filters.branch ||
      filters.vehicle_plate ||
      filters.is_available !== null
    ) {
      return false;
    } else {
      return true;
    }
  }, [
    filters.name,
    filters.branch,
    filters.vehicle_plate,
    filters.is_available,
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
      <Input
        placeholder="Nombre del conductor"
        suffix={<UserOutlined />}
        value={filters.name}
        name="name"
        onChange={onChangeInputFilter}
        allowClear
        style={{ minWidth: 200 }}
      />

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

      <Select
        placeholder="Disponibilidad"
        value={filters.is_available}
        options={[
          { value: true, label: "Disponible" },
          { value: false, label: "No disponible" },
        ]}
        key="availability"
        onChange={onSelectAvailability}
        onClear={onClearAvailability}
        allowClear
        style={{ minWidth: 150 }}
        suffixIcon={<CheckCircleOutlined />}
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
