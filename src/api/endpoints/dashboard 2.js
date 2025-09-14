import { GET } from "../config";

const getDashboardData = (params) => {
  return GET("core/dashboard/summary/", { params });
};

const dashboardEndpoints = {
  getDashboardData,
};

export default dashboardEndpoints;
