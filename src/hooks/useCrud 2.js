import { useState, useCallback } from "react";

/**
 * Hook genérico para operaciones CRUD
 * Reutilizable para cualquier entidad (drivers, clients, products, etc.)
 */
export const useCrud = (apiFunctions, entityName = "item") => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    results: [],
    count: 0,
    page: 1,
  });
  const [filters, setFilters] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

  // Cargar datos
  const loadData = useCallback(
    async (page = 1, currentFilters = filters) => {
      if (!apiFunctions.list) {

        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiFunctions.list(page, currentFilters);

        setData({
          results: response?.results || response?.data || [],
          count: response?.count || 0,
          page: page,
        });
      } catch (err) {

        setError(`Error al cargar los ${entityName}`);
        setData({
          results: [],
          count: 0,
          page: page,
        });
      } finally {
        setLoading(false);
      }
    },
    [apiFunctions, filters, entityName]
  );

  // Crear item
  const createItem = useCallback(
    async (values, form) => {
      if (!apiFunctions.create) {

        return { success: false, message: "Función de creación no disponible" };
      }

      setLoading(true);
      setError(null);

      try {
        await apiFunctions.create(values);
        await loadData(data.page, filters);
        form?.resetFields();
        return { success: true, message: `${entityName} creado correctamente` };
      } catch (err) {

        const errors = err.response?.data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);
        const errorMessage = errorList.join(", ") || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: `Errores al crear el ${entityName}`,
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunctions, data.page, filters, loadData, entityName]
  );

  // Actualizar item
  const updateItem = useCallback(
    async (values, form) => {
      if (!apiFunctions.update) {

        return {
          success: false,
          message: "Función de actualización no disponible",
        };
      }

      if (!selectedItem?.id) {
        setError(`ID del ${entityName} no encontrado`);
        return {
          success: false,
          message: `ID del ${entityName} no encontrado`,
        };
      }

      setLoading(true);
      setError(null);

      try {
        await apiFunctions.update(selectedItem.id, values);
        await loadData(data.page, filters);
        setSelectedItem(null);
        form?.resetFields();
        return {
          success: true,
          message: `${entityName} actualizado correctamente`,
        };
      } catch (err) {

        const errors = err.response?.data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);
        const errorMessage =
          errorList.join(", ") || err.message || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: `Errores al actualizar el ${entityName}`,
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunctions, selectedItem, data.page, filters, loadData, entityName]
  );

  // Eliminar item
  const deleteItem = useCallback(
    async (item) => {
      if (!apiFunctions.destroy) {

        return {
          success: false,
          message: "Función de eliminación no disponible",
        };
      }

      if (!item?.id) {
        setError(`ID del ${entityName} no encontrado`);
        return {
          success: false,
          message: `ID del ${entityName} no encontrado`,
        };
      }

      setLoading(true);
      setError(null);

      try {
        await apiFunctions.destroy(item.id);
        await loadData(1, filters); // Volver a página 1
        return {
          success: true,
          message: `${entityName} eliminado correctamente`,
        };
      } catch (err) {

        const errorMessage =
          err.response?.data?.detail || err.message || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: `Error al eliminar el ${entityName}`,
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [apiFunctions, filters, loadData, entityName]
  );

  // Cambiar página
  const changePage = useCallback(
    (page) => {
      loadData(page, filters);
    },
    [loadData, filters]
  );

  // Cambiar filtros
  const changeFilters = useCallback(
    (newFilters) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      loadData(1, updatedFilters); // Resetear a página 1
    },
    [filters, loadData]
  );

  // Resetear filtros
  const resetFilters = useCallback(() => {
    const defaultFilters = {};
    setFilters(defaultFilters);
    loadData(1, defaultFilters);
  }, [loadData]);

  // Seleccionar item para editar
  const selectItemForEdit = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    data,
    filters,
    selectedItem,
    loading,
    error,

    // Acciones
    loadData,
    createItem,
    updateItem,
    deleteItem,
    changePage,
    changeFilters,
    resetFilters,
    selectItemForEdit,
    clearSelection,
    clearError,
  };
};

export default useCrud;
