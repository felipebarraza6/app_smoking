import { GET, POST, PATCH, DELETE } from "../config";

export const create = async (data) => {
  const response = await POST("core/payments/", data);
  return response;
};

export const list = async () => {
  const response = await GET("core/payments/");
  return response.data;
};

export const update = async (id, data) => {
  const response = await PATCH(`core/payments/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`core/payments/${id}/`);
  return response;
};

const create_category = async (data) => {
  const response = await POST("core/type_payments/", data);
  return response;
};

const list_category = async (filters = {}) => {
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
      ? `core/type_payments/?${params.toString()}`
      : "core/type_payments/";

  const response = await GET(url);
  return response.data;
};

const update_category = async (id, data) => {
  const response = await PATCH(`core/type_payments/${id}/`, data);
  return response;
};

const destroy_category = async (id) => {
  const response = await DELETE(`core/type_payments/${id}/`);
  return response;
};

export const create_bulk = async (data) => {
  const response = await POST("core/payments/create_multiple/", data);
  return response;
};

export const type_payments = {
  create: create_category,
  list: list_category,
  update: update_category,
  destroy: destroy_category,
};
