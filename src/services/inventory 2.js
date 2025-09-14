/**
 * Servicio para gestión de inventario en el frontend
 * Maneja validaciones, consultas y reportes de inventario
 */

import api from "./api";

class InventoryService {
  /**
   * Validar disponibilidad de inventario para una orden
   * @param {Object} orderData - Datos de la orden
   * @param {Array} productsData - Array de productos con cantidades
   * @returns {Promise<Object>} Resultado de la validación
   */
  static async validateOrderInventory(orderData, productsData) {
    try {
      const response = await api.post("/orders/validate_inventory/", {
        order: orderData,
        products: productsData,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error validando inventario:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error validando inventario",
      };
    }
  }

  /**
   * Obtener resumen de inventario para una orden específica
   * @param {string} orderId - ID de la orden
   * @returns {Promise<Object>} Resumen de movimientos de inventario
   */
  static async getOrderInventorySummary(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/inventory_summary/`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error obteniendo resumen de inventario:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Error obteniendo resumen de inventario",
      };
    }
  }

  /**
   * Obtener historial de inventario para un producto
   * @param {string} productId - ID del producto
   * @param {number} days - Número de días hacia atrás (default: 30)
   * @returns {Promise<Object>} Historial del producto
   */
  static async getProductInventoryHistory(productId, days = 30) {
    try {
      const response = await api.get(
        `/products/${productId}/inventory_history/`,
        {
          params: { days },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error obteniendo historial de producto:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Error obteniendo historial de producto",
      };
    }
  }

  /**
   * Validar disponibilidad de un producto específico
   * @param {string} productId - ID del producto
   * @param {number} quantity - Cantidad requerida
   * @returns {Promise<Object>} Resultado de la validación
   */
  static async validateProductAvailability(productId, quantity) {
    try {
      const response = await api.post("/orders/validate_inventory/", {
        order: {},
        products: [{ product_id: productId, quantity }],
      });

      const validation = response.data.validation_results[0];

      return {
        success: true,
        data: {
          available: validation.sufficient,
          current_stock: validation.available,
          requested: validation.requested,
          shortage: validation.shortage,
          product_name: validation.product_name,
        },
      };
    } catch (error) {
      console.error("Error validando disponibilidad:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error validando disponibilidad",
      };
    }
  }

  /**
   * Obtener productos con bajo stock
   * @param {number} threshold - Umbral de stock bajo (default: 10)
   * @returns {Promise<Object>} Lista de productos con bajo stock
   */
  static async getLowStockProducts(threshold = 10) {
    try {
      const response = await api.get("/products/low_stock/", {
        params: { threshold },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error obteniendo productos con bajo stock:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Error obteniendo productos con bajo stock",
      };
    }
  }

  /**
   * Obtener reporte de movimientos de inventario
   * @param {Object} filters - Filtros para el reporte
   * @returns {Promise<Object>} Reporte de movimientos
   */
  static async getInventoryReport(filters = {}) {
    try {
      const response = await api.get("/inventory/report/", {
        params: filters,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error obteniendo reporte de inventario:", error);
      return {
        success: false,
        error:
          error.response?.data?.error ||
          "Error obteniendo reporte de inventario",
      };
    }
  }

  /**
   * Crear ajuste manual de inventario
   * @param {Object} adjustmentData - Datos del ajuste
   * @returns {Promise<Object>} Resultado del ajuste
   */
  static async createManualAdjustment(adjustmentData) {
    try {
      const response = await api.post(
        "/inventory/adjustments/",
        adjustmentData
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creando ajuste manual:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error creando ajuste manual",
      };
    }
  }

  /**
   * Obtener estadísticas de inventario
   * @returns {Promise<Object>} Estadísticas generales
   */
  static async getInventoryStats() {
    try {
      const response = await api.get("/inventory/stats/");

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error obteniendo estadísticas",
      };
    }
  }
}

export default InventoryService;
