import { GET, POST, PATCH, DELETE } from "../config";

// ===== NUEVO SISTEMA DRIVER PROFILES =====

export const create = async (data) => {
  const response = await POST("logistics/driver-profiles/", data);
  return response;
};

export const list = async (page, filters) => {
  const params = new URLSearchParams();
  params.append("page", page);

  if (filters.name) {
    params.append("user__first_name__icontains", filters.name);
  }

  if (filters.branch) {
    if (Array.isArray(filters.branch)) {
      // Para múltiples sucursales, usar branch__in con valores separados por coma
      params.append("branch__in", filters.branch.join(","));
    } else {
      // Para una sola sucursal
      params.append("branch", filters.branch);
    }
  }

  if (filters.vehicle_plate) {
    params.append("vehicle_plate__icontains", filters.vehicle_plate);
  }

  if (filters.is_available !== undefined) {
    params.append("is_available", filters.is_available);
  }

  const response = await GET(`logistics/driver-profiles/?${params.toString()}`);
  return response.data;
};

export const update = async (id, data) => {
  const response = await PATCH(`logistics/driver-profiles/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`logistics/driver-profiles/${id}/`);
  return response;
};

export const retrieve = async (id) => {
  const response = await GET(`logistics/driver-profiles/${id}/`);
  return response;
};

export const list_all = async (filters) => {
  const params = new URLSearchParams();

  if (filters.branch) {
    params.append("branch", filters.branch);
  }

  if (filters.is_available !== undefined) {
    params.append("is_available", filters.is_available);
  }

  // Obtener todos los driver profiles
  params.append("page_size", "1000");

  const response = await GET(`logistics/driver-profiles/?${params.toString()}`);
  return response.data;
};

// ===== ENDPOINTS ESPECÍFICOS DEL NUEVO SISTEMA =====

export const get_available_drivers = async (branch_id) => {
  const response = await GET(
    `logistics/driver-profiles/available/?branch_id=${branch_id}`
  );
  return response.data;
};

export const calculate_delivery_cost = async (data) => {
  const response = await POST("logistics/delivery-pricing/calculate/", data);
  return response;
};

export const get_driver_performance = async (driver_id) => {
  const response = await GET(
    `logistics/driver-profiles/${driver_id}/performance/`
  );
  return response;
};

export const update_driver_availability = async (driver_id, is_available) => {
  const response = await PATCH(`logistics/driver-profiles/${driver_id}/`, {
    is_available: is_available,
  });
  return response;
};

export const get_driver_dashboard = async (driver_id) => {
  const response = await GET(
    `logistics/driver-profiles/${driver_id}/dashboard/`
  );
  return response;
};
