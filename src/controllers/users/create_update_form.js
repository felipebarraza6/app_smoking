export const selectUser = (user, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { user },
  });
};

export const createOrClear = ({ state, dispatch, form }) => {
  if (state.select_to_edit) {
    dispatch({
      type: "select_to_edit",
      payload: { user: null },
    });
    form.resetFields();
  } else {
    form.resetFields();
  }
};
