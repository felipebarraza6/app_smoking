import React, { useState } from "react";
import { Button, Popconfirm, App } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import ChangeUserBranchModal from "./ChangeUserBranchModal";

const ChangeUserBranchButton = ({
  user,
  currentBranch,
  onSuccess,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { message } = App.useApp();

  const handleOpenModal = () => {
    if (!user || !currentBranch) {
      message.error("Información de usuario o sucursal no disponible");
      return;
    }
    setModalVisible(true);
  };

  const handleSuccess = () => {
    onSuccess?.();
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  // No mostrar el botón si no hay usuario, sucursal o está deshabilitado
  if (!user || !currentBranch || disabled) {
    return null;
  }

  return (
    <>
      <Popconfirm
        title="Transferir Usuario"
        description={`¿Estás seguro de que quieres transferir a ${user.user.full_name} a otra sucursal?`}
        onConfirm={handleOpenModal}
        okText="Sí"
        cancelText="No"
      >
        <Button
          icon={<SwapOutlined />}
          block
          size="small"
          title="Transferir usuario a otra sucursal"
        >
          Transferir
        </Button>
      </Popconfirm>

      <ChangeUserBranchModal
        visible={modalVisible}
        onClose={handleClose}
        user={user}
        currentBranch={currentBranch}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default ChangeUserBranchButton;
