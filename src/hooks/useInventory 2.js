/**
 * Hook para gestión de inventario en el frontend
 * Proporciona funciones para validar stock y consultar movimientos
 */

import { useState, useCallback } from "react";
import InventoryService from "../services/inventory";

export const useInventory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validar disponibilidad de inventario para una orden
   */
  const validateOrderInventory = useCallback(
    async (orderData, productsData) => {
      setLoading(true);
      setError(null);

      try {
        const result = await InventoryService.validateOrderInventory(
          orderData,
          productsData
        );

        if (!result.success) {
          setError(result.error);
          return { success: false, error: result.error };
        }

        return { success: true, data: result.data };
      } catch (err) {
        const errorMessage = "Error inesperado validando inventario";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Validar disponibilidad de un producto específico
   */
  const validateProductAvailability = useCallback(
    async (productId, quantity) => {
      setLoading(true);
      setError(null);

      try {
        const result = await InventoryService.validateProductAvailability(
          productId,
          quantity
        );

        if (!result.success) {
          setError(result.error);
          return { success: false, error: result.error };
        }

        return { success: true, data: result.data };
      } catch (err) {
        const errorMessage = "Error inesperado validando disponibilidad";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obtener resumen de inventario para una orden
   */
  const getOrderInventorySummary = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await InventoryService.getOrderInventorySummary(orderId);

      if (!result.success) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = "Error obteniendo resumen de inventario";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener historial de inventario para un producto
   */
  const getProductInventoryHistory = useCallback(
    async (productId, days = 30) => {
      setLoading(true);
      setError(null);

      try {
        const result = await InventoryService.getProductInventoryHistory(
          productId,
          days
        );

        if (!result.success) {
          setError(result.error);
          return { success: false, error: result.error };
        }

        return { success: true, data: result.data };
      } catch (err) {
        const errorMessage = "Error obteniendo historial de producto";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Obtener productos con bajo stock
   */
  const getLowStockProducts = useCallback(async (threshold = 10) => {
    setLoading(true);
    setError(null);

    try {
      const result = await InventoryService.getLowStockProducts(threshold);

      if (!result.success) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = "Error obteniendo productos con bajo stock";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener estadísticas de inventario
   */
  const getInventoryStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await InventoryService.getInventoryStats();

      if (!result.success) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = "Error obteniendo estadísticas de inventario";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear ajuste manual de inventario
   */
  const createManualAdjustment = useCallback(async (adjustmentData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await InventoryService.createManualAdjustment(
        adjustmentData
      );

      if (!result.success) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = "Error creando ajuste manual";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    validateOrderInventory,
    validateProductAvailability,
    getOrderInventorySummary,
    getProductInventoryHistory,
    getLowStockProducts,
    getInventoryStats,
    createManualAdjustment,
    clearError,
  };
};

export default useInventory;
