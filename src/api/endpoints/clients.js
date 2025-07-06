import { GET, POST, PATCH, DELETE } from "../config";

export const list = async (page, filters) => {
  const response = await GET(
    `core/clients/?page=${page}&name__icontains=${
      filters.name ? filters.name : ""
    }&branch=${`${filters.branch ? filters.branch : ""}&dni__icontains=${
      filters.dni ? filters.dni : ""
    }`}`
  );
  return response.data;
};

export const list_all = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.name) params.append("name__icontains", filters.name);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.dni) params.append("dni__icontains", filters.dni);

  const response = await GET(`core/clients/total/?${params.toString()}`);
  return response.data;
};

export const create = async (values) => {
  const response = await POST("core/clients/", values);
  return response;
};
export const update = async (id, data) => {
  const response = await PATCH(`core/clients/${id}/`, data);
  return response;
};
export const destroy = async (id) => {
  const response = await DELETE(`core/clients/${id}/`);
  return response;
};

const create_contact = async (data) => {
  const response = await POST("core/persons/", data);
  return response;
};

const list_contacts = async () => {
  const response = await GET("core/persons/");
  return response.data;
};

const update_contact = async (id, data) => {
  const response = await PATCH(`core/persons/${id}/`, data);
  return response;
};

const destroy_contact = async (id) => {
  const response = await DELETE(`core/persons/${id}/`);
  return response;
};

export const contacts = {
  create: create_contact,
  list: list_contacts,
  update: update_contact,
  destroy: destroy_contact,
  total: list_all,
};
