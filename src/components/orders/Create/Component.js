import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Flex, Tag, App, Popconfirm } from "antd";
import { css } from "@emotion/react";
import { OrdersContext } from "../../../containers/Orders";
import { ShopOutlined, ReloadOutlined } from "@ant-design/icons";
import StepsNav from "./steps/Component";
import Products from "./products/Component";
import Payments from "./add_payments/Component";
import DeliveryInput from "./forms/DeliveryInput";
import ClientForm from "./forms/ClientForm";
import { controller } from "../../../controllers/sales";
import api from "../../../api/endpoints";
import SiderCart from "./products/SiderCart";
import ListDrafts from "./drafts/Component";
import { useBreakpoint, isMobile } from "../../../utils/breakpoints";
import OrderCreateMobileCard from "./OrderCreateMobileCard";

/** @jsxImportSource @emotion/react */

const CreateUpdate = () => {
  const { state, dispatch } = useContext(OrdersContext);
  const { message } = App.useApp();
  const breakpoint = useBreakpoint();
  const mobile = isMobile(breakpoint);

  const branchs = state.branchs?.list || [];
  const selected_branch = state.branchs.selected;
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  const iconStyle = css({
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  });

  const titleCard = (
    <Flex align="center" gap={"small"}>
      {selected_branch && (
        <img alt="logo" src={selected_branch.logo} css={iconStyle} />
      )}
      <div>Pedido</div>
    </Flex>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setCurrentTime(now.toLocaleString("es-ES", options));
    }, 1000);

    controller.get_resources(dispatch, state);

    return () => clearInterval(interval);
  }, []);

  const tabProps = {
    centered: true,
    addIcon: true,
    type: "card",
    size: "small",
  };

  const onChangeTab = (key) => {
    const get_branch = branchs.find((branch) => branch.id === key);

    dispatch({
      type: "selected_branch",
      payload: get_branch,
    });
  };

  // Renderizado móvil para productos agregados (cards compactas)
  const renderMobileProducts = () => {
    const products = state.products.selected_products || [];
    return (
      <div style={{ marginTop: 8 }}>
        {products.map((prod, idx) => (
          <OrderCreateMobileCard
            key={prod.id || idx}
            product={prod}
            onEdit={() => {
              /* lógica de edición aquí */
            }}
            onDelete={() => {
              /* lógica de eliminación aquí */
            }}
            planPago={state.payments?.plan || null}
          />
        ))}
      </div>
    );
  };

  // Renderizado móvil para cada paso
  const renderMobileStep = () => {
    switch (state.steps.current) {
      case 0:
        return (
          <>
            <Products mobile />
            {renderMobileProducts()}
          </>
        );
      case 1:
        return <ClientForm mobile />;
      case 2:
        return <DeliveryInput mobile />;
      case 3:
        return <Payments mobile />;
      default:
        return null;
    }
  };

  return (
    <Card
      hoverable
      onTabChange={onChangeTab}
      activeTabKey={selected_branch?.id}
      title={titleCard}
      tabProps={tabProps}
      style={{
        minHeight: "70vh",
      }}
      extra={
        <Flex gap="small">
          <Tag>{currentTime}</Tag>
          {state.order.create_id && <Tag>{state.order.create_id}</Tag>}
          <ListDrafts />
          <Popconfirm
            title="¿Está seguro?"
            description="Se eliminará el registro creado"
            onConfirm={() => {
              if (state.order.create_id) {
                api.orders.delete(state.order.create_id).then((response) => {
                  message.error("Se elimino correctamente el borrador", 5);
                });
              }
              dispatch({ type: "reset_all" });
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button
              icon={<ReloadOutlined />}
              shape="round"
              size="small"
            ></Button>
          </Popconfirm>
        </Flex>
      }
      tabList={
        Array.isArray(branchs)
          ? branchs.map((branch) => ({
              key: branch.id,
              label:
                branch.business_name.length > 15
                  ? `${branch.business_name.slice(0, 15).toUpperCase()}...`
                  : branch.business_name.toUpperCase(),
              icon: <ShopOutlined />,
            }))
          : []
      }
    >
      <Flex gap="large" style={{ minHeight: "60vh" }} vertical>
        {/* StepsNav siempre visible, pero compacto en móvil */}
        <StepsNav />

        {state.steps.current === 0 && <Products />}
        {state.steps.current === 2 && <DeliveryInput />}
        {state.steps.current === 3 && <Payments />}
        {state.steps.current === 1 && <ClientForm />}
      </Flex>
      <SiderCart />
    </Card>
  );
};

export default CreateUpdate;
