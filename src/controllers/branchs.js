import { list, create, update, destroy } from "../api/endpoints/branchs";

import { changePage } from "./branchs/list_table";
import { selectBranch, createOrClear } from "./branchs/create_update_form";

const createBranch = async (values, dispatch, form, notification) => {
  await create(values)
    .then(() => {
      dispatch({
        type: "postsave_or_update",
      });

      // Forzar actualización de la lista después de crear
      dispatch({
        type: "update_list",
      });

      form.resetFields();
      notification.success({ message: "Sucursal creada exitosamente." });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al crear la nueva sucursal.",
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

const updateBranch = async (values, state, dispatch, form, notification) => {
  if (typeof values.logo === "string") {
    values = {
      ...values,
      logo: undefined,
    };
  } else {
    values = {
      ...values,
      logo: values.logo,
    };
  }
  await update(state.select_to_edit.id, values)
    .then(() => {
      dispatch({
        type: "postsave_or_update",
      });

      form.resetFields();
      notification.success({ message: "Sucursal actualizada." });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al actualizar la sucursal.",
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

const deleteBranch = async (state, dispatch, notification) => {
  await destroy(state.id)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "change_page",
        page: 1,
      });
      notification.success({ message: "Sucursal eliminada correctamente." });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Error al eliminar la sucursal.",
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

const getBranchs = async (state, dispatch) => {
  try {
    const response = await list(state.list.page);

    const results = Array.isArray(response?.results)
      ? response.results
      : Array.isArray(response?.data)
      ? response.data
      : [];
    const count = response?.count || results.length;
    const branchs = Array.isArray(response?.branchs) ? response.branchs : [];
    const payload = {
      results,
      count,
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
        branchs: [],
      },
    });
  }
};

export const controller = {
  create_update_form: {
    select_to_edit: selectBranch,
    create_or_clear: createOrClear,
  },
  list_table: {
    change_page: changePage,
  },
  create: createBranch,
  update: updateBranch,
  delete: deleteBranch,
  list: getBranchs,
};
