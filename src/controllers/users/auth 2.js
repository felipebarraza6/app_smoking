import { Modal } from "antd";
import { login } from "../../api/endpoints/users";

export const postLogin = async (data, dispatch) => {
  await login(data)
    .then((x) => {
      dispatch({
        type: "LOGIN",
        payload: {
          token: x.data.access_token,
          user: x.data.user,
        },
      });
    })
    .catch((e) => {
      Modal.error({
        content: "Credenciales invalidas!",
        okButtonProps: {
          type: "primary",
          style: { backgroundColor: "black" },
        },
      });
    });
};
