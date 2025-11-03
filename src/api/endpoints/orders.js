import { GET, POST, PATCH, DELETE } from "../config";

export const list = async (page, filters) => {
  const response = await GET(
    `core/orders/?page=${page}${filters ? `&${filters}` : ""}`
  );
  return response.data;
};

export const retrieve = async (id) => {
  const response = await GET(`core/orders/${id}/`);
  return response.data;
};

export const create = async (data) => {
  const response = await POST("core/orders/", data);
  return response;
};
export const update = async (id, data) => {
  const response = await PATCH(`core/orders/${id}/`, data);
  return response;
};
export const destroy = async (id) => {
  const response = await DELETE(`core/orders/${id}/`);
  return response;
};

const order_register_product = async (data) => {
  const response = await POST("core/register-order-products/", data);
  return response;
};

const order_update_register_product = async (id, data) => {
  const response = await PATCH(`core/register-order-products/${id}/`, data);
  return response;
};

const order_destroy_register_product = async (id) => {
  const response = await DELETE(`core/register-order-products/${id}/`);
  return response;
};

const order_list_register_product = async (page) => {
  const response = await GET(`core/register-order-products/?page=${page}`);
  return response.data;
};

const bulk_create = async (data) => {
  const response = await POST(
    "core/register-order-products/create_multiple/",
    data
  );
  return response;
};

export const register_products = {
  create: order_register_product,
  update: order_update_register_product,
  destroy: order_destroy_register_product,
  list: order_list_register_product,
  bulk_create: bulk_create,
};
