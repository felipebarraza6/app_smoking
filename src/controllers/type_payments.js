import { type_payments } from "../api/endpoints/payments";

import {
  changePage,
  changeFiltersSelects,
  resetFilterSelects,
} from "./type_payments/list_table";
import {
  selectTypePayment,
  createOrClear,
} from "./type_payments/create_update_form";

const createTypePayment = async (values, dispatch, form, notification) => {
  try {
    await type_payments.create(values);

    notification.success({
      message: "Método de pago creado exitosamente.",
    });

    // Actualizar la lista
    dispatch({
      type: "update_list",
    });

    // Limpiar el formulario
    form.resetFields();
  } catch (e) {
    const errors = e.response?.data || { error: "Error desconocido" };
    const errorList = Object.keys(errors).map((key) => errors[key]);

    notification.error({
      message: "Errores al crear el nuevo método de pago.",
      description: errorList.join(", "),
    });
  }
};

const updateTypePayment = async (
  values,
  state,
  dispatch,
  form,
  notification,
  message
) => {
  var view_notified = true;

  await type_payments
    .update(state.select_to_edit.id, values)
    .then(() => {
      if (view_notified) {
        notification.success({ message: "Método de pago actualizado." });
      }
      dispatch({
        type: "update_list",
      });
      dispatch({ type: "select_to_edit", payload: { type_payment: null } });
      form.resetFields();
    })

    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al actualizar el método de pago.",
        description: errorList.join(", "),
      });
    });
};

const deleteTypePayment = async (type_payment, dispatch, notification) => {
  await type_payments
    .destroy(type_payment.id)
    .then(() => {
      dispatch({
        type: "change_page",
        page: 1,
      });

      dispatch({
        type: "update_list",
      });
      notification.success({
        message: "Método de pago deshabilitado correctamente.",
      });
    })
    .catch((e) => {
      notification.error({
        message: "Error al eliminar el método de pago.",
        description: e.response.data.detail,
      });
    });
};

const getTypePayments = async (state, dispatch) => {
  try {
    const response = await type_payments.list(state.list.page, state.filters);
    console.log("📋 TypePayments response:", response);

    // Verificar que la respuesta tenga la estructura esperada
    const payload = {
      results: response?.results || response?.data || [],
      count: response?.count || 0,
    };

    dispatch({
      type: "add",
      payload: payload,
    });
  } catch (error) {
    console.error("Error loading payment methods:", error);

    // En caso de error, enviar datos vacíos
    dispatch({
      type: "add",
      payload: {
        results: [],
        count: 0,
      },
    });
  }
};

export const controller = {
  create_update_form: {
    select_to_edit: selectTypePayment,
    create_or_clear: createOrClear,
  },
  list_table: {
    change_page: changePage,
    change_filters_selects: changeFiltersSelects,
    reset_filters_selects: resetFilterSelects,
  },
  create: createTypePayment,
  update: updateTypePayment,
  delete: deleteTypePayment,
  list: getTypePayments,
};
