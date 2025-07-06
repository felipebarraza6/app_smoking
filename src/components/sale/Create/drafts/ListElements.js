import React, { useState, useCallback, useContext, useEffect } from "react";
import { Button, Table, Tag, Flex, Popconfirm } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { DeleteFilled } from "@ant-design/icons";
import api from "../../../../api/endpoints";
import { SaleContext } from "../../../../containers/Sale";

const ListElements = ({ setVisible }) => {
  const [drafts, setDrafts] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const { state, dispatch } = useContext(SaleContext);

  const getDrafts = useCallback(async () => {
    try {
      let filters = `is_sale=true&is_active=false`;
      await api.orders.list(page, filters).then((res) => {
        setCount(res.count);
        setDrafts(res.results);
      });
    } catch (error) {

    }
  }, [page]);

  const deleteOrder = useCallback(
    async (id) => {
      await api.orders.delete(id).then(() => {
        getDrafts();
      });
    },
    [getDrafts]
  );

  const calculateTotalQuantity = (registers) => {
    return registers.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const selectedOrderPreview = (order) => {
    dispatch({
      type: "add_draw_to_edit",
      payload: order,
    });
    setVisible(false);
  };

  const columns = [
    {
      title: "PRE ID",
      dataIndex: "id",
      render: (id) => <u>{id.slice(-12)}</u>,
    },
    {
      title: "Productos",
      align: "center",
      dataIndex: "registers",
      render: (register) => {
        return calculateTotalQuantity(register);
      },
    },
    {
      title: "Cliente",
      align: "end",
      dataIndex: "client",
      render: (client) => {
        return (
          <>
            {client ? (
              <Tag color={!client.is_active && "green"}>{client.name}</Tag>
            ) : (
              "S/C"
            )}
          </>
        );
      },
    },
    {
      title: "Reparto",
      align: "end",
      render: (order) => {
        let amount = parseInt(order.driver?.amount).toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        });

        return (
          <Flex vertical gap="small">
            {order.driver ? (
              <>
                <Tag style={{ textAlign: "center" }}>{order.driver.name}</Tag>
                <Tag
                  color="gold-inverse"
                  style={{ color: "black", textAlign: "center" }}
                >
                  {amount}
                </Tag>
              </>
            ) : (
              "S/C"
            )}
          </Flex>
        );
      },
    },
    {
      align: "center",
      render: (order) => {
        return (
          <Flex gap="small" justify="center">
            <Popconfirm
              okText="Eliminar"
              title="Estas seguro de eliminar este borrador?"
              onConfirm={() => {
                deleteOrder(order.id);
              }}
            >
              <Button
                icon={<DeleteFilled />}
                danger
                type="primary"
                size="small"
                shape="circle"
              />
            </Popconfirm>
            <Button
              onClick={() => selectedOrderPreview(order)}
              ref={order}
              icon={<RightOutlined />}
              type="primary"
              shape="round"
              size="small"
            >
              Terminar
            </Button>
          </Flex>
        );
      },
    },
  ];

  const config = {
    columns: columns,
    size: "small",
    title: () => `Tienes ${count} borradores.`,
    bordered: true,
    scroll: { x: "max-content" },
    dataSource: drafts,
    pagination: {
      total: count,
      showSizeChanger: false,
      onChange: (page) => {
        setPage(page);
      },
    },
  };

  useEffect(() => {
    getDrafts();
  }, [getDrafts, state.order]);

  return <Table {...config} />;
};

export default ListElements;
