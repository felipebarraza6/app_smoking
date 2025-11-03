import { GET, POST, PATCH, DELETE } from "../config";

export const create = async (data) => {
  const response = await POST("core/drivers/", data);
  return response;
};

export const list = async (page, filters) => {
  const params = new URLSearchParams();
  params.append("page", page);

  if (filters.name) {
    params.append("name__icontains", filters.name);
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

  const response = await GET(`core/drivers/?${params.toString()}`);
  return response.data;
};

export const update = async (id, data) => {
  const response = await PATCH(`core/drivers/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`core/drivers/${id}/`);
  return response;
};

export const list_all = async (filters) => {
  const params = new URLSearchParams();

  if (filters.branch) {
    params.append("branch", filters.branch);
  }

  const response = await GET(`core/drivers/total/?${params.toString()}`);
  return response.data;
};
