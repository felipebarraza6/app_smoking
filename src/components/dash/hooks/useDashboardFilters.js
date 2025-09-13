import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import useBranches from "../../../hooks/useBranches";

// Función para obtener el rango del último mes completo
const getLastMonthRange = () => {
  const start = dayjs().subtract(1, "month").startOf("month");
  const end = dayjs().subtract(1, "month").endOf("month");
  return [start, end];
};

export const useDashboardFilters = () => {
  const { branches, loading: branchesLoading } = useBranches();
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    if (branches && branches.length > 0 && !filters) {
      // Solo inicializar si no hay filtros previos
      setFilters({
        branch_ids: branches.map((b) => b.id),
        dates: getLastMonthRange(),
      });
    }
  }, [branches, filters]);

  // Memorizamos setFilters para evitar re-renders innecesarios
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    branches: branches || [],
    filters,
    setFilters: updateFilters,
    loading: branchesLoading,
  };
};
