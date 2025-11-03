import { GET, POST, PATCH, PUT, DELETE } from "../config";

// Endpoints básicos de sucursales
export const list = async (page = 1) => {
  const response = await GET(`core/branchs/?page=${page}`);
  return response;
};

export const retrieve = async (id) => {
  const response = await GET(`core/branchs/${id}/`);
  return response;
};

export const create = async (data) => {
  const response = await POST("core/branchs/", data);
  return response;
};

export const update = async (id, data) => {
  const response = await PATCH(`core/branchs/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`core/branchs/${id}/`);
  return response;
};

// Gestión de sucursales del usuario
export const my_branches = async () => {
  const response = await GET("core/branchs/my-branches/");
  return response;
};

export const my_branches_for_filters = async () => {
  const response = await GET("core/branchs/my-branches-for-filters/");
  return response;
};

export const leave_branch = async (branchId) => {
  const response = await POST(`core/branchs/${branchId}/leave-branch/`);
  return response;
};

export const transfer_ownership = async (branchId, newOwnerId) => {
  const response = await POST(`core/branchs/${branchId}/transfer-ownership/`, {
    new_owner_id: newOwnerId,
  });
  return response;
};

// Gestión de invitaciones
export const my_invitations = async () => {
  const response = await GET("core/branchs/my-invitations/");
  return response;
};

export const accept_invitation = async (branchId) => {
  const response = await POST(`core/branchs/${branchId}/accept-invitation/`);
  return response;
};

export const reject_invitation = async (branchId) => {
  const response = await POST(`core/branchs/${branchId}/reject-invitation/`);
  return response;
};

// Gestión de usuarios en sucursales
export const get_branch_users = async (branchId) => {
  const response = await GET(`core/branchs/${branchId}/users/`);
  return response;
};

export const invite_user = async (branchId, data) => {
  const response = await POST(`core/branchs/${branchId}/invite-user/`, data);
  return response;
};

export const update_user_role = async (branchId, data) => {
  const response = await PUT(
    `core/branchs/${branchId}/update-user-role/`,
    data
  );
  return response;
};

export const remove_user = async (branchId, userId) => {
  const response = await DELETE(
    `core/branchs/${branchId}/remove-user/?user_id=${userId}`
  );
  return response;
};

export const toggle_user_status = async (branchId, userId) => {
  const response = await PUT(`core/branchs/${branchId}/toggle-user-status/`, {
    user_id: userId,
  });
  return response;
};

// Gestión de usuarios disponibles
export const get_available_users = async (branchId) => {
  const response = await GET(`core/branchs/${branchId}/available-users/`);
  return response;
};

export const assign_existing_user = async (branchId, data) => {
  const response = await POST(
    `core/branchs/${branchId}/assign-existing-user/`,
    data
  );
  return response;
};
