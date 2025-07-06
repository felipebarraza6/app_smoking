/**
 * Hook personalizado para manejar órdenes.
 * Usa el nuevo servicio simplificado.
 */

import { useState, useEffect, useCallback } from "react";
import orderService from "../services/orders";

export const useOrders = (filters = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrders(filters);
      setOrders(data.results || data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const newOrder = await orderService.createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message);
      console.error("Error creating order:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (id, orderData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await orderService.updateOrder(id, orderData);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      setError(err.message);
      console.error("Error updating order:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await orderService.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting order:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeOrderStatus = useCallback(
    async (id, status) => {
      return updateOrder(id, { status });
    },
    [updateOrder]
  );

  const changePaymentStatus = useCallback(
    async (id, paymentStatus) => {
      return updateOrder(id, { payment_status: paymentStatus });
    },
    [updateOrder]
  );

  const completeOrder = useCallback(
    async (id) => {
      return changeOrderStatus(id, "COMPLETED");
    },
    [changeOrderStatus]
  );

  const cancelOrder = useCallback(
    async (id) => {
      return changeOrderStatus(id, "CANCELLED");
    },
    [changeOrderStatus]
  );

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    changeOrderStatus,
    changePaymentStatus,
    completeOrder,
    cancelOrder,
  };
};

export const useSales = (filters = {}) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await orderService.getSales(filters);
      setSales(data.results || data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    loading,
    error,
    refetch: fetchSales,
  };
};

export const useOrderStats = (filters = {}) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrderStats(filters);
      setStats(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order stats:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
