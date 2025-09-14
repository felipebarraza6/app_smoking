/** @jsxImportSource @emotion/react */
import React, { useContext } from "react";
import { Button, Space, Popconfirm } from "antd";
import { MenuOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import { AppContext } from "../../App";
import { magenta, purple } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { SiGoogledocs } from "react-icons/si";

const ResponsiveHeader = React.memo(({ onMenuClick, onProfileClick }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const headerBg = state.algorithm === "dark" ? magenta[8] : purple[9];
  const headerStyle = css({
    width: "100%",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: headerBg,
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  });

  return (
    <header css={headerStyle}>
      {/* Menú hamburguesa */}
      <Button
        type="text"
        icon={<MenuOutlined style={{ fontSize: 24, color: "#fff" }} />}
        onClick={onMenuClick}
        style={{ marginRight: 8 }}
        aria-label="Abrir menú"
      />

      {/* Logo o título */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo />
      </div>

      {/* Controles a la derecha */}
      <Space>
        <Button
          type="text"
          icon={<UserOutlined style={{ fontSize: 17, color: "#fff" }} />}
          aria-label="Perfil"
          onClick={onProfileClick}
        />
        <Button
          type="text"
          icon={
            <SiGoogledocs
              style={{ fontSize: 20, verticalAlign: "middle", color: "white" }}
            />
          }
          aria-label="Documentación"
          onClick={() => navigate("/app/documentation")}
        />
        <Popconfirm
          title="¿Estas seguro de cerrar sesión?"
          onConfirm={() => {
            dispatch({ type: "LOGOUT" });
            navigate("/");
          }}
          cancelButtonProps={{ type: "primary" }}
        >
          <Button
            icon={<LogoutOutlined style={{ color: "#fff" }} />}
            shape="circle"
            type="text"
          />
        </Popconfirm>
      </Space>
    </header>
  );
});

export default ResponsiveHeader;
