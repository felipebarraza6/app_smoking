import { useState, useEffect } from "react";
import dayjs from "dayjs";
import useBranches from "../../../hooks/useBranches";

// Función para obtener el rango del último mes completo
const getLastMonthRange = () => {
  const start = dayjs().subtract(1, "month").startOf("month");
  const end = dayjs().subtract(1, "month").endOf("month");
  return [start, end];
};

export const useDashboardFilters = () => {
  const { branches } = useBranches();
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    if (branches) {
      setFilters({
        branch_ids: branches.map((b) => b.id),
        dates: getLastMonthRange(),
      });
    }
  }, [branches]);

  return {
    branches: branches || [],
    filters,
    setFilters,
  };
};
