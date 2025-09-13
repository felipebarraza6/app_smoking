import { GET, POST, PATCH, DELETE, POST_LOGIN } from "../config";

// Autenticación
export const login = async (data) => {
  const response = await POST_LOGIN("accounts/users/login_complete/", data);
  return response;
};

export const signup = async (data) => {
  const response = await POST("accounts/users/create_and_assign/", data);
  return response;
};

// Gestión de contraseñas
export const change_password = async (data) => {
  const response = await POST(`accounts/users/change_password/`, data);
  return response;
};

export const forgot_password = async (data) => {
  const response = await POST_LOGIN("accounts/users/forgot_password/", data);
  return response;
};

export const reset_password_confirm = async (data) => {
  const response = await POST_LOGIN("accounts/users/reset_password_confirm/", data);
  return response;
};

// CRUD de usuarios
export const list = async (page, branch_ids = []) => {
  let url = `accounts/users/?page=${page}`;
  if (branch_ids && branch_ids.length > 0) {
    url += `&branch_ids=${branch_ids.join(",")}`;
  }
  const response = await GET(url);
  return response.data;
};

export const retrieve = async (userId) => {
  const response = await GET(`accounts/users/${userId}/`);
  return response.data;
};

export const get_profile = async (user) => {
  const response = await GET(`accounts/users/${user}/`);
  return response.data;
};

export const create = async (data) => {
  const response = await POST("accounts/users/", data);
  return response;
};

export const update = async (user, data) => {
  const response = await PATCH(`accounts/users/${user}/`, data);
  return response;
};

export const destroy = async (user) => {
  const response = await DELETE(`accounts/users/${user}/`);
  return response;
};

// Gestión de roles y estado
export const toggle_user_status = async (data) => {
  const response = await POST("accounts/users/toggle_user_status/", data);
  return response;
};

export const change_user_role = async (data) => {
  const response = await POST("accounts/users/change_user_role/", data);
  return response;
};

// Gestión específica de asignaciones de sucursales
export const toggle_branch_assignment_status = async (data) => {
  const response = await POST("accounts/users/toggle_branch_assignment_status/", data);
  return response;
};

export const change_assignment_role = async (data) => {
  const response = await POST("accounts/users/change_assignment_role/", data);
  return response;
};
