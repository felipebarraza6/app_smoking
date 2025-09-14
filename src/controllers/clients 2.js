import { list, create, update, destroy } from "../api/endpoints/clients";
import { my_branches } from "../api/endpoints/branchs";

import {
  changePage,
  changeFiltersSelects,
  resetFilterSelects,
  addContacts,
  selectContact,
  deleteContact,
  createContact,
  updateContact,
} from "./clients/list_table";
import { selectClient, createOrClear } from "./clients/create_update_form";
import RUT from "rut-chile";

const createClient = async (values, dispatch, form, notification) => {
  if (values.dni) {
    values.dni = RUT.deformat(values.dni);
  }
  try {
    const response = await create(values);
    dispatch({
      type: "update_list",
    });
    dispatch({
      type: "postsave_or_update",
    });

    form.resetFields();
    notification.success({ message: "Cliente creado exitosamente." });
    return response.data;
  } catch (e) {
    const errors = e.response.data;
    const errorList = Object.keys(errors).map((key) => {
      const bander = key;
      if (key === "branch") {
        key = "sucursal";
      } else if (key === "phone_number") {
        key = "teléfono";
      } else if (key === "dni") {
        key = "rut";
      }
      return `${key}: ${errors[bander]}`;
    });
    notification.error({
      message: "Errores al crear el nuevo cliente.",
      description: (
        <ul>
          {errorList.map((error, index) => (
            <li key={index}>{error.toLowerCase()}</li>
          ))}
        </ul>
      ),
    });
  }
};

const deactivateClient = async (state, dispatch, message) => {
  let active = false;
  if (state.is_active) {
    active = false;
  } else {
    active = true;
  }
  await update(state.id, { is_active: active }).then(() => {
    dispatch({
      type: "update_list",
    });
    if (active) {
      message.success({ content: "Cliente activado correctamente." });
    } else {
      message.warning({ content: "Cliente desactivado correctamente." });
    }
  });
};

const updateClient = async (values, state, dispatch, form, notification) => {
  if (values.dni) {
    values.dni = RUT.deformat(values.dni);
  }
  await update(state.select_to_edit.id, values)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "postsave_or_update",
      });

      form.resetFields();
      notification.success({ message: "Cliente actualizado." });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => {
        const bander = key;
        if (key === "branch") {
          key = "sucursal";
        } else if (key === "phone_number") {
          key = "teléfono";
        } else if (key === "dni") {
          key = "rut";
        }
        return `${key}: ${errors[bander]}`;
      });
      notification.error({
        message: "Errores al actualizar el cliente.",
        description: (
          <ul>
            {errorList.map((error, index) => (
              <li key={index}>{error.toLowerCase()}</li>
            ))}
          </ul>
        ),
      });
    });
};

const deleteClient = async (state, dispatch, notification) => {
  await destroy(state.id)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "change_page",
        page: 1,
      });
      notification.success({ message: "Cliente eliminado correctamente." });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Error al eliminar el cliente.",
        description: (
          <ul>
            {errorList.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ),
      });
    });
};

const getClients = async (state, dispatch, setLoading) => {
  setLoading(true);
  try {

    // Cargar clientes (las sucursales ya vienen incluidas en la respuesta)
    const clientsResponse = await list(state.list.page, state.filters);

    // Verificar que la respuesta tenga la estructura esperada
    const payload = {
      results: clientsResponse?.results || clientsResponse?.data || [],
      count: clientsResponse?.count || 0,
      branchs: clientsResponse?.branchs || [], // Las sucursales vienen del backend
    };

    dispatch({
      type: "add",
      payload: payload,
    });
  } catch (error) {

    // En caso de error, enviar datos vacíos
    dispatch({
      type: "add",
      payload: {
        results: [],
        count: 0,
        branchs: [], // Siempre array vacío
      },
    });
  } finally {
    setLoading(false);
  }
};

export const controller = {
  create_update_form: {
    select_to_edit: selectClient,
    create_or_clear: createOrClear,
  },
  list_table: {
    change_page: changePage,
    change_filters_selects: changeFiltersSelects,
    reset_filters_selects: resetFilterSelects,
    contacts: {
      add: addContacts,
      select_edit: selectContact,
      delete: deleteContact,
      create: createContact,
      update: updateContact,
    },
  },
  create: createClient,
  deactivate: deactivateClient,
  update: updateClient,
  delete: deleteClient,
  list: getClients,
};
