export const selectProduct = (product, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { product },
  });
};

export const createOrClear = ({ state, dispatch, form, setIsStock }) => {
  if (state.select_to_edit) {
    dispatch({
      type: "select_to_edit",
      payload: { product: null },
    });

    form.resetFields();
  } else {
    form.resetFields();
    form.resetFields(["quantity", "quantity_altert"]);
    setIsStock(false);
  }
};
