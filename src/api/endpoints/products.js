import { GET, POST, PATCH, DELETE } from "../config";

export const create = async (data) => {
  const response = await POST("inventory/products/", data);
  return response;
};

export const list = async (page, filters) => {
  let url = `inventory/products/?page=${page}`;

  if (filters.search) {
    url += `&name__icontains=${filters.search}`;
  }

  if (filters.category) {
    url += `&category=${filters.category}`;
  }

  if (filters.branch) {
    if (Array.isArray(filters.branch)) {
      // Para múltiples sucursales, usar branch__in con valores separados por coma
      url += `&branch__in=${filters.branch.join(",")}`;
    } else {
      // Para una sola sucursal
      url += `&branch=${filters.branch}`;
    }
  }

  if (filters.code) {
    url += `&code__icontains=${filters.code}`;
  }

  const response = await GET(url);
  return response.data;
};

export const update = async (id, data) => {
  const response = await PATCH(`inventory/products/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`inventory/products/${id}/`);
  return response;
};

const create_category = async (data) => {
  const response = await POST("inventory/categories/", data);
  return response;
};

const list_category = async () => {
  const response = await GET("inventory/categories/");
  return response.data;
};

const update_category = async (id, data) => {
  const response = await PATCH(`inventory/categories/${id}/`, data);
  return response;
};

const destroy_category = async (id) => {
  const response = await DELETE(`inventory/categories/${id}/`);
  return response;
};

export const categories = {
  create: create_category,
  list: list_category,
  update: update_category,
  destroy: destroy_category,
};
