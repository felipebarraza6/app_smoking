import { GET, POST, PATCH, DELETE } from "../config";

export const list = async (page, filters = {}) => {
  // Construir URL de forma más limpia
  const params = new URLSearchParams();
  params.append("page", page);

  if (filters.name) params.append("name__icontains", filters.name);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.dni) params.append("dni__icontains", filters.dni);

  const response = await GET(`customers/clients/?${params.toString()}`);
  return response.data;
};

export const list_all = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.name) params.append("name__icontains", filters.name);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.dni) params.append("dni__icontains", filters.dni);

  // NOTA: El backend tiene endpoint /total/ según auditoría, pero verificando...
  // Usar page_size grande como fallback
  params.append("page_size", "1000");

  const response = await GET(`customers/total/?${params.toString()}`);
  return response.data;
};

export const create = async (values) => {
  const response = await POST("customers/clients/", values);
  return response;
};
export const update = async (id, data) => {
  const response = await PATCH(`customers/clients/${id}/`, data);
  return response;
};
export const destroy = async (id) => {
  const response = await DELETE(`customers/clients/${id}/`);
  return response;
};

// ✅ CONTACTOS CORREGIDOS - Endpoints correctos
const create_contact = async (data) => {
  const response = await POST("customers/contacts/", data);
  return response;
};

const list_contacts = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.client) params.append("client", filters.client);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.contact_type) params.append("contact_type", filters.contact_type);

  const response = await GET(`customers/contacts/?${params.toString()}`);
  return response.data;
};

const update_contact = async (id, data) => {
  const response = await PATCH(`customers/contacts/${id}/`, data);
  return response;
};

const destroy_contact = async (id) => {
  const response = await DELETE(`customers/contacts/${id}/`);
  return response;
};

// ✅ CARGOS DINÁMICOS - Nuevos endpoints
const create_job_title = async (data) => {
  const response = await POST("customers/job-titles/", data);
  return response;
};

const list_job_titles = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.branch) params.append("created_by_branch", filters.branch);
  if (filters.level) params.append("level", filters.level);
  if (filters.is_active !== undefined)
    params.append("is_active", filters.is_active);

  console.log("🔍 API: list_job_titles filters:", filters);
  console.log("🔍 API: list_job_titles params:", params.toString());

  const response = await GET(`customers/job-titles/?${params.toString()}`);
  console.log("🔍 API: list_job_titles response:", response.data);
  return response.data;
};

const update_job_title = async (id, data) => {
  const response = await PATCH(`customers/job-titles/${id}/`, data);
  return response;
};

const destroy_job_title = async (id) => {
  const response = await DELETE(`customers/job-titles/${id}/`);
  return response;
};

// ✅ DEPARTAMENTOS DINÁMICOS - Nuevos endpoints
const create_department = async (data) => {
  const response = await POST("customers/departments/", data);
  return response;
};

const list_departments = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.branch) params.append("created_by_branch", filters.branch);
  if (filters.department_type)
    params.append("department_type", filters.department_type);
  if (filters.is_active !== undefined)
    params.append("is_active", filters.is_active);

  console.log("🔍 API: list_departments filters:", filters);
  console.log("🔍 API: list_departments params:", params.toString());

  const response = await GET(`customers/departments/?${params.toString()}`);
  console.log("🔍 API: list_departments response:", response.data);
  return response.data;
};

const update_department = async (id, data) => {
  const response = await PATCH(`customers/departments/${id}/`, data);
  return response;
};

const destroy_department = async (id) => {
  const response = await DELETE(`customers/departments/${id}/`);
  return response;
};

export const contacts = {
  create: create_contact,
  list: list_contacts,
  update: update_contact,
  destroy: destroy_contact,
  total: list_all,
};

// ✅ Exportar nuevos endpoints
export const jobTitles = {
  create: create_job_title,
  list: list_job_titles,
  update: update_job_title,
  destroy: destroy_job_title,
};

export const departments = {
  create: create_department,
  list: list_departments,
  update: update_department,
  destroy: destroy_department,
};
