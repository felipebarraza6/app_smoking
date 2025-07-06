export const clientsReducer = (state, action) => {
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

    case "add_contacts":
      return {
        ...state,
        contacts: {
          ...state.contacts,
          list: action.payload.results,
          count: action.payload.count,
        },
      };

    case "select_contact":
      return {
        ...state,
        contacts: {
          ...state.contacts,
          select_to_edit: action.payload.contact,
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
        select_to_edit: action.payload.client,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

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
        },
        select_to_edit: null,
      };

    case "change_filters":
      return {
        ...state,
        filters: {
          ...state.filters,
          name: action.payload.name ? action.payload.name : null,
          dni: action.payload.dni ? action.payload.dni : null,
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
