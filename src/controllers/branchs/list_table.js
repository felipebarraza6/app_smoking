export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};
