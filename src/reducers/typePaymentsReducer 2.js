export const typePaymentsReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        list: {
          ...state.list,
          results: action.payload.results,
          count: action.payload.count,
        },
        branchs: {
          ...state.branchs,
          list: action.payload.branchs || [],
          count: (action.payload.branchs || []).length,
        },
      };

    case "update_list":
      return {
        ...state,
        countUpdate: state.countUpdate + 1,
      };

    case "select_to_edit":
      return {
        ...state,
        select_to_edit: action.payload.type_payment,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

    case "change_filters":
      return {
        ...state,
        filters: {
          ...state.filters,
          branch: action.payload.branch ? action.payload.branch : null,
        },
        list: {
          ...state.list,
          page: 1,
        },
      };

    default:
      return state;
  }
};
