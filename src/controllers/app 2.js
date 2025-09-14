//Controllers App
const UpdateApp = (dispatch) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const algorithm = localStorage.getItem("algorithm");
  if (token && user) {
    dispatch({
      type: "LOGIN",
      payload: { token, user, algorithm },
    });
  }
};

export const controller = {
  update_app: UpdateApp,
};
