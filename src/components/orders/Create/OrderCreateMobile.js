import React, { useContext } from "react";
import { Card, Flex, Tag, Button, message } from "antd";
import { OrdersContext } from "../../../containers/Orders";
import { ReloadOutlined } from "@ant-design/icons";
import StepsNav from "./steps/Component";
import Products from "./products/Component";
import Payments from "./add_payments/Component";
import DeliveryInput from "./forms/DeliveryInput";
import ClientForm from "./forms/ClientForm";
import SiderCart from "./products/SiderCart";
import ListDrafts from "./drafts/Component";
import { Popconfirm } from "antd";
import api from "../../../api/endpoints";

const OrderCreateMobile = () => {
  const { state, dispatch } = useContext(OrdersContext);
  const branchs = state.branchs.list;
  const selected_branch = state.branchs.selected;

  // Renderizado móvil para cada paso
  const renderMobileStep = () => {
    switch (state.steps.current) {
      case 0:
        return (
          <>
            <Products mobile />
            <SiderCart />
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
  const tabProps = {
    centered: true,
    addIcon: true,
    type: "card",
    size: "small",

    style: {
      marginTop: "10px",
    },
  };

  const onChangeTab = (key) => {
    const get_branch = branchs.find((branch) => branch.id === key);

    dispatch({
      type: "selected_branch",
      payload: get_branch,
    });
  };
  const titleCard = (
    <Flex align="center" gap={"small"} style={{ marginTop: "10px" }} wrap>
      {selected_branch && (
        <img
          alt="logo"
          src={selected_branch.logo}
          style={{
            width: "20px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      {state.order.create_id ? (
        <Tag>{state.order.create_id}</Tag>
      ) : (
        <Tag>Pedido</Tag>
      )}
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
        <Button icon={<ReloadOutlined />} shape="round" size="small">
          Reiniciar
        </Button>
      </Popconfirm>
    </Flex>
  );

  return (
    <>
      <Card
        hoverable
        title={titleCard}
        size="small"
        activeTabKey={selected_branch?.id}
        tabList={branchs.map((branch) => ({
          key: branch.id,
          label:
            branch.business_name.length > 10
              ? `${branch.business_name.slice(0, 10).toUpperCase()}...`
              : branch.business_name.toUpperCase(),
        }))}
        style={{ minHeight: "70vh", padding: 0, width: "100%" }}
        tabProps={tabProps}
        onTabChange={onChangeTab}
      >
        <Flex gap="small" vertical>
          <StepsNav mobile />
          {renderMobileStep()}
        </Flex>
      </Card>
    </>
  );
};

export default OrderCreateMobile;
