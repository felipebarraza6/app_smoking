export const branchsReducer = (state, action) => {
  switch (action.type) {
    case "add":
      return {
        ...state,
        list: {
          ...state.list,
          results: action.payload.results,
          count: action.payload.count,
        },
        branchs: action.payload.branchs,
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
        select_to_edit: action.payload.branch,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

    case "change_logo": {
      return {
        ...state,
        form: {
          ...state.form,
          logo: action.payload,
        },
      };
    }

    case "clear_logo": {
      return {
        ...state,
        form: {
          ...state.form,
          logo: null,
        },
      };
    }

    case "change_form":
      return {
        ...state,
        form: {
          ...state.form,
          region: action.payload.region,
          province: action.payload.province,
          commune: action.payload.commune,
        },
      };

    case "postsave_or_update":
      return {
        ...state,
        form: {
          ...state.form,
          region: true,
          province: false,
          commune: false,
          logo: null,
        },
        select_to_edit: null,
      };

    default:
      return state;
  }
};
