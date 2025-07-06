import React, { useContext } from "react";
import { ProductsContext } from "../../../../containers/Products";
import { Flex, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  ProfileFilled,
  BarcodeOutlined,
} from "@ant-design/icons";
import { controller } from "../../../../controllers/products";
import BranchSelector from "../../../common/BranchSelector";

const Filters = () => {
  const { state, dispatch } = useContext(ProductsContext);

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
      <BranchSelector
        value={state.filters.branch}
        onChange={onSelectBranch}
        mode="multiple"
        placeholder="Selecciona sucursales"
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
        placeholder="Nombre producto"
        suffix={<ProfileFilled />}
        value={state.filters.search}
        name="search"
        onChange={onChangeInputFilter}
      />
      <Input
        placeholder="Codigo producto"
        value={state.filters.code}
        suffix={<BarcodeOutlined />}
        name="code"
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
