import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Select, Button, App, Space, Typography } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { AppContext } from "../../../App";
import api from "../../../api/endpoints";

const { Option } = Select;
const { Text } = Typography;

const ChangeUserBranchModal = ({
  visible,
  onClose,
  user,
  currentBranch,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { state: appState } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Cargar sucursales disponibles
  const loadAvailableBranches = async () => {
    if (!visible) return;

    console.log("🔍 Loading available branches...");
    console.log("🔍 Current branch:", currentBranch);

    setLoadingBranches(true);
    try {
      // Obtener todas las sucursales a las que el usuario actual tiene acceso
      const response = await api.branchs.my_branches();
      console.log("🔍 API response:", response);

      const branches = response.data || [];
      console.log("🔍 All branches:", branches);

      // Filtrar la sucursal actual
      const filteredBranches = branches.filter(
        (branchAccess) => branchAccess.branch.id !== currentBranch?.id
      );
      console.log("🔍 Filtered branches:", filteredBranches);

      setAvailableBranches(filteredBranches);
    } catch (error) {
      console.error("❌ Error loading branches:", error);
      message.error("Error al cargar sucursales disponibles");
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (visible) {
      loadAvailableBranches();
      form.resetFields();
    }
  }, [visible, currentBranch]);

  const handleSubmit = async (values) => {
    if (!values.new_branch_id) {
      message.error("Selecciona una sucursal de destino");
      return;
    }

    console.log("🔍 API object:", api);
    console.log("🔍 API.branchs:", api.branchs);
    console.log(
      "🔍 API.branchs.change_user_branch:",
      api.branchs.change_user_branch
    );
    console.log(
      "🔍 typeof change_user_branch:",
      typeof api.branchs.change_user_branch
    );

    setLoading(true);
    try {
      await api.branchs.change_user_branch(
        currentBranch.id,
        user.user.id,
        values.new_branch_id
      );

      message.success("Usuario transferido exitosamente");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error changing user branch:", error);
      const errorMessage =
        error.response?.data?.error || "Error al transferir el usuario";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (!user) return null;

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          Transferir Usuario a Otra Sucursal
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Usuario:</Text> {user.user.full_name}
        <br />
        <Text strong>Sucursal actual:</Text> {currentBranch?.business_name}
        <br />
        <Text strong>Rol actual:</Text> {user.role_display}
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="new_branch_id"
          label="Sucursal de Destino"
          rules={[
            { required: true, message: "Selecciona la sucursal de destino" },
          ]}
        >
          <Select
            placeholder="Selecciona la sucursal de destino"
            loading={loadingBranches}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {console.log(
              "🔍 Rendering Select with branches:",
              availableBranches
            )}
            {availableBranches.map((branchAccess) => {
              console.log("🔍 BranchAccess data:", branchAccess);
              console.log("🔍 BranchAccess.branch:", branchAccess.branch);
              console.log(
                "🔍 Branch business_name:",
                branchAccess.branch?.business_name
              );
              console.log("🔍 Branch id:", branchAccess.branch?.id);
              return (
                <Option
                  key={branchAccess.branch.id}
                  value={branchAccess.branch.id}
                >
                  {branchAccess.branch.business_name ||
                    branchAccess.branch.name ||
                    `Sucursal ${branchAccess.branch.id}`}
                  {branchAccess.branch.commercial_business && (
                    <span style={{ color: "#999", fontSize: "12px" }}>
                      {" "}
                      ({branchAccess.branch.commercial_business})
                    </span>
                  )}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SwapOutlined />}
            >
              Transferir Usuario
            </Button>
            <Button onClick={handleCancel}>Cancelar</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeUserBranchModal;
