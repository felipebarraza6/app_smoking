import React, { useContext } from "react";
import { Flex, Button, Badge, Avatar } from "antd";
import { BuildFilled, UserAddOutlined } from "@ant-design/icons";
import { BiMoneyWithdraw } from "react-icons/bi";
import ListProducts from "./ListProducts";
import { SaleContext } from "../../../../containers/Sale";
import { AppContext } from "../../../../App";
import SiderCart from "./SiderCart";
import api from "../../../../api/endpoints";

const Products = ({ mobile }) => {
  const { state, dispatch } = useContext(SaleContext);
  const { state: appState } = useContext(AppContext);

  const changeStep = (step) => {
    dispatch({ type: "set_current_step", payload: { current: step } });
  };

  const createOrder = async (branch_only_sale) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    let values = {
      owner: appState.user.id,
      branch_only_sale: branch_only_sale || state.branchs.selected.id,
      date: formattedDate,
      selected_products: state.products.selected_products,
      total_cost: state.products.selected_products.reduce(
        (total, product) => total + product.price_internal * product.quantity,
        0
      ),
      total_amount: state.products.selected_products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      ),
      is_sale: true,
    };

    const response = await api.orders
      .create(values)
      .then(async (response) => {
        dispatch({
          type: "update_for_order",
          payload: response.data.selected_products,
        });
        dispatch({
          type: "add_order_created",
          payload: response.data.id,
        });
      })
      .catch((error) => {

      })
      .finally(() => {

      });

    return response;
  };

  return (
    <Flex vertical style={{ width: "100%" }}>
      <ListProducts mobile={mobile} />
      {mobile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 12,
            width: "100%",
          }}
        >
          <Button
            type="primary"
            icon={<BiMoneyWithdraw />}
            disabled={state.products.selected_products.length === 0}
            shape="round"
            style={{ width: "100%" }}
            onClick={() => {
              if (!state.order.create_id) {
                createOrder(state.branchs.selected.id);
              }
              changeStep(3);
            }}
          >
            Pagar
          </Button>
          <Button
            type="primary"
            icon={<BuildFilled />}
            disabled={state.products.selected_products.length === 0}
            shape="round"
            style={{ width: "100%" }}
            onClick={() => {
              if (!state.order.create_id) {
                createOrder();
              }
              changeStep(1);
            }}
          >
            Cliente
          </Button>
        </div>
      ) : (
        <Flex justify="end">
          <Flex gap={"small"}>
            <Button
              type="primary"
              icon={<BiMoneyWithdraw />}
              disabled={state.products.selected_products.length === 0}
              shape="round"
              onClick={() => {
                if (!state.order.create_id) {
                  createOrder(state.branchs.selected.id);
                }
                changeStep(3);
              }}
            >
              Pagar
            </Button>
            <Button
              type="primary"
              icon={<BuildFilled />}
              disabled={state.products.selected_products.length === 0}
              shape="round"
              onClick={() => {
                if (!state.order.create_id) {
                  createOrder();
                }
                changeStep(1);
              }}
            >
              Cliente
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Products;
