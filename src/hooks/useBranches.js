import { useState, useEffect, useCallback, useMemo } from "react";
import { useContext } from "react";
import { AppContext } from "../App";
import api from "../api/endpoints";

/**
 * Hook mejorado para manejo de sucursales con patrón DRY
 * Proporciona funcionalidades avanzadas para filtrado, búsqueda y gestión de sucursales
 */
const useBranches = (options = {}) => {
  const {
    autoFetch = true,
    includeAllOption = true,
    showRoles = true,
    filterByRole = null,
    cacheTime = 5 * 60 * 1000, // 5 minutos
    onError = null,
    onSuccess = null,
  } = options;

  const { state: appState } = useContext(AppContext);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar si los datos están en caché
  const isDataStale = useMemo(() => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > cacheTime;
  }, [lastFetch, cacheTime]);

  // Función para obtener sucursales del contexto global si están disponibles
  const getBranchesFromContext = useCallback(() => {
    if (appState?.branches && Array.isArray(appState.branches)) {
      return appState.branches.map((branchAccess) => ({
        id: branchAccess.branch?.id || branchAccess.id,
        business_name:
          branchAccess.branch?.business_name || branchAccess.business_name,
        commercial_business:
          branchAccess.branch?.commercial_business ||
          branchAccess.commercial_business,
        role: branchAccess.role,
        is_all_option: false,
      }));
    }
    return [];
  }, [appState?.branches]);

  // Función principal para obtener sucursales
  const fetchBranches = useCallback(
    async (force = false) => {
      // Si no necesitamos forzar y tenemos datos frescos, usar caché
      if (!force && !isDataStale && branches.length > 0) {
        return branches;
      }

      try {
        setLoading(true);
        setError(null);

        // Intentar obtener del contexto primero
        const contextBranches = getBranchesFromContext();
        if (contextBranches.length > 0 && !force) {
          const processedBranches = processBranches(contextBranches);
          setBranches(processedBranches);
          setLastFetch(Date.now());
          setLoading(false);
          if (onSuccess) onSuccess(processedBranches);
          return processedBranches;
        }

        // Si no hay datos en contexto, hacer llamada a API
        const response = await api.branchs.my_branches();
        const apiBranches = response.data || [];

        const processedBranches = processBranches(apiBranches);
        setBranches(processedBranches);
        setLastFetch(Date.now());
        setLoading(false);

        if (onSuccess) onSuccess(processedBranches);
        return processedBranches;
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError(err);
        setBranches([]);
        setLoading(false);
        if (onError) onError(err);
        return [];
      }
    },
    [isDataStale, branches.length, getBranchesFromContext, onSuccess, onError]
  );

  // Procesar sucursales con filtros y opciones
  const processBranches = useCallback(
    (rawBranches) => {
      let processed = [...rawBranches];

      // Filtrar por rol si se especifica
      if (filterByRole) {
        processed = processed.filter((branch) => branch.role === filterByRole);
      }

      // Agregar opción "Todas" si se solicita
      if (includeAllOption && !processed.find((b) => b.is_all_option)) {
        processed.unshift({
          id: "all",
          business_name: "Todas mis sucursales",
          commercial_business: "Ver todas las sucursales",
          is_all_option: true,
          role: null,
        });
      }

      return processed;
    },
    [includeAllOption, filterByRole]
  );

  // Filtrar sucursales por término de búsqueda
  const filteredBranches = useMemo(() => {
    if (!searchTerm) return branches;

    return branches.filter(
      (branch) =>
        branch.business_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        branch.commercial_business
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [branches, searchTerm]);

  // Obtener sucursal por ID
  const getBranchById = useCallback(
    (branchId) => {
      if (branchId === "all") {
        return {
          id: "all",
          business_name: "Todas mis sucursales",
          is_all_option: true,
        };
      }
      return branches.find((branch) => branch.id === branchId);
    },
    [branches]
  );

  // Obtener IDs de sucursales (excluyendo "Todas")
  const getBranchIds = useCallback(() => {
    return branches
      .filter((branch) => !branch.is_all_option)
      .map((branch) => branch.id);
  }, [branches]);

  // Verificar si es "Todas las sucursales"
  const isAllBranches = useCallback((branchId) => {
    return branchId === "all";
  }, []);

  // Obtener sucursales por rol
  const getBranchesByRole = useCallback(
    (role) => {
      return branches.filter((branch) => branch.role === role);
    },
    [branches]
  );

  // Obtener estadísticas de sucursales
  const getBranchStats = useCallback(() => {
    const stats = {
      total: branches.length,
      byRole: {},
      hasAllOption: branches.some((b) => b.is_all_option),
    };

    branches.forEach((branch) => {
      if (branch.role) {
        stats.byRole[branch.role] = (stats.byRole[branch.role] || 0) + 1;
      }
    });

    return stats;
  }, [branches]);

  // Función para buscar sucursales
  const searchBranches = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    return fetchBranches(true);
  }, [fetchBranches]);

  // Función para limpiar búsqueda
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Cargar datos automáticamente si está habilitado
  useEffect(() => {
    if (autoFetch) {
      fetchBranches();
    }
  }, [autoFetch, fetchBranches]);

  // Sincronizar con contexto global cuando cambie
  useEffect(() => {
    if (appState?.branches && !isDataStale) {
      const contextBranches = getBranchesFromContext();
      if (contextBranches.length > 0) {
        const processedBranches = processBranches(contextBranches);
        setBranches(processedBranches);
      }
    }
  }, [
    appState?.branches,
    isDataStale,
    getBranchesFromContext,
    processBranches,
  ]);

  return {
    // Estado
    branches: filteredBranches,
    allBranches: branches,
    loading,
    error,
    searchTerm,

    // Funciones principales
    fetchBranches,
    refresh,
    searchBranches,
    clearSearch,

    // Utilidades
    getBranchById,
    getBranchIds,
    isAllBranches,
    getBranchesByRole,
    getBranchStats,

    // Opciones
    showRoles,
    includeAllOption,

    // Estado de caché
    isDataStale,
    lastFetch,
  };
};

export default useBranches;
