import dayjs from "dayjs";

// Formatear moneda en pesos chilenos
export const formatCLP = (value) => {
  if (!value && value !== 0) return "$0";

  // Convertir a número si es string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Formatear con puntos como separadores de miles
  const formatted = numValue.toLocaleString("es-CL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `$${formatted}`;
};

// Obtener título del modal según el tipo
export const getModalTitle = (type, indicator) => {
  const titles = {
    sales: {
      pagadas: "Ventas Pagadas",
      cantidad: "Cantidad de Ventas",
      anuladas: "Ventas Anuladas",
    },
    orders: {
      pagados: "Pedidos Pagados",
      cantidad: "Cantidad de Pedidos",
      anulados: "Pedidos Anulados",
    },
  };
  return titles[type]?.[indicator] || `${type} - ${indicator}`;
};

// Obtener columnas del modal según el tipo
export const getModalColumns = (type, indicator) => {
  const baseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Cliente",
      dataIndex: ["client", "name"],
      key: "client",
      width: 150,
    },
    {
      title: "Sucursal",
      dataIndex: ["client", "branch", "name"],
      key: "branch",
      width: 120,
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 120,
      render: (value) => formatCLP(value),
    },
  ];

  if (type === "sales") {
    return [
      ...baseColumns,
      {
        title: "Estado",
        dataIndex: "is_pay",
        key: "is_pay",
        width: 100,
        render: (isPay) => (
          <span style={{ color: isPay ? "#52c41a" : "#faad14" }}>
            {isPay ? "Pagada" : "Pendiente"}
          </span>
        ),
      },
    ];
  }

  if (type === "orders") {
    return [
      ...baseColumns,
      {
        title: "Estado",
        dataIndex: "is_pay",
        key: "is_pay",
        width: 100,
        render: (isPay) => (
          <span style={{ color: isPay ? "#52c41a" : "#faad14" }}>
            {isPay ? "Completado" : "Pendiente"}
          </span>
        ),
      },
    ];
  }

  return baseColumns;
};

// Calcular total de una orden
export const calculateOrderTotal = (record) => {
  const baseAmount = record.total_amount || 0;
  const driverAmount = record.driver?.amount || 0;
  return baseAmount + driverAmount;
};

// Validar si hay datos para mostrar
export const hasData = (data) => {
  return data && Object.keys(data).length > 0;
};

// Obtener estado de carga
export const getLoadingState = (loading, data) => {
  if (loading) return "loading";
  if (!hasData(data)) return "empty";
  return "success";
};

// Función para formatear números
export const formatNumber = (value) => value?.toLocaleString("es-CL") || "0";

// Función para calcular porcentajes
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Función para obtener el color según el estado
export const getStatusColor = (status) => {
  const colors = {
    completed: "#52c41a",
    cancelled: "#ff4d4f",
    draft: "#faad14",
    pending: "#1890ff",
  };
  return colors[status] || "#8c8c8c";
};

// Función para formatear fechas
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-CL");
};
