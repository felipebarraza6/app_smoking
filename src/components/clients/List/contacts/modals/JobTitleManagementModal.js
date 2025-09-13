import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Flex,
  App,
  Table,
  Popconfirm,
  Tag,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BuildOutlined,
  CrownOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../../../../App";
import { jobTitles, departments } from "../../../../../api/endpoints/clients";
import DepartmentManagementModal from "./DepartmentManagementModal";

const { Option } = Select;
const { Title, Text } = Typography;

const JobTitleManagementModal = ({
  visible,
  onClose,
  onJobTitleCreated,
  currentBranch,
}) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { notification } = App.useApp();
  const { state: appState } = useContext(AppContext);

  const [jobTitlesList, setJobTitlesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [editingJobTitle, setEditingJobTitle] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedCreateDepartmentId, setSelectedCreateDepartmentId] =
    useState(null);

  // ✅ Cargar cargos al abrir el modal
  const loadJobTitles = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ Usar filtro de sucursal si está disponible
      const filters = currentBranch
        ? { created_by_branch: currentBranch.id, is_active: true }
        : { is_active: true };

      console.log("🔍 Loading job titles with filters:", filters);
      console.log("🔍 currentBranch:", currentBranch);
      console.log("🔍 appState.branches:", appState?.branches);

      const response = await jobTitles.list(filters);
      console.log("🔍 Job titles response:", response);

      setJobTitlesList(response.results || []);
    } catch (error) {
      console.error("Error loading job titles:", error);
      notification.error({
        message: "Error al cargar cargos",
        description: "No se pudieron cargar los cargos disponibles",
      });
    } finally {
      setLoading(false);
    }
  }, [currentBranch, notification, appState?.branches]);

  // ✅ Cargar departamentos dinámicos
  const loadDepartments = useCallback(async () => {
    try {
      setLoadingDepartments(true);

      // ✅ Usar filtro de sucursal si está disponible
      const filters = currentBranch
        ? { created_by_branch: currentBranch.id, is_active: true }
        : { is_active: true };

      console.log("🔍 Loading departments with filters:", filters);

      const response = await departments.list(filters);
      console.log("🔍 Departments response:", response);

      setDepartmentsList(response.results || []);
    } catch (error) {
      console.error("Error loading departments:", error);
      notification.error({
        message: "Error al cargar departamentos",
        description: "No se pudieron cargar los departamentos disponibles",
      });
    } finally {
      setLoadingDepartments(false);
    }
  }, [currentBranch, notification]);

  useEffect(() => {
    if (visible) {
      loadJobTitles();
      loadDepartments();
    }
  }, [visible, loadJobTitles, loadDepartments]);

  const handleCreate = async (values) => {
    try {
      const branchId = currentBranch?.id || appState?.branches?.[0]?.id;

      const data = {
        ...values,
        // Siempre enviar created_by_branch, usar null si no hay sucursal
        created_by_branch: branchId || null,
      };

      console.log("Creating job title with data:", data);
      console.log("currentBranch:", currentBranch);
      console.log("appState.branches:", appState?.branches);
      console.log("branchId:", branchId);

      await jobTitles.create(data);
      notification.success({
        message: "Cargo creado exitosamente",
        placement: "bottomRight",
      });

      form.resetFields();
      setShowCreateForm(false);
      setSelectedCreateDepartmentId(null);
      loadJobTitles();
      onJobTitleCreated?.();
    } catch (error) {
      console.error("Error creating job title:", error);
      notification.error({
        message: "Error al crear cargo",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const handleUpdate = async (values) => {
    try {
      console.log("🔍 HANDLE UPDATE - values:", values);
      console.log("🔍 HANDLE UPDATE - editingJobTitle.id:", editingJobTitle.id);
      console.log("🔍 HANDLE UPDATE - department value:", values.department);
      console.log(
        "🔍 HANDLE UPDATE - department type:",
        typeof values.department
      );

      await jobTitles.update(editingJobTitle.id, values);
      notification.success({
        message: "Cargo actualizado exitosamente",
        placement: "bottomRight",
      });

      editForm.resetFields();
      setEditingJobTitle(null);
      loadJobTitles();
    } catch (error) {
      console.error("Error updating job title:", error);
      notification.error({
        message: "Error al actualizar cargo",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const handleDelete = async (jobTitle) => {
    try {
      await jobTitles.destroy(jobTitle.id);
      notification.success({
        message: "Cargo eliminado exitosamente",
        placement: "bottomRight",
      });

      loadJobTitles();
    } catch (error) {
      console.error("Error deleting job title:", error);
      notification.error({
        message: "Error al eliminar cargo",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const getLevelIcon = (level) => {
    const icons = {
      EXECUTIVE: <CrownOutlined style={{ color: "#ff4d4f" }} />,
      MANAGER: <BankOutlined style={{ color: "#1890ff" }} />,
      SUPERVISOR: <TeamOutlined style={{ color: "#52c41a" }} />,
      ANALYST: <UserOutlined style={{ color: "#faad14" }} />,
      ASSISTANT: <UserOutlined style={{ color: "#722ed1" }} />,
      OPERATOR: <BuildOutlined style={{ color: "#13c2c2" }} />,
      OTHER: <UserOutlined style={{ color: "#8c8c8c" }} />,
    };
    return icons[level] || icons.OTHER;
  };

  const getLevelColor = (level) => {
    const colors = {
      EXECUTIVE: "red",
      MANAGER: "blue",
      SUPERVISOR: "green",
      ANALYST: "orange",
      ASSISTANT: "purple",
      OPERATOR: "cyan",
      OTHER: "default",
    };
    return colors[level] || "default";
  };

  const columns = [
    {
      title: "Cargo",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Flex align="center" gap={8}>
          {getLevelIcon(record.level)}
          <span>{text}</span>
        </Flex>
      ),
    },
    {
      title: "Nivel",
      dataIndex: "level",
      key: "level",
      render: (level) => (
        <Tag color={getLevelColor(level)}>
          {level === "EXECUTIVE" && "Ejecutivo"}
          {level === "MANAGER" && "Gerencial"}
          {level === "SUPERVISOR" && "Supervisor"}
          {level === "ANALYST" && "Analista"}
          {level === "ASSISTANT" && "Asistente"}
          {level === "OPERATOR" && "Operador"}
          {level === "OTHER" && "Otro"}
        </Tag>
      ),
    },
    {
      title: "Departamento",
      dataIndex: "department_name",
      key: "department_name",
      render: (departmentName) => (
        <Tag color="blue">{departmentName || "Sin departamento"}</Tag>
      ),
    },
    {
      title: "Uso",
      dataIndex: "usage_count",
      key: "usage_count",
      render: (count) => (
        <Tag color={count > 0 ? "green" : "default"}>
          {count} contacto{count !== 1 ? "s" : ""}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              console.log("🔍 EDITING JOB TITLE:", record);
              setEditingJobTitle(record);
              // ✅ Establecer valores del formulario directamente
              const formValues = {
                name: record.name,
                level: record.level,
                department: record.department?.id || null,
              };
              console.log("🔍 SETTING FORM VALUES:", formValues);
              editForm.setFieldsValue(formValues);
              // ✅ Establecer el estado del departamento seleccionado
              setSelectedDepartmentId(record.department?.id || null);
            }}
          />
          <Popconfirm
            title="¿Eliminar cargo?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.usage_count > 0}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Flex align="center" gap={8}>
          <BuildOutlined style={{ fontSize: "16px", color: "#722ed1" }} />
          <Title level={5} style={{ margin: 0 }}>
            Gestión de Cargos
          </Title>
        </Flex>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      top={0}
      styles={{
        top: 0,
        body: { padding: "16px" },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Header con descripción */}
        <div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Gestiona los cargos disponibles para contactos
          </Text>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <Form
            form={form}
            onFinish={handleCreate}
            layout="vertical"
            size="small"
          >
            <Flex gap={12}>
              <Form.Item
                name="name"
                label="Nombre del Cargo"
                rules={[{ required: true, message: "Ingresa el nombre" }]}
                style={{ flex: 1, marginBottom: 8 }}
              >
                <Input placeholder="Ej: Gerente General" />
              </Form.Item>

              <Form.Item
                name="level"
                label="Nivel"
                rules={[{ required: true, message: "Selecciona el nivel" }]}
                style={{ width: 180, marginBottom: 8 }}
              >
                <Select placeholder="Selecciona nivel">
                  <Option value="EXECUTIVE">Ejecutivo</Option>
                  <Option value="MANAGER">Gerencial</Option>
                  <Option value="SUPERVISOR">Supervisor</Option>
                  <Option value="ANALYST">Analista</Option>
                  <Option value="ASSISTANT">Asistente</Option>
                  <Option value="OPERATOR">Operador</Option>
                  <Option value="OTHER">Otro</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="department"
                label="Departamento"
                rules={[
                  { required: true, message: "Selecciona el departamento" },
                ]}
                style={{ width: 180, marginBottom: 8 }}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Select
                    placeholder="Selecciona departamento"
                    style={{ flex: 1 }}
                    loading={loadingDepartments}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    value={selectedCreateDepartmentId}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      console.log(
                        "🔍 CREATE DEPARTMENT SELECT CHANGED:",
                        value
                      );
                      setSelectedCreateDepartmentId(value);
                      form.setFieldValue("department", value);
                    }}
                  >
                    {departmentsList.map((department) => (
                      <Option key={department.id} value={department.id}>
                        {department.name}
                        {department.created_by_branch_name && (
                          <span style={{ color: "#999", fontSize: "12px" }}>
                            {" "}
                            ({department.created_by_branch_name})
                          </span>
                        )}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="text"
                    icon={<TeamOutlined />}
                    onClick={() => setShowDepartmentModal(true)}
                    title="Gestionar departamentos"
                    size="middle"
                  />
                </Space.Compact>
              </Form.Item>
            </Flex>

            <Flex gap={8} justify="flex-end">
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedCreateDepartmentId(null);
                  form.resetFields();
                }}
                size="small"
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                size="small"
              >
                Crear Cargo
              </Button>
            </Flex>
          </Form>
        )}

        {/* Botón para crear */}
        {!showCreateForm && (
          <Flex justify="flex-end">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowCreateForm(true)}
              size="middle"
            >
              Nuevo Cargo
            </Button>
          </Flex>
        )}

        <Divider style={{ margin: "12px 0" }} />

        {/* Tabla de cargos */}
        <div>
          <Title level={5} style={{ marginBottom: 8, fontSize: "14px" }}>
            Cargos Existentes
          </Title>
          <Table
            columns={columns}
            dataSource={jobTitlesList}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 4,
              showSizeChanger: false,
              showQuickJumper: false,
              size: "small",
            }}
            size="small"
            bordered
          />
        </div>

        {/* Modal de edición */}
        <Modal
          title="Editar Cargo"
          open={!!editingJobTitle}
          onCancel={() => {
            setEditingJobTitle(null);
            setSelectedDepartmentId(null);
            editForm.resetFields();
          }}
          footer={null}
          width={500}
          afterOpenChange={(open) => {
            if (open && editingJobTitle) {
              console.log(
                "🔍 MODAL OPENED - editingJobTitle:",
                editingJobTitle
              );
              console.log(
                "🔍 MODAL OPENED - form values:",
                editForm.getFieldsValue()
              );
            }
          }}
        >
          <Form
            form={editForm}
            onFinish={handleUpdate}
            onFinishFailed={(errorInfo) => {
              console.log("🔍 FORM VALIDATION FAILED:", errorInfo);
              console.log("🔍 FORM ERRORS:", errorInfo.errorFields);
            }}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Nombre del Cargo"
              rules={[{ required: true, message: "Ingresa el nombre" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="level"
              label="Nivel"
              rules={[{ required: true, message: "Selecciona el nivel" }]}
            >
              <Select>
                <Option value="EXECUTIVE">Ejecutivo</Option>
                <Option value="MANAGER">Gerencial</Option>
                <Option value="SUPERVISOR">Supervisor</Option>
                <Option value="ANALYST">Analista</Option>
                <Option value="ASSISTANT">Asistente</Option>
                <Option value="OPERATOR">Operador</Option>
                <Option value="OTHER">Otro</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="Departamento"
              rules={[
                {
                  required: true,
                  message: "Selecciona el departamento",
                  validator: (_, value) => {
                    console.log("🔍 VALIDATOR - department value:", value);
                    console.log(
                      "🔍 VALIDATOR - department type:",
                      typeof value
                    );
                    if (value === null || value === undefined || value === "") {
                      return Promise.reject(
                        new Error("Selecciona el departamento")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  style={{ flex: 1 }}
                  loading={loadingDepartments}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  value={selectedDepartmentId}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={(value) => {
                    console.log("🔍 DEPARTMENT SELECT CHANGED:", value);
                    console.log("🔍 DEPARTMENT SELECT TYPE:", typeof value);
                    setSelectedDepartmentId(value);
                    // ✅ Actualizar el formulario también
                    editForm.setFieldValue("department", value);
                  }}
                >
                  {departmentsList.map((department) => (
                    <Option key={department.id} value={department.id}>
                      {department.name}
                      {department.created_by_branch_name && (
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {" "}
                          ({department.created_by_branch_name})
                        </span>
                      )}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="text"
                  icon={<TeamOutlined />}
                  onClick={() => setShowDepartmentModal(true)}
                  title="Gestionar departamentos"
                  size="middle"
                />
              </Space.Compact>
            </Form.Item>

            <Flex gap={8} justify="flex-end">
              <Button
                onClick={() => {
                  setEditingJobTitle(null);
                  setSelectedDepartmentId(null);
                  editForm.resetFields();
                }}
              >
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Actualizar
              </Button>
            </Flex>
          </Form>
        </Modal>

        {/* Modal de gestión de departamentos */}
        <DepartmentManagementModal
          visible={showDepartmentModal}
          onClose={() => setShowDepartmentModal(false)}
          onDepartmentCreated={() => {
            // Recargar cargos y departamentos cuando se crea un departamento
            loadJobTitles();
            loadDepartments();
          }}
          currentBranch={currentBranch}
        />
      </Space>
    </Modal>
  );
};

export default JobTitleManagementModal;
