import { GET } from "../config";

const getDashboardData = (params) => {
  return GET("analytics/dashboard/summary/", { params });
};

const dashboardEndpoints = {
  getDashboardData,
};

export default dashboardEndpoints;
