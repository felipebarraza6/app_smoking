import React from "react";
import { Card, Spin, Typography, theme } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../../utils/formatCurrency";

const { Title } = Typography;

const BranchPerformanceChart = ({ data, loading }) => {
  const { token } = theme.useToken();

  // El backend debe entregar un array de sucursales con ventas y ganancias
  // Si data es vacío o nulo, mostrar mensaje claro
  const chartData = (data || []).map((branch) => ({
    name: (branch.branch_name || "N/A").substring(0, 15),
    Ventas: branch.sales?.total_amount || 0,
    Ganancias: branch.sales?.profit || 0,
  }));

  return (
    <Card>
      <Title level={4}>Rendimiento por Sucursal</Title>
      <Spin spinning={loading}>
        {/* Si no hay datos, mostrar mensaje claro */}
        {chartData &&
        chartData.length > 0 &&
        chartData.some((b) => b.Ventas > 0 || b.Ganancias > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value, 0)} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Ventas" fill={token.colorPrimary} />
              <Bar dataKey="Ganancias" fill={token.colorSuccess} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>
              No hay datos de rendimiento de sucursales para mostrar en el
              período o sucursal seleccionados.
            </p>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default BranchPerformanceChart;
