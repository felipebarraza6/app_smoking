import React from "react";
import BranchSelector from "./BranchSelector";

const BranchFilter = ({
  value,
  onChange,
  placeholder = "Selecciona una sucursal",
  allowClear = true,
  style = {},
  mode = undefined,
  showRole = true,
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
  ...restProps
}) => {
  return (
    <BranchSelector
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      allowClear={allowClear}
      style={style}
      mode={mode}
      showRole={showRole}
      size={size}
      bordered={bordered}
      showSearch={showSearch}
      filterOption={filterOption}
      maxTagCount={maxTagCount}
      maxTagTextLength={maxTagTextLength}
      virtual={virtual}
      dropdownStyle={dropdownStyle}
      listHeight={listHeight}
      notFoundContent={notFoundContent}
      loading={loading}
      disabled={disabled}
      className={className}
      onDropdownVisibleChange={onDropdownVisibleChange}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={onFocus}
      onClear={onClear}
      suffixIcon={suffixIcon}
      clearIcon={clearIcon}
      removeIcon={removeIcon}
      menuItemSelectedIcon={menuItemSelectedIcon}
      dropdownRender={dropdownRender}
      tagRender={tagRender}
      optionLabelProp={optionLabelProp}
      optionFilterProp={optionFilterProp}
      showArrow={showArrow}
      placement={placement}
      getPopupContainer={getPopupContainer}
      autoClearSearchValue={autoClearSearchValue}
      defaultOpen={defaultOpen}
      open={open}
      onSelect={onSelect}
      onDeselect={onDeselect}
      tokenSeparators={tokenSeparators}
      maxTagPlaceholder={maxTagPlaceholder}
      showCheckedStrategy={showCheckedStrategy}
      treeCheckStrictly={treeCheckStrictly}
      treeCheckable={treeCheckable}
      treeDataSimpleMode={treeDataSimpleMode}
      treeDefaultExpandAll={treeDefaultExpandAll}
      treeDefaultExpandedKeys={treeDefaultExpandedKeys}
      treeExpandedKeys={treeExpandedKeys}
      treeIcon={treeIcon}
      treeLine={treeLine}
      treeNodeFilterProp={treeNodeFilterProp}
      treeNodeLabelProp={treeNodeLabelProp}
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      dropdownMenuStyle={dropdownMenuStyle}
      dropdownClassName={dropdownClassName}
      popupClassName={popupClassName}
      getInputElement={getInputElement}
      inputIcon={inputIcon}
      loadingIcon={loadingIcon}
      {...restProps}
    />
  );
};

export default BranchFilter;
