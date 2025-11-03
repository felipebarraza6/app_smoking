import { useState, useCallback, useEffect } from "react";
import dashboardEndpoints from "../../../api/endpoints/dashboard";
import dayjs from "dayjs";

export const useDashboardData = (filters) => {
  const [data, setData] = useState({
    summary_by_branch: [],
    total_summary: {},
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!filters?.branch_ids || filters.branch_ids.length === 0) {
      setData({ summary_by_branch: [], total_summary: {} });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = {
        branch_ids: filters.branch_ids.join(","),
        start_date: filters.dates?.[0]?.format("YYYY-MM-DD"),
        end_date: filters.dates?.[1]?.format("YYYY-MM-DD"),
      };
      const response = await dashboardEndpoints.getDashboardData(params);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setData({ summary_by_branch: [], total_summary: {} });
    } finally {
      setLoading(false);
    }
  }, [filters?.branch_ids, filters?.dates]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    summary: data.summary_by_branch,
    totalSummary: data.total_summary,
    loading,
    fetchSummary: fetchDashboardData,
  };
};
