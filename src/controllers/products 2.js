import { list, create, update, destroy } from "../api/endpoints/products";
import { register_products } from "../api/endpoints/orders";

import {
  changePage,
  selectAddOrSubstract,
  changeFiltersSelects,
  resetFilterSelects,
  createCategory,
  updateCategory,
  destroyCategory,
} from "./products/list_table";
import { selectProduct, createOrClear } from "./products/create_update_form";

const createProduct = async (values, dispatch, form, notification) => {
  await create(values)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      notification.success({
        message: "Producto creado correctamente.",
      });
      form.resetFields();
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al crear el nuevo producto.",
        description: errorList.join(", "),
      });
    });
};

const updateProduct = async (
  values,
  state,
  dispatch,
  form,
  notification,
  message
) => {
  var view_notified = true;
  if (state.add_quantity || state.sus_quantity) {
    values = {
      ...values,
      quantity: state.add_quantity
        ? state.select_to_edit.quantity + values.quantity
        : state.select_to_edit.quantity - values.quantity,
    };

    const payload = {
      product: state.select_to_edit.id,
      quantity: values.quantity - state.select_to_edit.quantity,
      actual_quantity: values.quantity,
      is_active: true,
    };
    await register_products.create(payload).then(() => {
      message.info(
        ` ${state.select_to_edit.name}, inventario actualizado a ${values.quantity}.`
      );
      view_notified = false;
    });
  }

  if (isNaN(form.getFieldValue("quantity"))) {
    values = { ...values, quantity: null, quantity_alert: null };
  }
  form.resetFields();
  getProducts(state, dispatch);

  /* await update(state.select_to_edit.id, values)
    .then(() => {
      if (view_notified) {
        notification.success({ message: "Producto actualizado." });
      }
      dispatch({
        type: "update_list",
      });
      dispatch({ type: "select_to_edit", payload: { product: null } });
      form.resetFields();
    })

    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al actualizar el producto.",
        description: errorList.join(", "),
      });
    });*/
};

const deleteProduct = async (product, dispatch, notification) => {
  await destroy(product.id)
    .then(() => {
      dispatch({
        type: "change_page",
        page: 1,
      });

      dispatch({
        type: "update_list",
      });
      notification.success({ message: "Producto eliminado correctamente." });
    })
    .catch((e) => {
      notification.error({
        message: "Error al eliminar el producto.",
        description: e.response.data.detail,
      });
    });
};

const getProducts = async (state, dispatch) => {
  try {
    const response = await list(state.list.page, state.filters);

    const results = Array.isArray(response?.results)
      ? response.results
      : Array.isArray(response?.data)
      ? response.data
      : [];
    const count = response?.count || results.length;
    const categories = Array.isArray(response?.categories)
      ? response.categories
      : [];
    const branchs = Array.isArray(response?.branchs) ? response.branchs : [];
    const payload = {
      results,
      count,
      categories,
      branchs,
    };
    dispatch({
      type: "add",
      payload: payload,
    });
  } catch (error) {

    dispatch({
      type: "add",
      payload: {
        results: [],
        count: 0,
        categories: [],
        branchs: [],
      },
    });
  }
};

export const controller = {
  create_update_form: {
    select_to_edit: selectProduct,
    create_or_clear: createOrClear,
  },
  list_table: {
    change_page: changePage,
    select_add_or_substract: selectAddOrSubstract,
    change_filters_selects: changeFiltersSelects,
    reset_filters_selects: resetFilterSelects,
  },
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  list: getProducts,
  category: {
    create: createCategory,
    destroy: destroyCategory,
    update: updateCategory,
  },
};

export { getProducts };
