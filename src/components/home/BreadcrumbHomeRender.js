/** @jsxImportSource @emotion/react */
import React from "react";
import { Breadcrumb, Tag } from "antd";
import { useLocation } from "react-router-dom";
import { css } from "@emotion/react";

const BreadcrumbHomeRender = () => {
  const location = useLocation();
  const parserLocation = [
    {
      title: "Home",
    },
    {
      title: location.pathname,
    },
  ];

  const itemRenderStyle = css({
    fontSize: "13px",
    fontWeight: "600",
  });

  const breadcrumbStyle = css({
    marginBottom: "20px",
  });

  const itemRender = (route) => {
    let routeRenderText = "";
    switch (route.title) {
      case "Home":
        routeRenderText = "app";
        break;
      case "/app/":
        routeRenderText = "escritorio";
        break;
      case "/app/branchs":
        routeRenderText = "tiendas";
        break;
      case "/app/users":
        routeRenderText = "usuarios";
        break;
      case "/app/products":
        routeRenderText = "productos";
        break;
      case "/app/clients":
        routeRenderText = "clientes y contactos";
        break;
      case "/app/drivers":
        routeRenderText = "repartidores";
        break;
      case "/app/type-payments":
        routeRenderText = "métodos de pago";
        break;
      case "/app/sale":
        routeRenderText = "venta";
        break;
      case "/app/orders-create":
        routeRenderText = "crear pedidos";
        break;
      case "/app/orders-management":
        routeRenderText = "gestión de pedidos";
        break;
      case "/app/sales-management":
        routeRenderText = "gestión de ventas";
        break;
      case "/app/measurements":
        routeRenderText = "mediciones";
        break;
      default:
        routeRenderText = "sin resultados";
        break;
    }
    return <Tag css={itemRenderStyle}>{routeRenderText}</Tag>;
  };

  return (
    <Breadcrumb
      items={parserLocation}
      itemRender={itemRender}
      css={breadcrumbStyle}
    />
  );
};

export default BreadcrumbHomeRender;
