/**
 * Servicio especializado para órdenes.
 * Extiende el servicio base de API.
 */

import apiService from "./api";

class OrderService {
  /**
   * Obtener todas las órdenes con filtros opcionales.
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise} - Lista de órdenes
   */
  async getOrders(filters = {}) {
    return apiService.get("/core/orders/", filters);
  }

  /**
   * Obtener una orden específica por ID.
   * @param {string} id - ID de la orden
   * @returns {Promise} - Datos de la orden
   */
  async getOrder(id) {
    return apiService.get(`/core/orders/${id}/`);
  }

  /**
   * Crear una nueva orden.
   * @param {Object} data - Datos de la orden
   * @returns {Promise} - Orden creada
   */
  async createOrder(data) {
    return apiService.post("/core/orders/", data);
  }

  /**
   * Actualizar una orden existente.
   * @param {string} id - ID de la orden
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} - Orden actualizada
   */
  async updateOrder(id, data) {
    return apiService.patch(`/core/orders/${id}/`, data);
  }

  /**
   * Eliminar una orden.
   * @param {string} id - ID de la orden
   * @returns {Promise} - Respuesta de eliminación
   */
  async deleteOrder(id) {
    return apiService.delete(`/core/orders/${id}/`);
  }

  /**
   * Obtener solo ventas.
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} - Lista de ventas
   */
  async getSales(filters = {}) {
    return apiService.get("/core/orders/sales/", filters);
  }

  /**
   * Obtener solo pedidos.
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} - Lista de pedidos
   */
  async getOrders(filters = {}) {
    return apiService.get("/core/orders/orders/", filters);
  }

  /**
   * Obtener datos para dashboard.
   * @param {Object} filters - Filtros para dashboard
   * @returns {Promise} - Datos optimizados para dashboard
   */
  async getDashboardData(filters = {}) {
    return apiService.get("/core/orders/dashboard/", filters);
  }

  /**
   * Exportar órdenes a Excel.
   * @param {Object} filters - Filtros para exportación
   * @returns {Promise} - Archivo Excel
   */
  async exportOrders(filters = {}) {
    return apiService.get("/core/orders/export/", filters);
  }

  /**
   * Obtener productos de una orden.
   * @param {string} orderId - ID de la orden
   * @returns {Promise} - Lista de productos
   */
  async getOrderProducts(orderId) {
    return apiService.get(`/core/register-order-products/`, { order: orderId });
  }

  /**
   * Agregar producto a una orden.
   * @param {Object} data - Datos del producto
   * @returns {Promise} - Producto agregado
   */
  async addOrderProduct(data) {
    return apiService.post("/core/register-order-products/", data);
  }

  /**
   * Actualizar producto de una orden.
   * @param {string} id - ID del producto de orden
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} - Producto actualizado
   */
  async updateOrderProduct(id, data) {
    return apiService.patch(`/core/register-order-products/${id}/`, data);
  }

  /**
   * Eliminar producto de una orden.
   * @param {string} id - ID del producto de orden
   * @returns {Promise} - Respuesta de eliminación
   */
  async deleteOrderProduct(id) {
    return apiService.delete(`/core/register-order-products/${id}/`);
  }

  /**
   * Cambiar estado de una orden.
   * @param {string} id - ID de la orden
   * @param {string} status - Nuevo estado
   * @returns {Promise} - Orden actualizada
   */
  async changeOrderStatus(id, status) {
    return this.updateOrder(id, { status });
  }

  /**
   * Cambiar estado de pago de una orden.
   * @param {string} id - ID de la orden
   * @param {string} paymentStatus - Nuevo estado de pago
   * @returns {Promise} - Orden actualizada
   */
  async changePaymentStatus(id, paymentStatus) {
    return this.updateOrder(id, { payment_status: paymentStatus });
  }

  /**
   * Marcar orden como completada.
   * @param {string} id - ID de la orden
   * @returns {Promise} - Orden actualizada
   */
  async completeOrder(id) {
    return this.changeOrderStatus(id, "COMPLETED");
  }

  /**
   * Cancelar una orden.
   * @param {string} id - ID de la orden
   * @returns {Promise} - Orden actualizada
   */
  async cancelOrder(id) {
    return this.changeOrderStatus(id, "CANCELLED");
  }

  /**
   * Obtener estadísticas de órdenes.
   * @param {Object} filters - Filtros para estadísticas
   * @returns {Promise} - Estadísticas de órdenes
   */
  async getOrderStats(filters = {}) {
    const orders = await this.getOrders(filters);

    const stats = {
      total: orders.length,
      sales: orders.filter((order) => order.order_type === "SALE").length,
      orders: orders.filter((order) => order.order_type === "ORDER").length,
      completed: orders.filter((order) => order.status === "COMPLETED").length,
      cancelled: orders.filter((order) => order.status === "CANCELLED").length,
      pending: orders.filter((order) => order.status === "PENDING").length,
      inProgress: orders.filter((order) => order.status === "IN_PROGRESS")
        .length,
      totalAmount: orders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      ),
      totalCost: orders.reduce(
        (sum, order) => sum + (order.total_cost || 0),
        0
      ),
    };

    stats.profit = stats.totalAmount - stats.totalCost;

    return stats;
  }
}

// Instancia singleton del servicio
const orderService = new OrderService();

export default orderService;
