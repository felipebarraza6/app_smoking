import React, { useState } from "react";
import { Flex, Tag, Tooltip, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

function CodeBlock({
  children,
  status,
  method = "GET",
  isDark = true,
  style = {},
  ...props
}) {
  const [copied, setCopied] = useState(false);
  let bg = isDark ? "#23272e" : "#f5f5f5";
  let color = isDark ? "#e6e6e6" : "#222";
  let border = isDark ? "1.5px solid #333" : "1.5px solid #e0e0e0";
  let tagColor =
    status === 200 ? "#52c41a" : status === 401 ? "#ff4d4f" : "#1890ff";
  let methodColor = {
    GET: "#10a37f",
    POST: "#fca130",
    PUT: "#3578e5",
    DELETE: "#e14c4c",
    PATCH: "#b37feb",
    default: "#1890ff",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div
      style={{
        background: bg,
        color,
        border,
        borderRadius: 14,
        margin: "28px 0",
        fontSize: 16,
        fontFamily: "Fira Mono, Menlo, monospace",
        boxShadow: isDark ? "0 2px 16px 0 rgba(0,0,0,0.18)" : "none",
        overflow: "hidden",
        ...style,
      }}
      {...props}
    >
      {/* Header tipo Postman */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isDark ? "#181b20" : "#e9e9e9",
          borderBottom: isDark ? "1.5px solid #222" : "1.5px solid #e0e0e0",
          padding: "0 18px 0 12px",
          height: 44,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Tag
            style={{
              background: methodColor[method] || methodColor.default,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              borderRadius: 7,
              padding: "2px 16px",
              marginRight: 0,
              border: 0,
              letterSpacing: 1,
            }}
          >
            {method}
          </Tag>
          {status && (
            <Tag
              style={{
                background: tagColor,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 7,
                padding: "2px 14px",
                border: 0,
                marginLeft: 0,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
              }}
            >
              {status === 200
                ? "200 OK"
                : status === 401
                ? "401 Unauthorized"
                : status}
            </Tag>
          )}
        </div>
        <Tooltip title={copied ? "¡Copiado!" : "Copiar"}>
          <Button
            icon={<CopyOutlined />}
            size="small"
            type="text"
            style={{ color: copied ? "#52c41a" : color }}
            onClick={handleCopy}
          />
        </Tooltip>
      </div>
      {/* Bloque de código */}
      <Flex
        style={{
          padding: 22,
          paddingTop: 18,
          background: "none",
          color: "inherit",
          fontSize: 16,
          fontFamily: "Fira Mono, Menlo, monospace",
          overflowX: "auto",
        }}
      >
        <pre
          style={{
            background: "none",
            color: "inherit",
            margin: 0,
            width: "100%",
          }}
        >
          <code>{children}</code>
        </pre>
      </Flex>
    </div>
  );
}

export default CodeBlock;
