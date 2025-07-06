export const usersReducer = (state, action) => {
  switch (action.type) {
    case "add_users":
      return {
        ...state,
        list: {
          ...state.list,
          results: action.payload.results,
          count: action.payload.count,
        },
      };

    case "update_list":
      return {
        ...state,
        list: {
          ...state.list,
          countUpdate: state.list.countUpdate + 1,
        },
      };

    case "select_to_edit":
      return {
        ...state,
        select_to_edit: action.payload.user,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

    case "set_branch_ids":
      return {
        ...state,
        list: {
          ...state.list,
          branch_ids: action.branch_ids,
          page: 1, // reset page on filter change
        },
      };

    default:
      return state;
  }
};
