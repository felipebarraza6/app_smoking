import * as api from "../../api/endpoints/users";

export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};

export const changeBranchIds = (branch_ids, dispatch) => {
  dispatch({
    type: "set_branch_ids",
    branch_ids,
  });
  dispatch({ type: "update_list" });
};

export const list = async (state, dispatch) => {
  const page = state.list?.page || 1;
  const branch_ids = state.list?.branch_ids || [];
  const data = await api.list(page, branch_ids);
  dispatch({
    type: "add_users",
    payload: {
      results: data.results,
      count: data.count,
    },
  });
};
