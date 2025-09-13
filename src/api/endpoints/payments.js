import { GET, POST, PATCH, DELETE } from "../config";

// NOTA: Los endpoints de payments están DEPRECATED en el backend
// Los pagos ahora se manejan dentro del modelo Order directamente
export const create = async (data) => {
  console.warn("payments endpoint está DEPRECATED. Los pagos se manejan en orders.");
  const response = await POST("sales/payments/", data);
  return response;
};

export const list = async () => {
  console.warn("payments endpoint está DEPRECATED. Los pagos se obtienen desde orders.");
  const response = await GET("sales/payments/");
  return response.data;
};

export const update = async (id, data) => {
  console.warn("payments endpoint está DEPRECATED. Actualizar order directamente.");
  const response = await PATCH(`sales/payments/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  console.warn("payments endpoint está DEPRECATED. Modificar order directamente.");
  const response = await DELETE(`sales/payments/${id}/`);
  return response;
};

// NOTA: type_payments también está DEPRECATED
const create_category = async (data) => {
  console.warn("type_payments endpoint está DEPRECATED.");
  const response = await POST("sales/type-payments/", data);
  return response;
};

const list_category = async (filters = {}) => {
  console.warn("type_payments endpoint está DEPRECATED.");
  const params = new URLSearchParams();

  if (filters.branch) {
    if (Array.isArray(filters.branch)) {
      // Para múltiples sucursales, usar branch__in con valores separados por coma
      params.append("branch__in", filters.branch.join(","));
    } else {
      // Para una sola sucursal
      params.append("branch", filters.branch);
    }
  }

  if (filters.name) {
    params.append("name__icontains", filters.name);
  }

  if (filters.is_active !== undefined) {
    params.append("is_active", filters.is_active);
  }

  const url =
    filters && Object.keys(filters).length > 0
      ? `sales/type-payments/?${params.toString()}`
      : "sales/type-payments/";

  const response = await GET(url);
  return response.data;
};

const update_category = async (id, data) => {
  console.warn("type_payments endpoint está DEPRECATED.");
  const response = await PATCH(`sales/type-payments/${id}/`, data);
  return response;
};

const destroy_category = async (id) => {
  console.warn("type_payments endpoint está DEPRECATED.");
  const response = await DELETE(`sales/type-payments/${id}/`);
  return response;
};

export const create_bulk = async (data) => {
  const response = await POST("sales/payments/create_multiple/", data);
  return response;
};

export const type_payments = {
  create: create_category,
  list: list_category,
  update: update_category,
  destroy: destroy_category,
};
