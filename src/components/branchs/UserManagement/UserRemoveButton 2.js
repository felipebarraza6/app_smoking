import React from "react";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const UserRemoveButton = ({
  onRemove,
  disabled = false,
  children = "Remover",
}) => (
  <Popconfirm
    title="¿Estás seguro de remover este usuario?"
    description="El usuario perderá acceso a esta tienda."
    onConfirm={onRemove}
    okText="Sí"
    cancelText="No"
    disabled={disabled}
  >
    <Button
      danger
      size="small"
      icon={<DeleteOutlined />}
      disabled={disabled}
      block
    >
      {children}
    </Button>
  </Popconfirm>
);

export default UserRemoveButton;
