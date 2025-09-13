import React, { useContext, useEffect, useState } from "react";
import { Card, Flex, Tag, App, Popconfirm, Button } from "antd";
import { ShopOutlined, ReloadOutlined } from "@ant-design/icons";
import StepsNav from "./steps/Component";
import Products from "./products/Component";
import Payments from "./add_payments/Component";
import DeliveryInput from "./forms/DeliveryInput";
import ClientForm from "./forms/ClientForm";
import SiderCart from "./products/SiderCart";
import ListDrafts from "./drafts/Component";
import { SaleContext } from "../../../containers/Sale";
import { controller } from "../../../controllers/sales";
import api from "../../../api/endpoints";
import { css } from "@emotion/react";

/** @jsxImportSource @emotion/react */

const SaleCreateDesktop = () => {
  const { state, dispatch } = useContext(SaleContext);
  const { message } = App.useApp();
  const branchs = Array.isArray(state.branchs.list) ? state.branchs.list : [];
  const selected_branch = state.branchs.selected;
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

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

  const onChangeTab = (key) => {
    const get_branch = branchs.find((branch) => branch.id === key);
    if (get_branch) {
      dispatch({
        type: "selected_branch",
        payload: get_branch,
      });
    }
  };

  const tabProps = {
    centered: true,
    addIcon: true,
    type: "card",
    size: "small",
  };

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
      <div>Venta</div>
    </Flex>
  );

  return (
    <Card
      hoverable
      onTabChange={onChangeTab}
      activeTabKey={selected_branch?.id}
      title={titleCard}
      style={{ minHeight: "70vh" }}
      tabProps={tabProps}
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
                api.orders.delete(state.order.create_id).then(() => {
                  message.error("Se eliminó correctamente el borrador", 5);
                });
              }
              dispatch({ type: "reset_all" });
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<ReloadOutlined />} shape="round" size="small">
              Reiniciar
            </Button>
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
      <Flex gap="large" style={{ minHeight: "60vh" }}>
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

export default SaleCreateDesktop;
