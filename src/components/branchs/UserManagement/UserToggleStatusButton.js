import React from "react";
import { Button, Popconfirm } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";

const UserToggleStatusButton = ({
  isActive,
  onToggle,
  disabled = false,
  userRole,
  currentUserRole,
  isSystemAdmin = false,
}) => {
  // Verificar si el usuario actual puede activar/desactivar este usuario
  const canToggle = () => {
    // Administradores del sistema pueden activar/desactivar cualquier usuario
    if (isSystemAdmin) return true;

    // Propietarios pueden activar/desactivar cualquier usuario
    if (currentUserRole === "OWNER") return true;

    // Administradores y Gerentes pueden activar/desactivar solo Empleados y Solo Lectura
    if (currentUserRole === "ADMIN" || currentUserRole === "MANAGER") {
      return userRole === "EMPLOYEE" || userRole === "VIEWER";
    }

    return false;
  };

  const canToggleStatus = canToggle();

  if (!canToggleStatus) {
    return null;
  }

  const statusText = isActive ? "Desactivar" : "Activar";
  const confirmText = isActive
    ? "¿Estás seguro de desactivar este usuario?"
    : "¿Estás seguro de activar este usuario?";

  return (
    <Popconfirm
      title={confirmText}
      onConfirm={onToggle}
      okText="Sí"
      cancelText="No"
      disabled={disabled}
    >
      <Button
        type={isActive ? "default" : "primary"}
        icon={isActive ? <StopOutlined /> : <CheckCircleOutlined />}
        size="small"
        block
        disabled={disabled}
        children={statusText}
      />
    </Popconfirm>
  );
};

export default UserToggleStatusButton;
