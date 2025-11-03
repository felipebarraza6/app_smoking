import React from "react";
import { Select } from "antd";

const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN_LOCAL: "Administrador Local",
  MANAGER: "Gerente",
  METER: "Medidor",
  CAJERO: "Cajero/a",
};

const UserRoleSelect = ({
  value,
  onChange,
  disabled = false,
  excludeOwner = false,
  isSystemAdmin = false,
}) => {
  // Forzar el valor a mayúsculas y validar
  let safeValue = (value || "").toUpperCase();
  const validRoles = Object.keys(ROLE_LABELS).filter((key) => {
    if (isSystemAdmin) return true;
    return excludeOwner ? key !== "OWNER" : true;
  });
  if (!validRoles.includes(safeValue)) {
    console.warn(
      `[UserRoleSelect] Valor de rol inválido ('${value}'), usando 'METER' por defecto. Opciones válidas:`,
      validRoles
    );
    safeValue = "METER";
  }

  return (
    <Select
      value={safeValue}
      onChange={onChange}
      disabled={disabled}
      style={{ width: "100%" }}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {validRoles.map((key) => (
        <Select.Option key={key} value={key}>
          {ROLE_LABELS[key]}
        </Select.Option>
      ))}
    </Select>
  );
};

export default UserRoleSelect;
