export const homeReducer = (state, action) => {
  switch (action.type) {
    case "set_width":
      return {
        ...state,
        windowWidth: action.payload,
      };

    default:
      return state;
  }
};
