import React, { useState, useMemo } from "react";
import { Select, Avatar, Badge, Tooltip, Space, Typography } from "antd";
import {
  ShopOutlined,
  CrownOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import useBranches from "../../hooks/useBranches";

const { Text, Title } = Typography;

const BranchSelector = ({
  value,
  onChange,
  placeholder = "Selecciona una sucursal",
  allowClear = true,
  style = {},
  mode = undefined,
  showRole = true,
  showCount = false,
  size = "middle",
  bordered = true,
  showSearch = true,
  filterOption = true,
  maxTagCount = "responsive",
  maxTagTextLength = 20,
  virtual = true,
  dropdownStyle = {},
  listHeight = 256,
  notFoundContent = "No se encontraron sucursales",
  loading = false,
  disabled = false,
  className = "",
  onDropdownVisibleChange,
  onSearch,
  onBlur,
  onFocus,
  onClear,
  suffixIcon,
  clearIcon,
  removeIcon,
  menuItemSelectedIcon,
  dropdownRender,
  tagRender,
  optionLabelProp = "label",
  optionFilterProp = "label",
  showArrow = true,
  placement = "bottomLeft",
  getPopupContainer,
  autoClearSearchValue = true,
  defaultOpen = false,
  open,
  onSelect,
  onDeselect,
  tokenSeparators = [],
  maxTagPlaceholder,
  showCheckedStrategy = "SHOW_PARENT",
  treeCheckStrictly = false,
  treeCheckable = false,
  treeDataSimpleMode = false,
  treeDefaultExpandAll = false,
  treeDefaultExpandedKeys = [],
  treeExpandedKeys = [],
  treeIcon = false,
  treeLine = false,
  treeNodeFilterProp = "title",
  treeNodeLabelProp = "title",
  dropdownMatchSelectWidth = true,
  dropdownMenuStyle = {},
  dropdownClassName = "",
  popupClassName = "",
  getInputElement,
  inputIcon,
  loadingIcon,
  // Opciones del hook
  hookOptions = {},
  ...restProps
}) => {
  const {
    branches,
    loading: branchesLoading,
    searchBranches,
    getBranchStats,
  } = useBranches({
    includeAllOption: true,
    showRoles: showRole,
    ...hookOptions,
  });

  const [searchValue, setSearchValue] = useState("");

  const isDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Memoizar las opciones para mejor rendimiento
  const options = useMemo(() => {
    return branches.map((branch) => {
      const isAllOption = branch.is_all_option;
      const role = branch.role;

      // Determinar el icono según el rol
      const getRoleIcon = () => {
        switch (role) {
          case "OWNER":
            return <CrownOutlined style={{ color: "#faad14" }} />;
          case "ADMIN":
            return <StarOutlined style={{ color: "#1890ff" }} />;
          case "MANAGER":
            return <TeamOutlined style={{ color: "#52c41a" }} />;
          case "EMPLOYEE":
            return <UserOutlined style={{ color: "#8c8c8c" }} />;
          default:
            return <ShopOutlined style={{ color: "#d9d9d9" }} />;
        }
      };

      // Determinar el color del badge según el rol
      const getBadgeColor = () => {
        switch (role) {
          case "OWNER":
            return "gold";
          case "ADMIN":
            return "blue";
          case "MANAGER":
            return "green";
          case "EMPLOYEE":
            return "default";
          default:
            return "default";
        }
      };

      // Determinar el texto del badge
      const getBadgeText = () => {
        switch (role) {
          case "OWNER":
            return "PROPIETARIO";
          case "ADMIN":
            return "ADM";
          case "MANAGER":
            return "MGR";
          case "EMPLOYEE":
            return "EMP";
          default:
            return "";
        }
      };

      return {
        value: branch.id,
        label: (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Space size="small">
              {isAllOption ? (
                <Avatar
                  size="small"
                  icon={<ShopOutlined />}
                  style={{ backgroundColor: "#722ed1" }}
                />
              ) : (
                <Avatar
                  size="small"
                  icon={getRoleIcon()}
                  style={{
                    backgroundColor: isAllOption ? "#722ed1" : "#f0f0f0",
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  strong={isAllOption}
                  style={{
                    color: isAllOption ? "#722ed1" : "inherit",
                    fontSize: isAllOption ? "14px" : "13px",
                  }}
                >
                  {branch.business_name}
                </Text>
                {branch.commercial_business && !isAllOption && (
                  <div>
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {branch.commercial_business}
                    </Text>
                  </div>
                )}
                {/* Mostrar texto especial si eres propietario y showRole está habilitado */}
                {showRole && role === "OWNER" && !isAllOption && (
                  <div>
                    <Text
                      style={{
                        fontSize: "10px",
                        color: isDark ? "#ffe066" : "#faad14",
                      }}
                    >
                      Eres propietario
                    </Text>
                  </div>
                )}
              </div>
              {isAllOption && (
                <CheckCircleOutlined
                  style={{ color: "#722ed1", fontSize: "16px" }}
                />
              )}
            </Space>
          </motion.div>
        ),
        title: branch.business_name,
        disabled: false,
        data: {
          ...branch,
          role,
          isAllOption,
        },
      };
    });
  }, [branches, showRole, isDark]);

  // Función personalizada para renderizar tags en modo múltiple o single
  const customTagRender = (props) => {
    const { value, closable, onClose } = props;
    const branch = branches.find((b) => b.id === value);

    if (!branch) return null;

    // Icono según el rol
    let icon = <ShopOutlined />;
    if (branch.role === "OWNER") {
      icon = <CrownOutlined style={{ color: "#faad14" }} />;
    } else if (branch.role === "ADMIN") {
      icon = <StarOutlined style={{ color: "#1890ff" }} />;
    } else if (branch.role === "MANAGER") {
      icon = <TeamOutlined style={{ color: "#52c41a" }} />;
    } else if (branch.role === "EMPLOYEE") {
      icon = <UserOutlined style={{ color: "#8c8c8c" }} />;
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{ display: "inline-block", margin: "2px" }}
      >
        <Avatar
          size="small"
          icon={icon}
          style={{
            backgroundColor: branch.is_all_option ? "#722ed1" : "#f0f0f0",
          }}
        />
        <Text style={{ marginLeft: 4, fontSize: "12px" }}>
          {branch.business_name?.length > 15
            ? `${branch.business_name.substring(0, 15)}...`
            : branch.business_name}
        </Text>
      </motion.div>
    );
  };

  // Funciones helper para roles
  const getRoleBadge = (role) => {
    switch (role) {
      case "OWNER":
        return "PROP";
      case "ADMIN":
        return "ADM";
      case "MANAGER":
        return "MGR";
      case "EMPLOYEE":
        return "EMP";
      default:
        return "";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "OWNER":
        return "gold";
      case "ADMIN":
        return "blue";
      case "MANAGER":
        return "green";
      case "EMPLOYEE":
        return "default";
      default:
        return "default";
    }
  };

  // Función personalizada para el dropdown
  const customDropdownRender = (menu) => {
    // Contar solo sucursales reales (sin la opción 'Todas')
    const realBranches = branches.filter((b) => !b.is_all_option);
    const total = realBranches.length;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {menu}
        {total > 0 && (
          <div
            style={{
              padding: "8px 12px",
              borderTop: isDark ? "1px solid #333" : "1px solid #f0f0f0",
              background: isDark ? "#18181c" : "#fafafa",
              color: isDark ? "#fff" : "#222",
            }}
          >
            <Text
              style={{ fontSize: "11px", color: isDark ? "#fff" : undefined }}
            >
              {total} sucursal{total !== 1 ? "es" : ""} disponible
              {total !== 1 ? "s" : ""}
            </Text>
          </div>
        )}
      </motion.div>
    );
  };

  const handleChange = (selectedValue) => {
    if (
      !selectedValue ||
      selectedValue === "all" ||
      (Array.isArray(selectedValue) && selectedValue.length === 0)
    ) {
      onChange(null);
    } else if (Array.isArray(selectedValue)) {
      // Si es múltiple, filtrar 'all' si está presente
      const filtered = selectedValue.filter((v) => v !== "all" && v != null);
      onChange(filtered.length === 0 ? null : filtered);
    } else {
      onChange(selectedValue);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    searchBranches(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Estilo adaptable por defecto, pero permite override
  const mergedStyle = {
    minWidth: 220,
    maxWidth: 350,
    width: "100%",
    ...style,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        <Select
          placeholder={placeholder}
          value={value}
          options={options}
          onChange={handleChange}
          loading={loading || branchesLoading}
          allowClear={allowClear}
          style={mergedStyle}
          mode={mode}
          size={size}
          popupMatchSelectWidth={dropdownMatchSelectWidth ?? true}
          styles={{
            popup: {
              root: {
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                background: isDark ? "#18181c" : "#fafafa",
                color: isDark ? "#fff" : undefined,
                ...dropdownStyle,
              },
            },
          }}
          classNames={{
            popup: { root: dropdownClassName || popupClassName || "" },
          }}
          popupRender={customDropdownRender}
          onOpenChange={onDropdownVisibleChange}
          variant={bordered ? "outlined" : "borderless"}
          suffixIcon={suffixIcon}
          clearIcon={clearIcon}
          removeIcon={removeIcon}
          menuItemSelectedIcon={menuItemSelectedIcon}
          tagRender={customTagRender}
          optionLabelProp={optionLabelProp}
          optionFilterProp={optionFilterProp}
          showSearch={showSearch}
          filterOption={filterOption}
          maxTagCount={maxTagCount}
          maxTagTextLength={maxTagTextLength}
          virtual={virtual}
          listHeight={listHeight}
          notFoundContent={notFoundContent}
          disabled={disabled}
          className={className}
          getPopupContainer={getPopupContainer}
          autoClearSearchValue={autoClearSearchValue}
          defaultOpen={defaultOpen}
          open={open}
          onSelect={onSelect}
          onDeselect={onDeselect}
          tokenSeparators={tokenSeparators}
          maxTagPlaceholder={maxTagPlaceholder}
          {...restProps}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default BranchSelector;
