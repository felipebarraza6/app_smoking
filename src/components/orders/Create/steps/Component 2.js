import React, { useContext } from "react";
import { Steps, Flex, Typography, theme } from "antd";
import { OrdersContext } from "../../../../containers/Orders";
import { MdContactMail } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { RiContractLine } from "react-icons/ri";

import { FaTruckFast } from "react-icons/fa6";
import { IoBagCheckSharp } from "react-icons/io5";
import { FiUserCheck } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";

const { Text } = Typography;

const StepsNav = ({ mobile }) => {
  const { state, dispatch } = useContext(OrdersContext);

  const {
    token: { colorPrimary },
  } = theme.useToken();

  /*
   * Generamos la misma estructura de items para reutilizarla tanto en
   * <Steps/> (desktop) como en la versión comprimida de sólo iconos (mobile).
   */
  const items = [
    {
      title: !mobile ? (
        state.products.selected_products.length > 0 ? (
          <b>
            {state.products.selected_products
              .reduce(
                (acc, product) => acc + product.quantity * product.price,
                0
              )
              .toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
          </b>
        ) : (
          "Productos"
        )
      ) : (
        ""
      ),
      key: "0",
      icon: state.steps.current !== 0 ? <IoBagCheckSharp /> : <AiFillProduct />,
      description: !mobile ? (
        <Flex gap="small" justify="center" vertical>
          <Text>
            {state.products.selected_products.length}{" "}
            {state.products.selected_products.length === 1 ? "item" : "items"}
          </Text>
        </Flex>
      ) : (
        ""
      ),
      disabled:
        state.products.selected_products.filter((product) => product).length ===
        0,
    },
    {
      title: !mobile ? "Cliente" : "",
      key: "1",
      description: !mobile ? (
        <Flex gap="small" justify="center" vertical>
          <Text>
            {state.clients.selected ? state.clients.selected.name : ""}
          </Text>
        </Flex>
      ) : (
        ""
      ),
      icon: state.clients.selected ? (
        <FiUserCheck />
      ) : state.steps.current === 1 ? (
        <FaUserEdit />
      ) : (
        <MdContactMail />
      ),
      disabled:
        state.products.selected_products.filter((product) => product).length ===
        0,
    },
    {
      title: !mobile
        ? state.steps.current >= 3
          ? state.drivers.selected
            ? "Con reparto"
            : "Sin reparto"
          : "Reparto"
        : "",
      key: "2",
      disabled: !state.clients.selected,
      icon: state.drivers.selected ? <FaTruckFast /> : <FaTruck />,
      description:
        !mobile && state.drivers.selected ? (
          <Flex vertical>
            <Text>{state.drivers.selected && state.drivers.selected.name}</Text>
            <Text>
              {state.drivers.selected.charge_amount &&
                "$ " +
                  parseInt(state.drivers.selected.charge_amount).toLocaleString(
                    "es-CL"
                  )}
            </Text>
          </Flex>
        ) : (
          ""
        ),
    },
    {
      title: !mobile ? "Plan de Pago" : "",
      key: "3",
      icon:
        state.steps.current !== 3 ? (
          state.payments.validate ? (
            <RiSecurePaymentLine />
          ) : (
            <RiContractLine />
          )
        ) : (
          <RiContractLine />
        ),
      disabled:
        state.products.selected_products.filter((product) => product).length ===
        0,
    },
  ];

  /*
   * Desktop: mantenemos <Steps/>
   */
  if (!mobile) {
    return (
      <Steps
        size="small"
        current={state.steps.current}
        clickable
        direction="horizontal"
        labelPlacement="horizontal"
        style={{ width: "100%" }}
        onChange={(current) => {
          dispatch({ type: "set_current_step", payload: { current } });
        }}
        items={items}
      />
    );
  }

  /*
   * Mobile: mostramos sólo los iconos en un flex horizontal.
   */
  return (
    <Flex align="center" justify="space-between" style={{ width: "100%" }}>
      {items.map((item, idx) => {
        const isDisabled = item.disabled;
        const isCurrent = idx === state.steps.current;

        return (
          <div
            key={item.key}
            onClick={() => {
              if (!isDisabled) {
                dispatch({
                  type: "set_current_step",
                  payload: { current: idx },
                });
              }
            }}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              cursor: isDisabled ? "not-allowed" : "pointer",
              opacity: isDisabled ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: isCurrent ? colorPrimary : "inherit",
            }}
          >
            {item.icon}
          </div>
        );
      })}
    </Flex>
  );
};

export default StepsNav;
