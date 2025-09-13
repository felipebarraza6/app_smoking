import { useState, useCallback, useEffect, useContext } from "react";
import { list, create, update, destroy } from "../api/endpoints/drivers";
import { AppContext } from "../App";

/**
 * Hook personalizado para gestión de drivers
 * Incluye filtrado por sucursales del usuario y todas las funcionalidades CRUD
 */
export const useDrivers = () => {
  const { state: appState } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userBranches, setUserBranches] = useState([]);

  // Estado para drivers
  const [drivers, setDrivers] = useState({
    results: [],
    count: 0,
    page: 1,
  });

  // Estado para filtros - por defecto filtrar por primera sucursal del usuario
  const [filters, setFilters] = useState({
    name: null,
    branch: null, // Se establecerá automáticamente cuando se carguen las sucursales
    vehicle_plate: null,
    is_available: null, // Nuevo filtro para disponibilidad
  });

  // Estado para edición
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Cargar drivers y sucursales del usuario
  const loadDrivers = useCallback(
    async (page = 1, currentFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        console.log("🚚 Loading drivers with filters:", currentFilters);
        const response = await list(page, currentFilters);
        console.log("🚚 API Response:", response);

        // La API devuelve user_branches en la respuesta
        if (response?.user_branches) {
          setUserBranches(response.user_branches);
          console.log("🚚 User branches set:", response.user_branches);
        }

        const driversData = {
          results: response?.results || response?.data || [],
          count: response?.count || 0,
          page: page,
        };
        console.log("🚚 Setting drivers data:", driversData);
        setDrivers(driversData);
      } catch (err) {
        console.error("Error loading drivers:", err);
        setError("Error al cargar los repartidores");
        setDrivers({
          results: [],
          count: 0,
          page: page,
        });
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Crear driver
  const createDriver = useCallback(
    async (values, form) => {
      setLoading(true);
      setError(null);

      try {
        await create(values);
        await loadDrivers(drivers.page, filters);
        form?.resetFields();
        return { success: true, message: "Repartidor creado correctamente" };
      } catch (err) {
        const errors = err.response?.data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);
        const errorMessage = errorList.join(", ") || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: "Errores al crear el repartidor",
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [drivers.page, filters, loadDrivers]
  );

  // Actualizar driver
  const updateDriver = useCallback(
    async (values, form) => {
      if (!selectedDriver?.id) {
        setError("ID del repartidor no encontrado");
        return { success: false, message: "ID del repartidor no encontrado" };
      }

      setLoading(true);
      setError(null);

      try {
        await update(selectedDriver.id, values);
        await loadDrivers(drivers.page, filters);
        setSelectedDriver(null);
        form?.resetFields();
        return {
          success: true,
          message: "Repartidor actualizado correctamente",
        };
      } catch (err) {
        const errors = err.response?.data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);
        const errorMessage =
          errorList.join(", ") || err.message || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: "Errores al actualizar el repartidor",
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [selectedDriver, drivers.page, filters, loadDrivers]
  );

  // Eliminar driver
  const deleteDriver = useCallback(
    async (driver) => {
      if (!driver?.id) {
        setError("ID del repartidor no encontrado");
        return { success: false, message: "ID del repartidor no encontrado" };
      }

      setLoading(true);
      setError(null);

      try {
        await destroy(driver.id);
        await loadDrivers(1, filters); // Volver a página 1
        return { success: true, message: "Repartidor eliminado correctamente" };
      } catch (err) {
        const errorMessage =
          err.response?.data?.detail || err.message || "Error desconocido";
        setError(errorMessage);
        return {
          success: false,
          message: "Error al eliminar el repartidor",
          details: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [filters, loadDrivers]
  );

  // Cambiar página
  const changePage = useCallback(
    (page) => {
      loadDrivers(page, filters);
    },
    [loadDrivers, filters]
  );

  // Cambiar filtros
  const changeFilters = useCallback(
    (newFilters) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      loadDrivers(1, updatedFilters); // Resetear a página 1
    },
    [filters, loadDrivers]
  );

  // Resetear filtros
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      name: null,
      branch: null,
      vehicle_plate: null,
      is_available: null,
    };
    setFilters(defaultFilters);
    loadDrivers(1, defaultFilters);
  }, [loadDrivers]);

  // Seleccionar driver para editar
  const selectDriverForEdit = useCallback((driver) => {
    setSelectedDriver(driver);
  }, []);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedDriver(null);
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    console.log("🚚 useEffect triggered - appState.isAuth:", appState.isAuth);
    if (appState.isAuth) {
      console.log("🚚 User is authenticated, loading drivers...");
      loadDrivers(1, filters);
    } else {
      console.log("🚚 User is not authenticated, skipping load");
    }
  }, [appState.isAuth, loadDrivers, filters]);

  // Opciones de sucursales para filtros
  const branchOptions = userBranches.map((branch) => ({
    value: branch.id,
    label: branch.business_name,
  }));

  return {
    // Estado
    drivers,
    filters,
    selectedDriver,
    loading,
    error,
    userBranches,
    branchOptions,

    // Acciones
    loadDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    changePage,
    changeFilters,
    resetFilters,
    selectDriverForEdit,
    clearSelection,
    clearError,
  };
};

export default useDrivers;
