/**
 * Hook personalizado para manejar el dashboard.
 * Usa el nuevo servicio simplificado del backend.
 */

import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/dashboard";

export const useDashboard = (filters = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const summary = await dashboardService.getCompleteSummary(filters);
      setData(summary);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
};

export const useSalesMetrics = (filters = {}) => {
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getSalesStats(filters);
      setSales(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching sales metrics:", err);
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

export const useOrdersMetrics = (filters = {}) => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getOrdersStats(filters);
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders metrics:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
};

export const useProductHighlights = (filters = {}) => {
  const [products, setProducts] = useState({
    best_selling: [],
    most_profitable: [],
    least_selling: [],
    least_profitable: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getProductHighlights(filters);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching product highlights:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

export const useTimeSeries = (filters = {}) => {
  const [timeSeries, setTimeSeries] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeSeries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getTimeSeries(filters);
      const chart = await dashboardService.getTimeSeriesChartData(filters);

      setTimeSeries(data);
      setChartData(chart);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching time series:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTimeSeries();
  }, [fetchTimeSeries]);

  return {
    timeSeries,
    chartData,
    loading,
    error,
    refetch: fetchTimeSeries,
  };
};

export const usePaymentsByType = (filters = {}) => {
  const [payments, setPayments] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getPaymentsByType(filters);
      const chart = await dashboardService.getPaymentsChartData(filters);

      setPayments(data);
      setChartData(chart);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching payments by type:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    chartData,
    loading,
    error,
    refetch: fetchPayments,
  };
};

export const useDashboardSummary = (filters = {}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getSummary(filters);
      setSummary(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard summary:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
  };
};
