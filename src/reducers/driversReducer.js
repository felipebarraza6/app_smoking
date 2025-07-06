export const driversReducer = (state, action) => {
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
        select_to_edit: action.payload.driver,
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
          name: action.payload.name ? action.payload.name : null,
          branch: action.payload.branch ? action.payload.branch : null,
          vehicle_plate: action.payload.vehicle_plate
            ? action.payload.vehicle_plate
            : null,
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
