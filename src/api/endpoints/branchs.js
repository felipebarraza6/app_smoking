import { GET, POST, PATCH, PUT, DELETE } from "../config";

// Endpoints básicos de sucursales
export const list = async (page = 1) => {
  const response = await GET(`branches/?page=${page}`);
  return response;
};

export const retrieve = async (id) => {
  const response = await GET(`branches/${id}/`);
  return response;
};

export const create = async (data) => {
  const response = await POST("branches/", data);
  return response;
};

export const update = async (id, data) => {
  const response = await PATCH(`branches/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`branches/${id}/`);
  return response;
};

// Gestión de sucursales del usuario
export const my_branches = async () => {
  const response = await GET("branches/my_branches/");
  return response;
};

export const my_branches_for_filters = async () => {
  const response = await GET("branches/my_branches_for_filters/");
  return response;
};

export const leave_branch = async (branchId) => {
  const response = await POST(`branches/${branchId}/leave_branch/`);
  return response;
};

export const transfer_ownership = async (branchId, newOwnerId) => {
  const response = await POST(`branches/${branchId}/transfer_ownership/`, {
    new_owner_id: newOwnerId,
  });
  return response;
};

// Gestión de invitaciones
export const my_invitations = async () => {
  const response = await GET("branches/my_invitations/");
  return response;
};

export const accept_invitation = async (branchId) => {
  const response = await POST(`branches/${branchId}/accept_invitation/`);
  return response;
};

export const reject_invitation = async (branchId) => {
  const response = await POST(`branches/${branchId}/reject_invitation/`);
  return response;
};

// Gestión de usuarios en sucursales
export const get_branch_users = async (branchId) => {
  const response = await GET(`branches/${branchId}/users/`);
  return response;
};

export const invite_user = async (branchId, data) => {
  const response = await POST(`branches/${branchId}/invite_user/`, data);
  return response;
};

export const update_user_role = async (branchId, data) => {
  const response = await PUT(
    `branches/${branchId}/update_user_role/`,
    data
  );
  return response;
};

export const remove_user = async (branchId, userId) => {
  const response = await DELETE(
    `branches/${branchId}/remove_user/?user_id=${userId}`
  );
  return response;
};

export const toggle_user_status = async (branchId, userId) => {
  const response = await PUT(`branches/${branchId}/toggle_user_status/`, {
    user_id: userId,
  });
  return response;
};

// Gestión de usuarios disponibles
export const get_available_users = async (branchId) => {
  const response = await GET(`branches/${branchId}/available_users/`);
  return response;
};

export const assign_existing_user = async (branchId, data) => {
  const response = await POST(
    `branches/${branchId}/assign_existing_user/`,
    data
  );
  return response;
};
