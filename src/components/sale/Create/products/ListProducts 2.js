import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  InputNumber,
  Input,
  Button,
  Flex,
  App,
  Form,
  Select,
  Tag,
} from "antd";
import {
  ProfileFilled,
  BarcodeOutlined,
  FilterFilled,
  CalendarOutlined,
} from "@ant-design/icons";
import { SaleContext } from "../../../../containers/Sale";
import { controller } from "../../../../controllers/sales";
import { IoBagAdd } from "react-icons/io5";
import { AppContext } from "../../../../App";
import api from "../../../../api/endpoints";

export const ListProducts = ({ mobile }) => {
  const { state, dispatch } = useContext(SaleContext);
  const { state: stateApp } = useContext(AppContext);
  const [inputValues, setInputValues] = useState([]);
  const [form] = Form.useForm();
  const [formFilter] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const { message } = App.useApp();
  useEffect(() => {
    setIsLoading(true);
    if (state.branchs.selected) {
      controller.get_products(dispatch, state).then(() => {
        setIsLoading(false);
      });

      setInputValues([]);
      form.resetFields();

      const filters = state.products.filters;
      if (filters && typeof filters === "object") {
        const hasNonEmptyValues = Object.values(filters).some(
          (value) => value !== ""
        );
        if (!hasNonEmptyValues) {
          formFilter.resetFields();
        }
      }
    } else {
      setIsLoading(false);
    }
  }, [state.branchs.selected, state.products.filters, state.products.page]);

  const handleInputChange = (value, key) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const handleButtonClick = (record) => {
    form.resetFields([record.id]);
    setInputValues((prevValues) => ({
      ...prevValues,
      [record.id]: 0,
    }));

    const quantity = inputValues[record.id];
    const unit = record.type_medition ? record.type_medition : "";
    const unitText = quantity > 1 ? `(s)` : "";
    const unitText2 = quantity > 1 ? `n` : "";

    message.info(
      `Se ha${unitText2} agregado ${quantity} ${
        unit ? `${unit}${unitText}` : ""
      } al carrito`
    );

    if (state.order.create_id) {
      var create_register = api.orders.register_products
        .create({
          order: state.order.create_id,
          product: record.id,
          quantity: inputValues[record.id],
          is_active: false,
        })
        .then((response) => {
          dispatch({
            type: "add_selected_products",
            payload: {
              id: record.id,
              product: record.id,
              price: record.price,
              price_internal: record.price_internal,
              actual_quantity: record.quantity,
              name: record.name,
              user: stateApp.user.id,
              category: record.category.name,
              id_order_product: response.data.id,
              quantity: inputValues[record.id],
              is_sale_order: true,
              is_delivery: state.drivers.selected ? true : false,
            },
          });
        })
        .catch((error) => {

        });
    } else {
      dispatch({
        type: "add_selected_products",
        payload: {
          id: record.id,
          product: record.id,
          price: record.price,
          price_internal: record.price_internal,
          actual_quantity: record.quantity,
          name: record.name,
          user: stateApp.user.id,
          category: record.category.name,
          quantity: inputValues[record.id],
          is_sale_order: true,
          is_delivery: state.drivers.selected ? true : false,
        },
      });
    }
  };

  const onFilterProductsForCategory = (value) => {
    const filters = {
      ...state.products.filters,
      ...value,
    };
    dispatch({ type: "change_filters_products", payload: filters });
  };

  return (
    <Table
      size="small"
      scroll={{ x: "max-content" }}
      loading={isLoading}
      title={() => (
        <Form
          onValuesChange={onFilterProductsForCategory}
          form={formFilter}
          defaultValue={state.products.filters}
        >
          <Flex
            vertical={mobile}
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Flex gap="small">
              <Form.Item name={"search"}>
                <Input placeholder="Nombre" prefix={<ProfileFilled />} />
              </Form.Item>
              <Form.Item name={"code"}>
                <Input placeholder="Codigo" prefix={<BarcodeOutlined />} />
              </Form.Item>
            </Flex>
            <Form.Item
              name={"category"}
              style={{
                marginTop: mobile ? "-14px" : 0,
                marginBottom: mobile ? "5px" : 0,
              }}
            >
              <Select
                placeholder="Filtrar por Categoría"
                suffixIcon={<FilterFilled />}
                name={"category"}
                allowClear
                options={state.products.categories.map((category) => ({
                  id: category.id,
                  value: category.id,
                  label: category.name,
                }))}
                style={{ width: mobile ? "100%" : "200px" }}
                onChange={(value) => {
                  onFilterProductsForCategory({ category: value });
                }}
              />
            </Form.Item>
          </Flex>
        </Form>
      )}
      bordered
      pagination={{
        pageSize: 4,
        total: state.products.count,
        showSizeChanger: false,
        onChange: (page) => {
          dispatch({ type: "change_page_products", payload: page });
        },
      }}
      columns={[
        {
          title: "Nombre",
          key: "name",
          render: (product) => (
            <Flex gap="small" justify="space-between">
              <strong>{product.name}</strong>
              {!mobile ? (
                <Flex>
                  <Tag icon={<FilterFilled />}>{product.category.name}</Tag>

                  {product.code && (
                    <Tag icon={<BarcodeOutlined />}>{product.code}</Tag>
                  )}
                </Flex>
              ) : (
                <>
                  {product.quantity && (
                    <Tag>{product.quantity.toLocaleString("es-CL")}</Tag>
                  )}
                </>
              )}
            </Flex>
          ),
        },
        {
          title: "Precio",
          dataIndex: "price",
          align: "end",
          key: "price",
          render: (price) =>
            parseFloat(price).toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            }),
        },
        {
          title: "Inventario",
          key: "quantity",
          hidden: mobile,
          align: "center",
          render: (product) => (
            <Flex justify="center">
              {product.quantity ? (
                <>
                  <Tag>
                    {product.quantity} ({product.type_medition})
                  </Tag>
                </>
              ) : (
                <>S/GI</>
              )}
            </Flex>
          ),
        },
        {
          width: "26%",
          title: "Cantidad",
          dataIndex: "quantity",
          align: "center",
          key: "quantity",
          render: (text, record) => {
            return (
              <Form key={record.id} form={form} layout="inline">
                <Flex
                  justify="center"
                  style={{ width: "100%" }}
                  vertical={mobile}
                >
                  <Form.Item name={record.id}>
                    {state.products.selected_products.find(
                      (p) => p.id === record.id
                    ) ? (
                      <>
                        {" "}
                        {state.products.selected_products.map((x) => {
                          if (x.id === record.id) {
                            return (
                              <center>
                                <Tag>{x.quantity}</Tag>
                              </center>
                            );
                          }
                        })}{" "}
                      </>
                    ) : (
                      <InputNumber
                        type="number"
                        style={{ width: "85px" }}
                        disabled={state.products.selected_products.find(
                          (p) => p.id === record.id
                        )}
                        max={record.quantity}
                        suffix={record.type_medition}
                        min={0}
                        placeholder={`0${
                          record.quantity > 0 ? "-" + record.quantity : " "
                        }`}
                        defaultValue={inputValues[record.id] || 0}
                        onPressEnter={() => handleButtonClick(record)}
                        onChange={(value) =>
                          handleInputChange(value, record.id)
                        }
                      />
                    )}
                  </Form.Item>
                  {inputValues[record.id] === 0 ||
                    (inputValues[record.id] && (
                      <Form.Item>
                        <Button
                          type="primary"
                          shape="round"
                          size="small"
                          children="Agregar"
                          icon={<IoBagAdd />}
                          disabled={
                            inputValues[record.id] === 0 ||
                            !inputValues[record.id]
                          }
                          onClick={() => handleButtonClick(record)}
                        />
                      </Form.Item>
                    ))}
                </Flex>
              </Form>
            );
          },
        },
      ]}
      dataSource={state.products.list}
    />
  );
};

export default ListProducts;
