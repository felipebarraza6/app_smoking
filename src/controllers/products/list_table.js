import { categories } from "../../api/endpoints/products";

export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};

export const selectAddOrSubstract = (product, option, dispatch) => {
  dispatch({
    type: "select_to_add_rest",
    payload: {
      product: { ...product },
      add_quantity: option ? true : false,
      sus_quantity: option ? false : true,
    },
  });
};

export const changeFiltersSelects = (type, filter, dispatch) => {
  if (type === "branch" && filter === "all") {
    dispatch({
      type: "change_filters",
      payload: { [type]: null },
    });
  } else if (type === "branch" && Array.isArray(filter)) {
    dispatch({
      type: "change_filters",
      payload: { [type]: filter },
    });
  } else {
    dispatch({
      type: "change_filters",
      payload: { [type]: filter },
    });
  }
};

export const resetFilterSelects = (dispatch) => {
  dispatch({
    type: "change_filters",
    payload: {
      category: null,
      branch: null,
      search: null,
      code: null,
    },
  });
};

export const createCategory = async (values, dispatch, form) => {
  await categories.create(values).then((x) => {
    dispatch({
      type: "update_list",
    });
    form.resetFields();
  });
};

export const destroyCategory = async (id, dispatch) => {
  await categories.destroy(id).then((x) => {
    dispatch({
      type: "update_list",
    });
  });
};

export const updateCategory = async (e, dispatch) => {
  var payload = {
    name: e.target.value,
  };
  await categories.update(e.target.name, payload).then((x) => {
    dispatch({
      type: "update_list",
    });
  });
};
