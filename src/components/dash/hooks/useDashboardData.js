import { useState, useCallback, useEffect, useMemo } from "react";
import dashboardEndpoints from "../../../api/endpoints/dashboard";
import dayjs from "dayjs";

export const useDashboardData = (filters) => {
  const [data, setData] = useState({
    summary_by_branch: [],
    total_summary: {},
  });
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [prevFilters, setPrevFilters] = useState(null);

  // Memorizar si los filtros están completos para evitar checks constantes
  const filtersReady = useMemo(() => {
    return (
      filters &&
      Array.isArray(filters.branch_ids) &&
      filters.branch_ids.length > 0 &&
      filters.dates &&
      filters.dates.length === 2 &&
      filters.dates[0] &&
      filters.dates[1]
    );
  }, [filters]);

  const fetchDashboardData = useCallback(async () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 fetchDashboardData called:", { filtersReady, loading });
    }

    // Solo hacer fetch si los filtros están completos
    if (!filtersReady) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Filters not ready");
      }
      // NO limpiar datos aquí - mantener los datos previos
      setLoading(false);
      return;
    }

    // Verificar si los filtros realmente cambiaron
    const filtersString = JSON.stringify(filters);
    const prevFiltersString = JSON.stringify(prevFilters);

    if (filtersString === prevFiltersString) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Filters unchanged, skipping fetch");
      }
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Starting fetch...");
    }
    setLoading(true);
    setPrevFilters(filters);

    try {
      const params = {
        branch_ids: filters.branch_ids.join(","),
        start_date: filters.dates[0].format("YYYY-MM-DD"),
        end_date: filters.dates[1].format("YYYY-MM-DD"),
      };
      const response = await dashboardEndpoints.getDashboardData(params);
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Data fetched successfully");
      }
      setData(response.data);
      setInitialLoad(false);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      // En caso de error, mantener datos previos en lugar de limpiar
    } finally {
      setLoading(false);
    }
  }, [filtersReady, filters]);

  useEffect(() => {
    // Debounce de 300ms para evitar llamadas excesivas
    const timeoutId = setTimeout(() => {
      fetchDashboardData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchDashboardData]);

  return {
    summary: data.summary_by_branch,
    totalSummary: data.total_summary,
    loading,
    initialLoad,
    fetchSummary: fetchDashboardData,
  };
};
