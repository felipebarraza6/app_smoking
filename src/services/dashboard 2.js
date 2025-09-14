/**
 * Servicio especializado para dashboard.
 * Usa el nuevo servicio simplificado del backend.
 */

import apiService from "./api";

class DashboardService {
  /**
   * Obtener resumen completo del dashboard.
   * @param {Object} filters - Filtros para el dashboard
   * @returns {Promise} - Resumen completo del dashboard
   */
  async getSummary(filters = {}) {
    return apiService.get("/core/dashboard/summary/", filters);
  }

  /**
   * Obtener métricas de ventas.
   * @param {Object} filters - Filtros para ventas
   * @returns {Promise} - Métricas de ventas
   */
  async getSalesMetrics(filters = {}) {
    const data = await this.getSummary(filters);
    return (
      data.sales || { count: 0, total_amount: 0, profit: 0, paid_amount: 0 }
    );
  }

  /**
   * Obtener métricas de pedidos.
   * @param {Object} filters - Filtros para pedidos
   * @returns {Promise} - Métricas de pedidos
   */
  async getOrdersMetrics(filters = {}) {
    const data = await this.getSummary(filters);
    return (
      data.orders || {
        count: 0,
        completed: 0,
        in_progress: 0,
        cancelled: 0,
        total_amount: 0,
        profit: 0,
      }
    );
  }

  /**
   * Obtener productos destacados.
   * @param {Object} filters - Filtros para productos
   * @returns {Promise} - Productos destacados
   */
  async getProductHighlights(filters = {}) {
    const data = await this.getSummary(filters);
    return (
      data.products || {
        best_selling: [],
        most_profitable: [],
        least_selling: [],
        least_profitable: [],
      }
    );
  }

  /**
   * Obtener series de tiempo.
   * @param {Object} filters - Filtros para series de tiempo
   * @returns {Promise} - Series de tiempo
   */
  async getTimeSeries(filters = {}) {
    const data = await this.getSummary(filters);
    return data.time_series || [];
  }

  /**
   * Obtener pagos por tipo.
   * @param {Object} filters - Filtros para pagos
   * @returns {Promise} - Pagos por tipo
   */
  async getPaymentsByType(filters = {}) {
    const data = await this.getSummary(filters);
    return data.payments || [];
  }

  /**
   * Obtener métricas específicas de ventas.
   * @param {Object} filters - Filtros para ventas
   * @returns {Promise} - Métricas específicas
   */
  async getSalesStats(filters = {}) {
    const sales = await this.getSalesMetrics(filters);

    return {
      totalSales: sales.count || 0,
      totalAmount: sales.total_amount || 0,
      totalProfit: sales.profit || 0,
      paidAmount: sales.paid_amount || 0,
      averageAmount: sales.count > 0 ? sales.total_amount / sales.count : 0,
      averageProfit: sales.count > 0 ? sales.profit / sales.count : 0,
    };
  }

  /**
   * Obtener métricas específicas de pedidos.
   * @param {Object} filters - Filtros para pedidos
   * @returns {Promise} - Métricas específicas
   */
  async getOrdersStats(filters = {}) {
    const orders = await this.getOrdersMetrics(filters);

    return {
      totalOrders: orders.count || 0,
      completedOrders: orders.completed || 0,
      inProgressOrders: orders.in_progress || 0,
      cancelledOrders: orders.cancelled || 0,
      totalAmount: orders.total_amount || 0,
      totalProfit: orders.profit || 0,
      completionRate:
        orders.count > 0 ? (orders.completed / orders.count) * 100 : 0,
      cancellationRate:
        orders.count > 0 ? (orders.cancelled / orders.count) * 100 : 0,
      averageAmount: orders.count > 0 ? orders.total_amount / orders.count : 0,
    };
  }

  /**
   * Obtener productos más vendidos.
   * @param {Object} filters - Filtros para productos
   * @returns {Promise} - Productos más vendidos
   */
  async getBestSellingProducts(filters = {}) {
    const products = await this.getProductHighlights(filters);
    return products.best_selling || [];
  }

  /**
   * Obtener productos más rentables.
   * @param {Object} filters - Filtros para productos
   * @returns {Promise} - Productos más rentables
   */
  async getMostProfitableProducts(filters = {}) {
    const products = await this.getProductHighlights(filters);
    return products.most_profitable || [];
  }

  /**
   * Obtener productos menos vendidos.
   * @param {Object} filters - Filtros para productos
   * @returns {Promise} - Productos menos vendidos
   */
  async getLeastSellingProducts(filters = {}) {
    const products = await this.getProductHighlights(filters);
    return products.least_selling || [];
  }

  /**
   * Obtener productos menos rentables.
   * @param {Object} filters - Filtros para productos
   * @returns {Promise} - Productos menos rentables
   */
  async getLeastProfitableProducts(filters = {}) {
    const products = await this.getProductHighlights(filters);
    return products.least_profitable || [];
  }

  /**
   * Obtener resumen completo con todas las métricas.
   * @param {Object} filters - Filtros para el dashboard
   * @returns {Promise} - Resumen completo
   */
  async getCompleteSummary(filters = {}) {
    try {
      const [summary, salesStats, ordersStats, products, timeSeries, payments] =
        await Promise.all([
          this.getSummary(filters),
          this.getSalesStats(filters),
          this.getOrdersStats(filters),
          this.getProductHighlights(filters),
          this.getTimeSeries(filters),
          this.getPaymentsByType(filters),
        ]);

      return {
        summary,
        salesStats,
        ordersStats,
        products,
        timeSeries,
        payments,
        totalRevenue: salesStats.totalAmount + ordersStats.totalAmount,
        totalProfit: salesStats.totalProfit + ordersStats.totalProfit,
        totalTransactions: salesStats.totalSales + ordersStats.totalOrders,
      };
    } catch (error) {
      console.error("Error obteniendo resumen completo del dashboard:", error);
      return this._getEmptyCompleteSummary();
    }
  }

  /**
   * Obtener resumen vacío en caso de error.
   * @returns {Object} - Resumen vacío
   */
  _getEmptyCompleteSummary() {
    return {
      summary: {},
      salesStats: {
        totalSales: 0,
        totalAmount: 0,
        totalProfit: 0,
        paidAmount: 0,
        averageAmount: 0,
        averageProfit: 0,
      },
      ordersStats: {
        totalOrders: 0,
        completedOrders: 0,
        inProgressOrders: 0,
        cancelledOrders: 0,
        totalAmount: 0,
        totalProfit: 0,
        completionRate: 0,
        cancellationRate: 0,
        averageAmount: 0,
      },
      products: {
        best_selling: [],
        most_profitable: [],
        least_selling: [],
        least_profitable: [],
      },
      timeSeries: [],
      payments: [],
      totalRevenue: 0,
      totalProfit: 0,
      totalTransactions: 0,
    };
  }

  /**
   * Obtener datos para gráficos de series de tiempo.
   * @param {Object} filters - Filtros para series de tiempo
   * @returns {Promise} - Datos formateados para gráficos
   */
  async getTimeSeriesChartData(filters = {}) {
    const timeSeries = await this.getTimeSeries(filters);

    return {
      labels: timeSeries.map((item) => item.date),
      datasets: [
        {
          label: "Ventas",
          data: timeSeries.map((item) => item.sales || 0),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
        },
        {
          label: "Pedidos",
          data: timeSeries.map((item) => item.orders || 0),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };
  }

  /**
   * Obtener datos para gráficos de pagos.
   * @param {Object} filters - Filtros para pagos
   * @returns {Promise} - Datos formateados para gráficos
   */
  async getPaymentsChartData(filters = {}) {
    const payments = await this.getPaymentsByType(filters);

    return {
      labels: payments.map((item) => item.type_payment__name || "Sin tipo"),
      datasets: [
        {
          data: payments.map((item) => item.total || 0),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  }
}

// Instancia singleton del servicio
const dashboardService = new DashboardService();

export default dashboardService;
