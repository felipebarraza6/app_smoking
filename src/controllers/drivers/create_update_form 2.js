export const selectClient = (driver, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { driver },
  });
};

export const createOrClear = ({ state, dispatch, form }) => {
  if (state.select_to_edit) {
    dispatch({
      type: "select_to_edit",
      payload: { driver: null },
    });

    form.resetFields();
  } else {
    form.resetFields();
  }
};
