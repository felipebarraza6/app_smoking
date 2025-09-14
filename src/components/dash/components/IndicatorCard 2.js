import React from "react";
import { Card, Typography, theme } from "antd";

const { Text } = Typography;

const IndicatorCard = ({
  title,
  value,
  color,
  icon,
  onClick,
  clickable = false,
}) => {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable={clickable}
      style={{
        flex: 1,
        minWidth: 180,
        borderRadius: 8,
        border: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        cursor: clickable ? "pointer" : "default",
        textAlign: "center",
      }}
      bodyStyle={{ padding: 16 }}
      onClick={clickable ? onClick : undefined}
    >
      <div style={{ fontSize: 24, color, marginBottom: 8 }}>{icon}</div>
      <Text
        strong
        style={{
          display: "block",
          fontSize: "12px",
          color: token.colorTextSecondary,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          display: "block",
          fontSize: "18px",
          fontWeight: "bold",
          color: token.colorText,
        }}
      >
        {value}
      </Text>
      {clickable && (
        <Text
          style={{
            display: "block",
            fontSize: "10px",
            color: token.colorTextTertiary,
            marginTop: 4,
          }}
        >
          Click para ver detalles
        </Text>
      )}
    </Card>
  );
};

export default IndicatorCard;
