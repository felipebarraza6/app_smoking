import { list, create, update, destroy } from "../api/endpoints/drivers";

import {
  changePage,
  changeFiltersSelects,
  resetFilterSelects,
} from "./drivers/list_table";
import { selectClient, createOrClear } from "./drivers/create_update_form";

const createDriver = async (values, dispatch, form, notification) => {
  try {
    await create(values);
    dispatch({
      type: "update_list",
    });
    notification.success({
      message: "Repartidor creado correctamente",
    });
    form.resetFields();
  } catch (e) {

    const errors = e.response?.data || {};
    const errorList = Object.keys(errors).map((key) => errors[key]);
    notification.error({
      message: "Errores al crear el nuevo repartidor.",
      description: errorList.join(", ") || "Error desconocido",
    });
  }
};

const updateDriver = async (
  values,
  state,
  dispatch,
  form,
  notification,
  message
) => {
  try {
    if (!state.select_to_edit?.id) {
      throw new Error("ID del repartidor no encontrado");
    }

    await update(state.select_to_edit.id, values);
    notification.success({ message: "Repartidor actualizado" });
    dispatch({
      type: "update_list",
    });
    dispatch({ type: "select_to_edit", payload: { driver: null } });
    form.resetFields();
  } catch (e) {

    const errors = e.response?.data || {};
    const errorList = Object.keys(errors).map((key) => errors[key]);
    notification.error({
      message: "Errores al actualizar el repartidor.",
      description: errorList.join(", ") || e.message || "Error desconocido",
    });
  }
};

const deleteDriver = async (driver, dispatch, notification) => {
  try {
    if (!driver?.id) {
      throw new Error("ID del repartidor no encontrado");
    }

    await destroy(driver.id);
    dispatch({
      type: "change_page",
      page: 1,
    });

    dispatch({
      type: "update_list",
    });
    notification.success({ message: "Repartidor eliminado correctamente." });
  } catch (e) {

    notification.error({
      message: "Error al eliminar el repartidor.",
      description: e.response?.data?.detail || e.message || "Error desconocido",
    });
  }
};

const getDrivers = async (state, dispatch) => {
  try {
    const response = await list(state.list.page, state.filters);

    // Verificar que la respuesta tenga la estructura esperada
    const payload = {
      results: response?.results || response?.data || [],
      count: response?.count || 0,
      branchs: response?.branchs || [],
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
        branchs: [],
      },
    });
  }
};

// Función para paginación
const pagination = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
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
  },
  create: createDriver,
  update: updateDriver,
  delete: deleteDriver,
  list: getDrivers,
  pagination: pagination,
};
