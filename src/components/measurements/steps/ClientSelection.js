/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Input, 
  Select, 
  Table, 
  Button, 
  Tag, 
  Space,
  Avatar,
  Tooltip
} from "antd";
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  ThunderboltOutlined,
  FireOutlined,
  ApiOutlined,
  SearchOutlined,
  DropboxOutlined
} from "@ant-design/icons";

import { MeasurementsContext } from "../../../containers/Measurements";
import * as measurementsApi from "../../../api/endpoints/measurements";
import * as clientsApi from "../../../api/endpoints/clients";

const { Search } = Input;
const { Option } = Select;

/**
 * Paso 1: Selección de Cliente y Servicio
 * Permite buscar y seleccionar el cliente para la medición
 */

const ClientSelection = () => {
  const { state, dispatch } = useContext(MeasurementsContext);
  const { clients } = state;
  const [loading, setLoading] = useState(false);

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClients();
  }, [clients.filters]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // Usar la API estándar de clientes
      const response = await clientsApi.list(clients.page, clients.filters);
      dispatch({ type: "SET_CLIENTS_LIST", payload: response });
    } catch (error) {
      console.error("Error cargando clientes:", error);
      dispatch({ 
        type: "SET_WORKFLOW_ERROR", 
        payload: "Error al cargar la lista de clientes" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar búsqueda
  const handleSearch = (value) => {
    dispatch({ 
      type: "UPDATE_CLIENT_FILTERS", 
      payload: { name: value, search: value } // Mantener ambos para compatibilidad
    });
  };

  // Manejar filtro de tipo de servicio
  const handleServiceTypeChange = (value) => {
    dispatch({ 
      type: "UPDATE_CLIENT_FILTERS", 
      payload: { service_type: value } 
    });
  };

  // Seleccionar cliente
  const handleSelectClient = (client) => {
    dispatch({ type: "SELECT_CLIENT", payload: client });
  };

  // Iconos por tipo de servicio
  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "WATER":
        return <DropboxOutlined style={{ color: "#1890ff" }} />;
      case "GAS":
        return <FireOutlined style={{ color: "#faad14" }} />;
      case "ELECTRICITY":
        return <ThunderboltOutlined style={{ color: "#52c41a" }} />;
      default:
        return <UserOutlined />;
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: "Cliente",
      key: "client",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              RUT: {record.rut || record.dni}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Servicio",
      dataIndex: "service_type",
      key: "service_type",
      render: (serviceType) => (
        <Tag icon={getServiceIcon(serviceType)} color="blue">
          {serviceType === "WATER" ? "Agua" : 
           serviceType === "GAS" ? "Gas" : 
           serviceType === "ELECTRICITY" ? "Electricidad" : "Otro"}
        </Tag>
      ),
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#666" }} />
          <span>{address || "Sin dirección"}</span>
        </Space>
      ),
    },
    {
      title: "Última Lectura",
      key: "last_reading",
      render: (_, record) => (
        <div>
          <div>{record.last_reading_date || "Sin lecturas"}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.last_reading_value ? `${record.last_reading_value} m³` : "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelectClient(record)}
          disabled={clients.selected?.id === record.id}
        >
          {clients.selected?.id === record.id ? "Seleccionado" : "Seleccionar"}
        </Button>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {/* Filtros */}
      <Col span={24}>
        <Card size="small" title="Buscar Cliente">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Buscar por nombre, RUT..."
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Tipo de servicio"
                style={{ width: "100%" }}
                onChange={handleServiceTypeChange}
                allowClear
              >
                <Option value="WATER">
                  <Space>
                    <DropboxOutlined style={{ color: "#1890ff" }} />
                    Agua
                  </Space>
                </Option>
                <Option value="GAS">
                  <Space>
                    <FireOutlined style={{ color: "#faad14" }} />
                    Gas
                  </Space>
                </Option>
                <Option value="ELECTRICITY">
                  <Space>
                    <ThunderboltOutlined style={{ color: "#52c41a" }} />
                    Electricidad
                  </Space>
                </Option>
              </Select>
            </Col>
          </Row>
        </Card>
      </Col>

      {/* Cliente seleccionado */}
      {clients.selected && (
        <Col span={24}>
          <Card 
            size="small" 
            title="Cliente Seleccionado" 
            type="inner"
            style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f" }}
          >
            <Row align="middle">
              <Col flex="auto">
                <Space size="large">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <div>
                    <h4 style={{ margin: 0 }}>{clients.selected.name}</h4>
                    <p style={{ margin: 0, color: "#666" }}>
                      RUT: {clients.selected.rut || clients.selected.dni}
                    </p>
                    <p style={{ margin: 0, color: "#666" }}>
                      {clients.selected.address}
                    </p>
                  </div>
                  <Tag icon={getServiceIcon(clients.selected.service_type)} color="green">
                    {clients.selected.service_type === "WATER" ? "Agua" : 
                     clients.selected.service_type === "GAS" ? "Gas" : 
                     clients.selected.service_type === "ELECTRICITY" ? "Electricidad" : "Otro"}
                  </Tag>
                </Space>
              </Col>
              <Col>
                <Button 
                  type="link" 
                  onClick={() => dispatch({ type: "SELECT_CLIENT", payload: null })}
                >
                  Cambiar Cliente
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      )}

      {/* Lista de clientes */}
      <Col span={24}>
        <Card title="Clientes Disponibles">
          <Table
            columns={columns}
            dataSource={clients.list}
            rowKey="id"
            loading={loading}
            pagination={{
              total: clients.count,
              current: clients.page,
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} clientes`,
            }}
            scroll={{ x: 800 }}
            size="small"
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ClientSelection;