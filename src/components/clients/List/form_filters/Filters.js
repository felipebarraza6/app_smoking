import React, { useContext } from "react";
import { ClientsContext } from "../../../../containers/Clients";
import { Flex, Input, Button } from "antd";
import {
  FilterOutlined,
  FilterFilled,
  ProfileOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { controller } from "../../../../controllers/clients";
import BranchSelector from "../../../common/BranchSelector";

const Filters = () => {
  const { state, dispatch } = useContext(ClientsContext);

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
    if (state.filters.name || state.filters.dni || state.filters.branch) {
      return <FilterFilled />;
    } else {
      return <FilterOutlined />;
    }
  };

  const renderDisabled = () => {
    if (state.filters.name || state.filters.dni || state.filters.branch) {
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
        placeholder="Selecciona una sucursal"
        showRole={true}
        style={{ minWidth: 200 }}
        hookOptions={{
          includeAllOption: true,
          showRoles: true,
          filterByRole: null, // Mostrar todas las sucursales
        }}
      />
      <Input
        placeholder="Nombre"
        suffix={<ContactsOutlined />}
        value={state.filters.name}
        name="name"
        onChange={onChangeInputFilter}
      />
      <Input
        placeholder="Rut"
        value={state.filters.dni}
        suffix={<ProfileOutlined />}
        name="dni"
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
