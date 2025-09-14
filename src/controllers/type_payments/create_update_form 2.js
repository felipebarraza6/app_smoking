export const selectTypePayment = (type_payment, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { type_payment },
  });
};

export const createOrClear = ({ state, dispatch, form }) => {
  if (state.select_to_edit) {
    dispatch({
      type: "select_to_edit",
      payload: { type_payment: null },
    });

    form.resetFields();
  } else {
    form.resetFields();
  }
};
