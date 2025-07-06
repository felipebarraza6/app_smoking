export const selectBranch = (branch, dispatch) => {
  dispatch({
    type: "select_to_edit",
    payload: { branch },
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
      payload: { branch: null },
    });

    dispatch({
      type: "change_form",
      payload: { region: true, province: false, commune: false },
    });
    dispatch({
      type: "clear_logo",
    });

    form.resetFields();
  } else {
    dispatch({
      type: "change_form",
      payload: { region: true, province: false, commune: false },
    });
    dispatch({
      type: "clear_logo",
    });
    form.resetFields();
  }
};
