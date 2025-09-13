export const productsReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        list: {
          ...state.list,
          results: action.payload.results,
          count: action.payload.count,
        },
        categories: {
          ...state.categories,
          list: action.payload.categories || [],
          count: (action.payload.categories || []).length,
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
        select_to_edit: action.payload.product,
        add_quantity: false,
        sus_quantity: false,
      };

    case "select_to_edit_category":
      return {
        ...state,
        categories: {
          ...state.categories,
          select_to_edit: action.payload.category,
        },
      };

    case "select_to_add_rest":
      return {
        ...state,
        select_to_edit: action.payload.product,
        add_quantity: action.payload.add_quantity,
        sus_quantity: action.payload.sus_quantity,
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
          search: action.payload.search ? action.payload.search : null,
          category: action.payload.category ? action.payload.category : null,
          branch: action.payload.branch ? action.payload.branch : null,
          code: action.payload.code ? action.payload.code : null,
        },
        list: {
          ...state.list,
          page: 1,
        },
      };

    case "set_categories":
      return {
        ...state,
        categories: {
          ...state.categories,
          list: action.payload.categories || [],
          count: (action.payload.categories || []).length,
        },
      };

    default:
      return state;
  }
};
