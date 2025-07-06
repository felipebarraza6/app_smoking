import { css } from "@emotion/react";

export const loginContainer = css({
  height: "100vh",
  backgroundImage: "linear-gradient(to top,  #262626, #050B0D)",
});

export const formElements = css({
  boxShadow: "0px 0px 20px 0px rgba(244, 70, 155, 0.5)",
  borderRadius: "15px",
  height: "550px",
  width: "400px",
});

export const titleContainer = css({
  textAlign: "center",
  color: "white",
  padding: "10px",
  marginTop: "-15px",
});
export const formContainer = css({
  transition: "transform 0.3s ease-in-out",
  marginBottom: "10px",
  width: "230px",
  "&:hover": {
    transform: "scale(1.05)",
  },
});
