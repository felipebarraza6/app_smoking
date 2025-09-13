/**
 * Configuración centralizada de roles de usuario
 * Actualizado para incluir el nuevo rol DRIVER
 */

export const ROLE_COLORS = {
  OWNER: "gold",
  ADMIN_LOCAL: "red",
  MANAGER: "blue",
  EMPLOYEE: "green",
  CAJERO: "purple",
  METER: "cyan",
  RECEIVER: "orange",
  DRIVER: "lime",
  VIEWER: "default",
};

export const ROLE_LABELS = {
  OWNER: "Propietario",
  ADMIN_LOCAL: "Administrador Local",
  MANAGER: "Gerente",
  EMPLOYEE: "Empleado",
  CAJERO: "Cajero",
  METER: "Medidor",
  RECEIVER: "Recepcionista",
  DRIVER: "Conductor",
  VIEWER: "Solo Lectura",
};

export const ROLE_DESCRIPTIONS = {
  OWNER: "Acceso completo a todas las funcionalidades",
  ADMIN_LOCAL: "Administración local de la sucursal",
  MANAGER: "Gestión de operaciones y personal",
  EMPLOYEE: "Acceso básico a funciones operativas",
  CAJERO: "Acceso a funciones de caja y ventas",
  METER: "Acceso a funciones de medición",
  RECEIVER: "Acceso a funciones de recepción",
  DRIVER: "Gestión de entregas y logística",
  VIEWER: "Solo lectura, sin permisos de modificación",
};

export const ROLE_PERMISSIONS = {
  OWNER: [
    "manage_users",
    "manage_branch",
    "view_reports",
    "manage_inventory",
    "manage_deliveries",
    "manage_measurements",
  ],
  ADMIN_LOCAL: [
    "manage_users",
    "view_reports",
    "manage_inventory",
    "manage_deliveries",
    "manage_measurements",
  ],
  MANAGER: [
    "view_reports",
    "manage_inventory",
    "manage_deliveries",
    "manage_measurements",
  ],
  EMPLOYEE: [
    "view_inventory",
    "view_deliveries",
    "view_measurements",
  ],
  CAJERO: [
    "manage_sales",
    "view_inventory",
  ],
  METER: [
    "manage_measurements",
    "view_inventory",
  ],
  RECEIVER: [
    "manage_reception",
    "view_inventory",
  ],
  DRIVER: [
    "manage_deliveries",
    "view_delivery_routes",
    "accept_deliveries",
    "view_delivery_history",
  ],
  VIEWER: [
    "view_only",
  ],
};

/**
 * Obtener información completa de un rol
 */
export const getRoleInfo = (role) => {
  return {
    key: role,
    label: ROLE_LABELS[role] || role,
    color: ROLE_COLORS[role] || "default",
    description: ROLE_DESCRIPTIONS[role] || "",
    permissions: ROLE_PERMISSIONS[role] || [],
  };
};

/**
 * Obtener todos los roles disponibles
 */
export const getAllRoles = () => {
  return Object.keys(ROLE_LABELS).map(role => getRoleInfo(role));
};

/**
 * Verificar si un rol tiene un permiso específico
 */
export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Obtener roles que tienen un permiso específico
 */
export const getRolesWithPermission = (permission) => {
  return Object.keys(ROLE_PERMISSIONS).filter(role => 
    ROLE_PERMISSIONS[role].includes(permission)
  );
};
