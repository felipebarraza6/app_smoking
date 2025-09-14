import React, { useContext } from "react";
import { TypePaymentsContext } from "../../../../containers/TypePayments";
import { Flex, Select, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  ShopOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";
import { controller } from "../../../../controllers/type_payments";

const Filters = () => {
  const { state, dispatch } = useContext(TypePaymentsContext);

  const optionsBranchs = (state.branchs.list || []).map((branch) => ({
    value: branch.branch?.id || branch.id,
    label: (
      <>
        <ShopOutlined /> {branch.branch?.business_name || branch.business_name}
      </>
    ),
  }));

  const onSelectBranch = (filter) => {
    controller.list_table.change_filters_selects("branch", filter, dispatch);
  };

  const onChangeInputFilter = (e) => {
    controller.list_table.change_filters_selects(
      e.target.name,
      e.target.value,
      dispatch
    );
  };

  const renderIcon = () => {
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
  };

  const renderDisabled = () => {
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
  };

  const renderVertical = () => {
    if (window.innerWidth < 768) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Flex gap="small" vertical={renderVertical()}>
      <Select
        placeholder="Selecciona sucursales"
        value={state.filters.branch}
        options={optionsBranchs}
        key="branch"
        onSelect={onSelectBranch}
        allowClear
        mode="multiple"
      />
      <Input
        placeholder="Patente"
        suffix={<FileProtectOutlined />}
        value={state.filters.vehicle_plate}
        name="vehicle_plate"
        onChange={onChangeInputFilter}
      />

      <Button
        icon={renderIcon()}
        disabled={renderDisabled()}
        shape="round"
        type="primary"
        onClick={() => {
          controller.list_table.reset_filters_selects(dispatch);
        }}
      >
        Quitar filtros
      </Button>
    </Flex>
  );
};

export default Filters;
