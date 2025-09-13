import React, { useEffect, useState } from "react";
import AnimatedContainer from "../../../containers/AnimatedContainer";
import { Table, Flex, App } from "antd";
import api from "../../../api/endpoints";
import { columns as getColumns } from "./columns_orders";
import FilterOrder from "./components/FilterOrder";
import RenderColumn from "./renderColumn";
import ReceiptModal from "../Create/add_payments/ReceiptModal";

const initialFilter = {
  branch: null,
  startDate: null,
  endDate: null,
  status: "all",
  delivery: "all",
};

const ListSalesManagement = () => {
  const [orders, setOrders] = useState([]);
  const app = App.useApp();
  const [update, setUpdate] = useState(0);
  const { message, modal, notification } = app;
  const [filter, setFilter] = useState(initialFilter);

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Estado para el modal de boleta
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowReceipt = (order) => {
    setSelectedOrder(order);
    setReceiptModalVisible(true);
  };

  const columns = getColumns(
    message,
    modal,
    notification,
    app,
    setUpdate,
    update,
    handleShowReceipt
  );

  const buildQuery = () => {
    const params = [];
    params.push("is_sale=true");
    params.push("is_active=true");
    if (
      filter.branch &&
      filter.branch !== "all" &&
      !Array.isArray(filter.branch)
    )
      params.push(`client__branch=${filter.branch}`);
    if (filter.startDate && filter.endDate) {
      params.push(`start_date=${filter.startDate}`);
      params.push(`end_date=${filter.endDate}`);
    }
    if (filter.status && filter.status !== "all") {
      if (filter.status === "active") {
        params.push("is_pay=true");
      } else if (filter.status === "inactive") {
        // pending payments: not paid and not canceled
        params.push("is_pay=false");
        params.push("is_null=false");
      }
    }
    if (filter.delivery && filter.delivery !== "all") {
      const del = filter.delivery === "active";
      params.push(`is_delivery=${del}`);
    }
    return params.join("&");
  };

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const query = buildQuery();
      const response = await api.orders.list(page, query);
      // Verificar que la respuesta tenga la estructura esperada
      const results = response?.results || response?.data || [];
      const count = response?.count || 0;

      setOrders(Array.isArray(results) ? results : []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: count,
      }));
    } catch (error) {
      setOrders([]);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, filter]);

  const handleTableChange = (pagination) => {
    fetchOrders(pagination.current);
  };

  const expandedRowRender = (record) => (
    <RenderColumn record={record} setUpdate={setUpdate} update={update} />
  );

  return (
    <AnimatedContainer>
      <Table
        bordered
        title={() => <FilterOrder filter={filter} setFilter={setFilter} />}
        dataSource={orders}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        rowKey="id"
        expandedRowRender={expandedRowRender}
        scroll={{ x: "max-content" }}
      />
      <ReceiptModal
        visible={receiptModalVisible}
        onClose={() => setReceiptModalVisible(false)}
        saleData={selectedOrder}
      />
    </AnimatedContainer>
  );
};

export default ListSalesManagement;
