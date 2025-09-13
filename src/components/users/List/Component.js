import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  App,
  Row,
  Col,
  Card,
  Space,
  Typography,
  Button,
  Tooltip,
} from "antd";
import { UsersContext } from "../../../containers/Users";
import { controller } from "../../../controllers/users";
import { defaultColumn, shortColumn } from "./columns_table";
import { AppContext } from "../../../App";
import BranchFilter from "../../common/BranchFilter";
import {
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import UserStats from "../UserStats";
import CreateUserModal from "../CreateUserModal";
import EditUserModal from "../EditUserModal";

const { Title, Text } = Typography;

const List = () => {
  const { state, dispatch } = useContext(UsersContext);
  const { state: appState } = useContext(AppContext);
  const [widthScreen, setWidthScreen] = useState(window.innerWidth);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { notification } = App.useApp();

  // Inicializar columnsTable después de obtener notification
  const [columnsTable, setColumnsTable] = useState([]);

  const pagination = {
    total: state.list?.count || 0,
    onChange: (page) => controller.list_table.pagination(page, dispatch),
    simple: true,
  };

  // Obtener el branch_id actual del contexto de la app
  const currentBranchId = appState.currentBranch?.id || 1;

  // Filtro de sucursales (multi)
  const branchIds = state.list?.branch_ids || [];

  useEffect(() => {
    // Pasar branchIds al controlador
    const stateWithBranchIds = {
      ...state,
      list: {
        ...state.list,
        branch_ids: branchIds,
      },
    };
    controller.list(stateWithBranchIds, dispatch);
  }, [state.list?.countUpdate, state.list?.page]);

  // Efecto separado para recargar cuando cambien los branch_ids
  useEffect(() => {
    if (branchIds.length >= 0) {
      // Permite filtro vacío
      const stateWithBranchIds = {
        ...state,
        list: {
          ...state.list,
          branch_ids: branchIds,
          page: 1, // Reset page on filter change
        },
      };
      controller.list(stateWithBranchIds, dispatch);
    }
  }, [JSON.stringify(branchIds)]); // Use JSON.stringify to properly compare arrays

  // Efecto separado para manejar el resize
  useEffect(() => {
    const handleResize = () => {
      setWidthScreen(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Efecto separado para manejar las columnas cuando cambie el ancho de pantalla
  useEffect(() => {
    if (widthScreen < 600) {
      setColumnsTable(
        shortColumn(dispatch, notification, currentBranchId, handleEditUser)
      );
    } else {
      setColumnsTable(
        defaultColumn(dispatch, notification, currentBranchId, handleEditUser)
      );
    }
  }, [widthScreen, notification, dispatch, currentBranchId]);

  // Manejar cambio de filtro de sucursales
  const handleBranchFilterChange = (selectedBranchIds) => {
    dispatch({ type: "set_branch_ids", branch_ids: selectedBranchIds || [] });
  };

  // Manejar edición de usuario
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  return (
    <div style={{ padding: "0 16px" }}>
      {/* Estadísticas */}
      <UserStats users={state.list?.results || []} />

      {/* Tabla principal */}
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Filtros y Acciones */}
          <div
            style={{
              padding: "12px 16px",
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space align="center">
                  <FilterOutlined style={{ color: "#1890ff" }} />
                  <Text strong>Filtros:</Text>
                  <BranchFilter
                    value={branchIds}
                    onChange={handleBranchFilterChange}
                    placeholder="Filtrar por sucursal"
                    allowClear
                    style={{ width: 320 }}
                    mode="multiple"
                  />
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                  >
                    Crear Usuario
                  </Button>
                  <Tooltip title="Recargar lista">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => dispatch({ type: "update_list" })}
                    />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Tabla */}
          <Table
            dataSource={state.list?.results || []}
            size="middle"
            rowKey={(record) => record.id}
            loading={!state.list?.results}
            bordered={false}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} usuarios`,
              pageSizeOptions: ["10", "20", "50", "100"],
              style: {
                marginTop: 16,
                textAlign: "right",
              },
            }}
            columns={columnsTable}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </Space>
      </Card>

      {/* Modal para crear usuario */}
      <CreateUserModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          dispatch({ type: "update_list" });
          setModalVisible(false);
        }}
      />

      {/* Modal para editar usuario */}
      <EditUserModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          dispatch({ type: "update_list" });
          setEditModalVisible(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default List;
