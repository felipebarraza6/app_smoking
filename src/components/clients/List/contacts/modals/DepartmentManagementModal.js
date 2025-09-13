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
  TeamOutlined,
  ShopOutlined,
  DollarOutlined,
  SettingOutlined,
  UserOutlined,
  ToolOutlined,
  FileTextOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { AppContext } from "../../../../../App";
import { departments } from "../../../../../api/endpoints/clients";

const { Option } = Select;
const { Title, Text } = Typography;

const DepartmentManagementModal = ({
  visible,
  onClose,
  onDepartmentCreated,
  currentBranch,
}) => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const { notification } = App.useApp();
  const { state: appState } = useContext(AppContext);

  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ✅ Cargar departamentos al abrir el modal
  const loadDepartments = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ Usar filtro de sucursal si está disponible
      const filters = currentBranch
        ? { branch: currentBranch.id, is_active: true }
        : { is_active: true };

      console.log("🔍 Loading departments with filters:", filters);
      console.log("🔍 currentBranch:", currentBranch);

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
      setLoading(false);
    }
  }, [currentBranch, notification]);

  useEffect(() => {
    if (visible) {
      loadDepartments();
    }
  }, [visible, loadDepartments]);

  const handleCreate = async (values) => {
    try {
      const branchId = currentBranch?.id || appState?.branches?.[0]?.id;

      const data = {
        ...values,
        // Siempre enviar created_by_branch, usar null si no hay sucursal
        created_by_branch: branchId || null,
      };

      console.log("Creating department with data:", data);
      console.log("currentBranch:", currentBranch);
      console.log("appState.branches:", appState?.branches);
      console.log("branchId:", branchId);

      await departments.create(data);
      notification.success({
        message: "Departamento creado exitosamente",
        placement: "bottomRight",
      });

      form.resetFields();
      setShowCreateForm(false);
      loadDepartments();
      onDepartmentCreated?.();
    } catch (error) {
      console.error("Error creating department:", error);
      notification.error({
        message: "Error al crear departamento",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const handleUpdate = async (values) => {
    try {
      await departments.update(editingDepartment.id, values);
      notification.success({
        message: "Departamento actualizado exitosamente",
        placement: "bottomRight",
      });

      editForm.resetFields();
      setEditingDepartment(null);
      loadDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
      notification.error({
        message: "Error al actualizar departamento",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const handleDelete = async (department) => {
    try {
      await departments.destroy(department.id);
      notification.success({
        message: "Departamento eliminado exitosamente",
        placement: "bottomRight",
      });

      loadDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      notification.error({
        message: "Error al eliminar departamento",
        description: error.response?.data?.detail || "Error desconocido",
      });
    }
  };

  const getDepartmentTypeIcon = (type) => {
    const icons = {
      SALES: <ShopOutlined style={{ color: "#52c41a" }} />,
      PURCHASING: <DollarOutlined style={{ color: "#1890ff" }} />,
      FINANCE: <BankOutlined style={{ color: "#faad14" }} />,
      OPERATIONS: <SettingOutlined style={{ color: "#722ed1" }} />,
      HR: <UserOutlined style={{ color: "#13c2c2" }} />,
      IT: <ToolOutlined style={{ color: "#ff4d4f" }} />,
      MARKETING: <FileTextOutlined style={{ color: "#eb2f96" }} />,
      ADMINISTRATION: <TeamOutlined style={{ color: "#8c8c8c" }} />,
      OTHER: <TeamOutlined style={{ color: "#8c8c8c" }} />,
    };
    return icons[type] || icons.OTHER;
  };

  const getDepartmentTypeColor = (type) => {
    const colors = {
      SALES: "green",
      PURCHASING: "blue",
      FINANCE: "orange",
      OPERATIONS: "purple",
      HR: "cyan",
      IT: "red",
      MARKETING: "magenta",
      ADMINISTRATION: "default",
      OTHER: "default",
    };
    return colors[type] || "default";
  };

  const columns = [
    {
      title: "Departamento",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Flex align="center" gap={8}>
          {getDepartmentTypeIcon(record.department_type)}
          <span>{text}</span>
        </Flex>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "department_type",
      key: "department_type",
      render: (type) => (
        <Tag color={getDepartmentTypeColor(type)}>
          {type === "SALES" && "Ventas"}
          {type === "PURCHASING" && "Compras"}
          {type === "FINANCE" && "Finanzas"}
          {type === "OPERATIONS" && "Operaciones"}
          {type === "HR" && "Recursos Humanos"}
          {type === "IT" && "Tecnología"}
          {type === "MARKETING" && "Marketing"}
          {type === "ADMINISTRATION" && "Administración"}
          {type === "OTHER" && "Otro"}
        </Tag>
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
              setEditingDepartment(record);
              editForm.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="¿Eliminar departamento?"
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
          <TeamOutlined style={{ fontSize: "16px", color: "#722ed1" }} />
          <Title level={5} style={{ margin: 0 }}>
            Gestión de Departamentos
          </Title>
        </Flex>
      }
      open={visible}
      onCancel={onClose}
      width={700}
      footer={null}
      styles={{
        body: { padding: "16px" },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {/* Header con descripción */}
        <div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Gestiona los departamentos disponibles para contactos
          </Text>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <div>
            <Form
              form={form}
              onFinish={handleCreate}
              layout="vertical"
              size="small"
            >
              <Flex gap={12}>
                <Form.Item
                  name="name"
                  label="Nombre del Departamento"
                  rules={[{ required: true, message: "Ingresa el nombre" }]}
                  style={{ flex: 1, marginBottom: 8 }}
                >
                  <Input placeholder="Ej: Ventas" />
                </Form.Item>

                <Form.Item
                  name="department_type"
                  label="Tipo"
                  rules={[{ required: true, message: "Selecciona el tipo" }]}
                  style={{ width: 180, marginBottom: 8 }}
                >
                  <Select placeholder="Selecciona tipo">
                    <Option value="SALES">Ventas</Option>
                    <Option value="PURCHASING">Compras</Option>
                    <Option value="FINANCE">Finanzas</Option>
                    <Option value="OPERATIONS">Operaciones</Option>
                    <Option value="HR">Recursos Humanos</Option>
                    <Option value="IT">Tecnología</Option>
                    <Option value="MARKETING">Marketing</Option>
                    <Option value="ADMINISTRATION">Administración</Option>
                    <Option value="OTHER">Otro</Option>
                  </Select>
                </Form.Item>
              </Flex>

              <Flex gap={8} justify="flex-end">
                <Button onClick={() => setShowCreateForm(false)} size="small">
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  size="small"
                >
                  Crear Departamento
                </Button>
              </Flex>
            </Form>
          </div>
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
              Nuevo Departamento
            </Button>
          </Flex>
        )}

        <Divider style={{ margin: "12px 0" }} />

        {/* Tabla de departamentos */}
        <div>
          <Title level={5} style={{ marginBottom: 8, fontSize: "14px" }}>
            Departamentos Existentes
          </Title>
          <Table
            columns={columns}
            dataSource={departmentsList}
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
          title="Editar Departamento"
          open={!!editingDepartment}
          onCancel={() => {
            setEditingDepartment(null);
            editForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form form={editForm} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              name="name"
              label="Nombre del Departamento"
              rules={[{ required: true, message: "Ingresa el nombre" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="department_type"
              label="Tipo"
              rules={[{ required: true, message: "Selecciona el tipo" }]}
            >
              <Select>
                <Option value="SALES">Ventas</Option>
                <Option value="PURCHASING">Compras</Option>
                <Option value="FINANCE">Finanzas</Option>
                <Option value="OPERATIONS">Operaciones</Option>
                <Option value="HR">Recursos Humanos</Option>
                <Option value="IT">Tecnología</Option>
                <Option value="MARKETING">Marketing</Option>
                <Option value="ADMINISTRATION">Administración</Option>
                <Option value="OTHER">Otro</Option>
              </Select>
            </Form.Item>

            <Flex gap={8} justify="flex-end">
              <Button
                onClick={() => {
                  setEditingDepartment(null);
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
      </Space>
    </Modal>
  );
};

export default DepartmentManagementModal;
