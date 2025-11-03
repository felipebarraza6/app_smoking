import React from "react";
import { List, Avatar, Tag, Typography, Space } from "antd";
import { UserOutlined, CrownOutlined } from "@ant-design/icons";
import UserRoleSelect from "./UserRoleSelect";
import UserRemoveButton from "./UserRemoveButton";
import UserToggleStatusButton from "./UserToggleStatusButton";
import { ROLE_COLORS, ROLE_LABELS } from "./roles";

const { Text } = Typography;

const UserTableMobile = ({
  users,
  currentUserId,
  currentUserType,
  currentUserRole,
  onUpdateRole,
  onRemoveUser,
  onToggleStatus,
}) => {
  const isSystemAdmin = currentUserType === "ADM";

  return (
    <List
      dataSource={users}
      renderItem={(record) => {
        const isOwner = record.role === "OWNER";
        const isCurrentUser = record.user.id === currentUserId;
        const isCurrentUserOwner = currentUserRole === "OWNER";

        // Lógica para determinar si se puede editar el rol
        let canEditRole = false;
        let excludeOwner = true;

        if (isSystemAdmin) {
          // Admin sistema puede cambiar cualquier rol, incluso OWNER
          canEditRole = true;
          excludeOwner = false;
        } else if (isCurrentUserOwner) {
          // Propietario NO puede cambiar el rol de otros propietarios ni el suyo
          canEditRole = !isCurrentUser && !isOwner;
          excludeOwner = true;
        } else if (currentUserRole === "ADMIN") {
          // Admin puede cambiar empleados y gerentes, nunca propietarios
          canEditRole = !isOwner && !isCurrentUser;
          excludeOwner = true;
        } else if (currentUserRole === "MANAGER") {
          // Gerente puede cambiar empleados
          canEditRole = record.role === "EMPLOYEE" && !isCurrentUser;
          excludeOwner = true;
        }
        // Si el usuario objetivo es OWNER y no soy admin sistema, nunca puedo editar
        if (isOwner && !isSystemAdmin) canEditRole = false;

        // Lógica para determinar si se puede remover el usuario
        let canRemove = false;
        if (isSystemAdmin) {
          // Administradores del sistema pueden remover cualquier usuario (excepto propietarios)
          canRemove = !isOwner;
        } else if (isCurrentUserOwner) {
          // Los propietarios pueden remover cualquier usuario (excepto a sí mismos y otros propietarios)
          canRemove = !isCurrentUser && !isOwner;
        } else if (currentUserRole === "ADMIN") {
          // Los administradores pueden remover empleados y gerentes
          canRemove = !isOwner && !isCurrentUser;
        } else if (currentUserRole === "MANAGER") {
          // Los gerentes pueden remover solo empleados
          canRemove = record.role === "EMPLOYEE" && !isCurrentUser;
        }

        return (
          <List.Item
            actions={[
              <UserRoleSelect
                key="role"
                value={record.role}
                onChange={(value) => onUpdateRole(record.user.id, value)}
                disabled={!canEditRole}
                excludeOwner={excludeOwner}
                isSystemAdmin={isSystemAdmin}
              />,
              <UserToggleStatusButton
                key="toggle"
                isActive={record.is_active}
                onToggle={() => onToggleStatus(record.user.id)}
                userRole={record.role}
                currentUserRole={currentUserRole}
                isSystemAdmin={isSystemAdmin}
              />,
              <UserRemoveButton
                key="remove"
                onRemove={() => onRemoveUser(record.user.id)}
                disabled={!canRemove}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <Text strong>
                    {record.user.first_name} {record.user.last_name}
                  </Text>
                  {isOwner && <CrownOutlined style={{ color: "gold" }} />}
                </Space>
              }
              description={
                <>
                  <Tag color={ROLE_COLORS[record.role]}>
                    {ROLE_LABELS[record.role]}
                  </Tag>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {record.user.email}
                  </Text>
                  <br />
                  <Tag color={record.is_active ? "green" : "red"}>
                    {record.is_active ? "Activo" : "Inactivo"}
                  </Tag>
                </>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default UserTableMobile;
