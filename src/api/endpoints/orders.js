import { GET, POST, PATCH, DELETE } from "../config";

export const list = async (page, filters) => {
  const response = await GET(
    `sales/orders/?page=${page}${filters ? `&${filters}` : ""}`
  );
  return response.data;
};

export const retrieve = async (id) => {
  const response = await GET(`sales/orders/${id}/`);
  return response.data;
};

export const create = async (data) => {
  const response = await POST("sales/orders/", data);
  return response;
};
export const update = async (id, data) => {
  const response = await PATCH(`sales/orders/${id}/`, data);
  return response;
};
export const destroy = async (id) => {
  const response = await DELETE(`sales/orders/${id}/`);
  return response;
};

// NOTA: Los register-order-products no existen como endpoint separado en el backend
// Se manejan a través de los endpoints de orders directamente
const order_register_product = async (data) => {
  // Usar el endpoint de orders para crear productos dentro de la orden
  console.warn("register-order-products endpoint no existe. Usar orders endpoint.");
  const response = await POST("sales/orders/", data);
  return response;
};

const order_update_register_product = async (id, data) => {
  console.warn("register-order-products endpoint no existe. Usar orders endpoint.");
  const response = await PATCH(`sales/orders/${id}/`, data);
  return response;
};

const order_destroy_register_product = async (id) => {
  console.warn("register-order-products endpoint no existe. Usar orders endpoint.");
  const response = await DELETE(`sales/orders/${id}/`);
  return response;
};

const order_list_register_product = async (page) => {
  console.warn("register-order-products endpoint no existe. Usar orders endpoint.");
  const response = await GET(`sales/orders/?page=${page}`);
  return response.data;
};

const bulk_create = async (data) => {
  console.warn("create_multiple no disponible. Crear orders individualmente.");
  const response = await POST("sales/orders/", data);
  return response;
};

export const register_products = {
  create: order_register_product,
  update: order_update_register_product,
  destroy: order_destroy_register_product,
  list: order_list_register_product,
  bulk_create: bulk_create,
};
