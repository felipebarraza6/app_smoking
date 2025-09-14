/** @jsxImportSource @emotion/react */
import React, { useContext } from "react";
import { css } from "@emotion/react";
import { AppContext } from "../../App";
import { Expand } from "@theme-toggles/react";

const ToggleTheme = () => {
  const { state, dispatch } = useContext(AppContext);

  const expandCss = css({
    color: state.algorithm === "dark" ? "white" : "black",
    fontSize: "27px",
  });

  const toggleTheme = () => {
    if (state.algorithm === "dark") {
      dispatch({
        type: "SET_ALGORITHM",
        payload: "light",
      });
    } else {
      dispatch({
        type: "SET_ALGORITHM",
        payload: "dark",
      });
    }
  };

  return (
    <Expand
      forceMotion={true}
      duration={300}
      size={25}
      toggled={state.algorithm === "dark" ? false : true}
      toggle={toggleTheme}
      css={expandCss}
    />
  );
};

export default ToggleTheme;
