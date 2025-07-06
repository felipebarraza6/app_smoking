export const selectClient = (client, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { client },
  });
  dispatch({
    type: "change_form",
    payload: { region: true, province: true, commune: true },
  });
};

export const createOrClear = ({ state, dispatch, form }) => {
  if (state.select_to_edit) {
    dispatch({
      type: "select_to_edit",
      payload: { client: null },
    });

    dispatch({
      type: "change_form",
      payload: { region: true, province: false, commune: false },
    });

    form.resetFields();
  } else {
    dispatch({
      type: "change_form",
      payload: { region: true, province: false, commune: false },
    });

    form.resetFields();
  }
};
