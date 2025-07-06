import React, { useState, useEffect, useContext } from "react";
import { Drawer, Grid, App, Button, Space } from "antd";
import { AppContext } from "../../../App";
import api from "../../../api/endpoints";
import { toggle_user_status } from "../../../api/endpoints/branchs";
import { UserTable, UserTableMobile } from ".";
import AssignExistingUserModal from "./AssignExistingUserModal";

// ... otras importaciones necesarias ...

const { useBreakpoint } = Grid;

const UserManagement = ({ branch, visible, onClose, onUpdate }) => {
  const { message } = App.useApp();

  // Estado de usuarios
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const { state: appState } = useContext(AppContext);
  const currentUserId = appState.user?.id;
  const currentUserType = appState.user?.type_user;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Cargar usuarios de la sucursal
  const fetchUsers = async () => {
    if (!branch?.id) return;
    setLoading(true);
    try {
      const response = await api.branchs.get_branch_users(branch.id);
      const usersData = Array.isArray(response.data) ? response.data : [];
      setUsers(usersData);

      // Obtener el rol del usuario actual en esta sucursal
      const currentUser = usersData.find(
        (user) => user.user.id === currentUserId
      );
      setCurrentUserRole(currentUser?.role || null);
    } catch (error) {
      message.error(
        error.response?.data?.error || "Error al cargar usuarios de la tienda"
      );
      setUsers([]);
      setCurrentUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && branch?.id) fetchUsers();
    // eslint-disable-next-line
  }, [visible, branch?.id]);

  // Handler para actualizar rol
  const onUpdateRole = async (userId, newRole) => {
    if (!branch?.id || !userId || !newRole) return;
    try {
      await api.branchs.update_user_role(branch.id, {
        user_id: userId,
        role: newRole,
      });
      message.success("Rol actualizado exitosamente");
      fetchUsers();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error(error.response?.data?.error || "Error al actualizar rol");
    }
  };

  // Handler para remover usuario
  const onRemoveUser = async (userId) => {
    if (!branch?.id || !userId) return;
    try {
      await api.branchs.remove_user(branch.id, userId);
      message.success("Usuario removido exitosamente");
      fetchUsers();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error(error.response?.data?.error || "Error al remover usuario");
    }
  };

  // Handler para activar/desactivar usuario
  const onToggleUserStatus = async (userId) => {
    if (!branch?.id || !userId) return;
    try {
      // Usar la importación directa
      await toggle_user_status(branch.id, userId);
      message.success("Estado del usuario actualizado exitosamente");
      fetchUsers();
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error(
        error.response?.data?.error || "Error al cambiar estado del usuario"
      );
    }
  };

  // Handler para asignar usuario existente
  const handleAssignSuccess = () => {
    fetchUsers();
    if (onUpdate) onUpdate();
  };

  // Verificar si el usuario actual puede gestionar usuarios
  const canManageUsers = () => {
    if (currentUserType === "ADM") return true;
    if (currentUserRole === "OWNER") return true;
    if (currentUserRole === "ADMIN") return true;
    if (currentUserRole === "MANAGER") return true;
    return false;
  };

  // No renderizar si no hay branch o business_name
  if (!branch || !branch.business_name) {
    return null;
  }

  return (
    <>
      <Drawer
        title={`Gestión de usuarios de ${branch.business_name}`}
        open={visible}
        onClose={onClose}
        width={isMobile ? "100%" : 800}
        extra={
          canManageUsers() && (
            <Button
              type="primary"
              onClick={() => setAssignModalVisible(true)}
              style={{ marginRight: 8 }}
            >
              Asignar Usuario
            </Button>
          )
        }
      >
        {/* Tabla para desktop, lista para mobile */}
        {isMobile ? (
          <UserTableMobile
            users={users}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            currentUserRole={currentUserRole}
            onUpdateRole={onUpdateRole}
            onRemoveUser={onRemoveUser}
            onToggleStatus={onToggleUserStatus}
          />
        ) : (
          <UserTable
            users={users}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            currentUserRole={currentUserRole}
            onUpdateRole={onUpdateRole}
            onRemoveUser={onRemoveUser}
            onToggleStatus={onToggleUserStatus}
          />
        )}
      </Drawer>

      {/* Modal para asignar usuarios existentes */}
      <AssignExistingUserModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        branch={branch}
        onSuccess={handleAssignSuccess}
      />
    </>
  );
};

export default UserManagement;
