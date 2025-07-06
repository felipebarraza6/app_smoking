import React from "react";
import { Card, Spin, Typography, theme } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../../utils/formatCurrency";
import dayjs from "dayjs";

const { Title } = Typography;

const TimeSeriesChart = ({ data, loading }) => {
  const { token } = theme.useToken();

  // El backend debe entregar un array de objetos con {date, sales, orders}
  // Si data es vacío o nulo, mostrar mensaje claro
  const formattedData = (data || []).map((item) => ({
    ...item,
    date: dayjs(item.date).format("DD/MM"),
  }));

  return (
    <Card>
      <Title level={4}>Evolución de Ventas y Pedidos</Title>
      <Spin spinning={loading}>
        {/* Si no hay datos, mostrar mensaje claro */}
        {formattedData &&
        formattedData.length > 0 &&
        formattedData.some((d) => d.sales > 0 || d.orders > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                name="Ventas"
                stroke={token.colorPrimary}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                name="Pedidos"
                stroke={token.colorSuccess}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <p>
              No hay datos para mostrar en el período o sucursal seleccionados.
            </p>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default TimeSeriesChart;
