export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};

export const changeFiltersSelects = (type, filter, dispatch) => {
  if (type === "branch" && Array.isArray(filter)) {
    // Para filtros de sucursal múltiple, enviar el array completo
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
