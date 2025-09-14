import React, { useState, useEffect } from "react";
import { Select, Spin, Empty, Typography, Tag, Avatar, Space } from "antd";
import { UserOutlined, TeamOutlined, CrownOutlined } from "@ant-design/icons";
import api from "../../api/endpoints";

const { Option } = Select;
const { Text } = Typography;

const ROLE_COLORS = {
  OWNER: "gold",
  ADMIN: "red",
  MANAGER: "blue",
  EMPLOYEE: "green",
  VIEWER: "default",
};

const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Empleado",
  VIEWER: "Solo Lectura",
};

const UserSelector = ({
  value,
  onChange,
  placeholder = "Selecciona un usuario",
  showRole = true,
  showBranch = true,
  multiple = false,
  style = {},
  disabled = false,
  loading = false,
  onFocus,
  onBlur,
  excludeIds = [],
}) => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadUsersFromMyBranches = async () => {
    setLoadingUsers(true);
    try {
      // Obtener mis sucursales
      const branchesResponse = await api.branchs.my_branches();
      const myBranches = Array.isArray(branchesResponse.data)
        ? branchesResponse.data
        : [];

      if (myBranches.length === 0) {
        setUsers([]);
        return;
      }

      // Obtener usuarios de todas mis sucursales
      const allUsers = [];
      const processedEmails = new Set(); // Para evitar duplicados

      for (const branchAccess of myBranches) {
        if (!branchAccess.branch?.id) {
          continue;
        }

        try {
          const usersResponse = await api.branchs.get_branch_users(
            branchAccess.branch.id
          );
          const branchUsers = Array.isArray(usersResponse.data)
            ? usersResponse.data
            : [];

          branchUsers.forEach((user) => {
            if (user.user?.email && !processedEmails.has(user.user.email)) {
              processedEmails.add(user.user.email);
              allUsers.push({
                ...user,
                branchName:
                  branchAccess.branch.business_name || "Sucursal sin nombre",
                userRole: user.role || "EMPLOYEE",
              });
            }
          });
        } catch (error) {
          // Continuar con las siguientes sucursales en caso de error
        }
      }

      // Filtrar usuarios excluidos
      const filteredUsers = allUsers.filter(
        (user) => !excludeIds.includes(user.user.id)
      );
      setUsers(filteredUsers);
    } catch (error) {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsersFromMyBranches();
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case "OWNER":
        return <CrownOutlined />;
      default:
        return <TeamOutlined />;
    }
  };

  const renderUserOption = (user) => {
    const displayName =
      `${user.user.first_name} ${user.user.last_name}`.trim() ||
      user.user.email;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{displayName}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {user.user.email}
            </div>
          </div>
        </Space>
      </div>
    );
  };

  const renderSelectedValue = (selectedValue) => {
    if (multiple) {
      return selectedValue.map((email) => {
        const user = users.find((u) => u.user.email === email);
        if (!user) return email;
        return (
          `${user.user.first_name} ${user.user.last_name}`.trim() ||
          user.user.email
        );
      });
    } else {
      const user = users.find((u) => u.user.email === selectedValue);
      if (!user) return selectedValue;
      return (
        `${user.user.first_name} ${user.user.last_name}`.trim() ||
        user.user.email
      );
    }
  };

  if (loadingUsers) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="small" />
        <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
          Cargando usuarios...
        </div>
      </div>
    );
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: "100%", ...style }}
      disabled={disabled || loading}
      loading={loading}
      onFocus={onFocus}
      onBlur={onBlur}
      mode={multiple ? "multiple" : undefined}
      showSearch
      filterOption={(input, option) => {
        const user = users.find((u) => u.user.email === option.value);
        if (!user) return false;

        const searchText = input.toLowerCase();
        const name =
          `${user.user.first_name} ${user.user.last_name}`.toLowerCase();
        const email = user.user.email.toLowerCase();
        const branch = user.branchName.toLowerCase();

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          branch.includes(searchText)
        );
      }}
      notFoundContent={
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No se encontraron usuarios"
          style={{ padding: "20px 0" }}
        />
      }
    >
      {users.map((user) => (
        <Option key={user.user.email} value={user.user.email}>
          {renderUserOption(user)}
        </Option>
      ))}
    </Select>
  );
};

export default UserSelector;
