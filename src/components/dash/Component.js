import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  DatePicker,
  Select,
  Spin,
  Flex,
  Card,
  Typography,
  Row,
  Col,
  Modal,
  Table,
  Button,
  Space,
  Tag,
  Statistic,
  Drawer,
  Alert,
  Skeleton,
  Empty,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { css } from "@emotion/react";
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  CarOutlined,
  PackageOutlined,
  PrinterOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../api/endpoints";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import InventorySection from "./InventorySection";
import ReceiptModalPedido from "../orders/ListOrdersManagement/ReceiptModal";
import ReceiptModalVenta from "../sale/Create/add_payments/ReceiptModal";
import { useBreakpoint } from "../../utils/breakpoints";
import { theme } from "antd";
import BranchesWidget from "./BranchesWidget";
import BranchSelector from "../common/BranchSelector";
import useBranches from "../../hooks/useBranches";
import { AppContext } from "../../App";
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardFilters } from "./hooks/useDashboardFilters";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { useToken } = theme;

// Configurar dayjs para usar español
dayjs.locale("es");

// Función para formatear moneda CLP
const formatCLP = (value) =>
  value?.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }) || "$0";

const IndicatorCard = ({
  title,
  value,
  color,
  icon,
  onClick,
  clickable = false,
}) => (
  <Card
    hoverable={clickable}
    style={{
      minWidth: 180,
      margin: 8,
      borderRadius: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      textAlign: "center",
      border: `1.5px solid ${color}`,
      cursor: clickable ? "pointer" : "default",
    }}
    bodyStyle={{ padding: 16 }}
    onClick={clickable ? onClick : undefined}
  >
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ color, fontWeight: 700, fontSize: 13, marginTop: 4 }}>
      {title}
    </div>
    <div style={{ fontSize: 22, color, fontWeight: 600, marginTop: 2 }}>
      {value}
    </div>
    {clickable && (
      <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
        Click para ver detalles
      </div>
    )}
  </Card>
);

// Componente skeleton para productos destacados
const ProductHighlightSkeleton = ({ title, icon, type }) => (
  <Card hoverable size="small" style={{ flex: 1 }}>
    <Text strong style={{ color: "#8c8c8c" }}>
      {icon} {title} ({type}):
    </Text>
    <br />
    <Text
      style={{
        fontSize: "14px",
        fontWeight: "500",
        color: "#bfbfbf",
        fontStyle: "italic",
      }}
    >
      Sin datos disponibles
    </Text>
    <br />
    <Text type="secondary" style={{ fontSize: "12px", color: "#d9d9d9" }}>
      📦 Cantidad: 0 unidades
    </Text>
    <br />
    <Text type="secondary" style={{ fontSize: "12px", color: "#d9d9d9" }}>
      🛒 En 0 {type === "Ventas" ? "ventas" : "pedidos"}
    </Text>
    <br />
    <Text type="secondary" style={{ fontSize: "12px", color: "#d9d9d9" }}>
      {title.includes("Rentable") ? "💎 Ganancia: $0" : "💰 Revenue: $0"}
    </Text>
  </Card>
);

// Componente para mostrar producto destacado
const ProductHighlightCard = ({ title, product }) => (
  <Card size="small" style={{ minWidth: 200, margin: 8, flex: 1 }}>
    <b>{title}</b>
    {product ? (
      <>
        <div>Nombre: {product.name}</div>
        <div>
          Cantidad:{" "}
          {product.quantity_sold !== undefined
            ? product.quantity_sold
            : product.quantity !== undefined
            ? product.quantity
            : "-"}
        </div>
        <div>
          Ganancia: $
          {product.total_profit !== undefined
            ? product.total_profit
            : product.profit !== undefined
            ? product.profit
            : "-"}
        </div>
        <div>
          Revenue: $
          {product.total_revenue !== undefined
            ? product.total_revenue
            : product.revenue !== undefined
            ? product.revenue
            : "-"}
        </div>
        <div>
          En {product.orders_count !== undefined ? product.orders_count : 0}{" "}
          ventas/pedidos
        </div>
      </>
    ) : (
      <div>Sin datos de productos</div>
    )}
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [metrics, setMetrics] = useState({
    activeClients: 0,
    inactiveClients: 0,
    activeOrders: 0,
    canceledOrders: 0,
    totalSales: 0,
    totalCost: 0,
    profit: 0,
    bestProduct: "-",
  });
  const [summary, setSummary] = useState([]);
  const [totalSummary, setTotalSummary] = useState({
    sales_amount: 0,
    sales_average: 0,
    sales_profit: 0,
    sales_cost: 0,
    sales_count: 0,
    sales_cancelled_count: 0,
    sales_draft_count: 0,
    orders_amount: 0,
    orders_average: 0,
    orders_profit: 0,
    orders_cost: 0,
    orders_count: 0,
    orders_cancelled_count: 0,
    orders_draft_count: 0,
    payments: { total: 0, by_type: {} },
    best_selling_product: null,
    most_profitable_product: null,
    sales_least_selling: null,
    sales_least_profitable: null,
    orders_best_selling_product: null,
    orders_most_profitable_product: null,
    orders_least_selling: null,
    orders_least_profitable: null,
  });

  // Estados para modales
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetailVisible, setPaymentDetailVisible] = useState(false);

  // Estado para modal de impresión
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [receiptType, setReceiptType] = useState(null); // 'venta' o 'pedido'

  // Estado para mostrar el alert de información del dashboard
  const [showInfoAlert, setShowInfoAlert] = useState(true);

  const [showDateModal, setShowDateModal] = useState(false);
  const [showDesdeModal, setShowDesdeModal] = useState(false);
  const [showHastaModal, setShowHastaModal] = useState(false);
  const [tempDesde, setTempDesde] = useState(dateRange?.[0] || null);
  const [tempHasta, setTempHasta] = useState(dateRange?.[1] || null);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  const { token } = useToken();
  const { state: appState } = useContext(AppContext);

  // Reemplazar estados y lógica local por hooks refactorizados
  const {
    branches,
    selectedBranches,
    dateRange,
    currentPeriod,
    handleBranchChange,
    handleDateRangeChange,
  } = useDashboardFilters();

  const {
    totalSummary,
    loading,
    fetchSummary,
    inventoryData,
    fetchInventoryData,
  } = useDashboardData();

  // Efectos para cargar datos
  useEffect(() => {
    fetchSummary(selectedBranches, dateRange);
  }, [selectedBranches, dateRange, fetchSummary]);

  useEffect(() => {
    fetchInventoryData(selectedBranches);
  }, [selectedBranches, fetchInventoryData]);

  // Generar título dinámico
  const getTitle = () => {
    const branchText =
      selectedBranches.length === 0
        ? "Todas las sucursales"
        : selectedBranches.length === 1
        ? branches.find((b) => b.id === selectedBranches[0])?.business_name ||
          "Sucursal"
        : `${selectedBranches.length} sucursales`;
    return `Resumen • ${branchText}`;
  };

  const getSubtitle = () => {
    if (currentPeriod) {
      return `Período: ${currentPeriod}`;
    }
    return "Selecciona un período para ver los datos";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Renderizar productos destacados usando totalSummary
  // ...
  // Ejemplo para el producto más vendido:
  // <BestProductCard metrics={{ bestProduct: totalSummary.best_selling_product?.name || "-" }} />
  // ...

  // Función para formatear el período
  const formatPeriod = useCallback((start, end) => {
    if (!start || !end) return "";

    try {
      // Usar dayjs para formateo
      const startFormatted = dayjs(start).format("D [de] MMMM [de] YYYY");
      const endFormatted = dayjs(end).format("D [de] MMMM [de] YYYY");

      return `${startFormatted} - ${endFormatted}`;
    } catch (error) {
      return "";
    }
  }, []);

  // Memoizar la función para obtener el rango del mes anterior
  const getLastMonthRange = useCallback(() => {
    const lastMonth = dayjs().subtract(1, "month").startOf("month");
    const lastDayOfLastMonth = dayjs().subtract(1, "month").endOf("month");
    return [lastMonth, lastDayOfLastMonth];
  }, []);

  // Cargar sucursales solo una vez al montar
  useEffect(() => {
    // Establecer período por defecto (mes anterior completo)
    const defaultRange = getLastMonthRange();
    setDateRange(defaultRange);
    setCurrentPeriod(formatPeriod(defaultRange[0], defaultRange[1]));
  }, [getLastMonthRange, formatPeriod]);

  // Actualizar branches cuando cambie el hook
  useEffect(() => {
    if (branches.length > 0) {
      setSelectedBranches(branches.map((b) => b.id));
    }
  }, [branches]);

  // Limpiar selectedBranches si el usuario selecciona 'all' o nada
  useEffect(() => {
    if (
      selectedBranches.length === 1 &&
      (selectedBranches[0] === "all" || selectedBranches[0] === null)
    ) {
      // Si selecciona 'Todas mis sucursales', limpiar el filtro
      setSelectedBranches([]);
    }
  }, [selectedBranches]);

  // Memoizar las funciones de fetch para evitar re-creaciones
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedBranches.length > 0)
        params.branch_ids = selectedBranches.join(",");
      if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        params.start_date = dayjs(dateRange[0]).format("YYYY-MM-DD");
        params.end_date = dayjs(dateRange[1]).format("YYYY-MM-DD");
      }

      const response = await api.dashboard.summary(params);

      setSummary(response.branches || response || []);

      // Mapear los datos del backend a la estructura que espera el frontend
      const backendTotal = response.totals || {};
      const salesData = backendTotal.sales || {};
      const ordersData = backendTotal.orders || {};
      const paymentsData = backendTotal.payments || {};

      setTotalSummary({
        sales_amount: salesData.paid_amount || 0,
        sales_average: salesData.paid_amount || 0,
        sales_profit: salesData.profit || 0,
        sales_cost: salesData.cost || 0,
        sales_count: salesData.count || 0,
        sales_cancelled_count: salesData.cancelled_count || 0,
        sales_draft_count: salesData.draft_count || 0,
        orders_amount: ordersData.completed_amount || 0,
        orders_average: ordersData.completed_amount || 0,
        orders_profit: ordersData.profit || 0,
        orders_cost: ordersData.cost || 0,
        orders_count: ordersData.count || 0,
        orders_cancelled_count: ordersData.cancelled_count || 0,
        orders_draft_count: ordersData.draft_count || 0,
        payments: {
          total: paymentsData.total || 0,
          by_type: paymentsData.by_type || {},
        },
        best_selling_product: salesData.best_selling_product || null,
        most_profitable_product: salesData.most_profitable_product || null,
        sales_least_selling: salesData.sales_least_selling || null,
        sales_least_profitable: salesData.sales_least_profitable || null,
        orders_best_selling_product: ordersData.best_selling_product || null,
        orders_most_profitable_product:
          ordersData.most_profitable_product || null,
        orders_least_selling: ordersData.orders_least_selling || null,
        orders_least_profitable: ordersData.orders_least_profitable || null,
      });
    } catch (error) {
      setSummary([]);
      setTotalSummary({
        sales_amount: 0,
        sales_average: 0,
        sales_profit: 0,
        sales_cost: 0,
        sales_count: 0,
        sales_cancelled_count: 0,
        sales_draft_count: 0,
        orders_amount: 0,
        orders_average: 0,
        orders_profit: 0,
        orders_cost: 0,
        orders_count: 0,
        orders_cancelled_count: 0,
        orders_draft_count: 0,
        payments: { total: 0, by_type: {} },
        best_selling_product: null,
        most_profitable_product: null,
        sales_least_selling: null,
        sales_least_profitable: null,
        orders_best_selling_product: null,
        orders_most_profitable_product: null,
        orders_least_selling: null,
        orders_least_profitable: null,
      });
    }
    setLoading(false);
  }, [selectedBranches, dateRange]);

  const fetchInventoryData = useCallback(async () => {
    try {
      const params = {};
      if (selectedBranches.length > 0) {
        params.branch_ids = selectedBranches.join(",");
      }

      const response = await api.dashboard.inventory(params);

      // El endpoint ahora devuelve un objeto con data y summary
      if (response && response.data && response.summary) {
        setInventoryData({
          data: response.data,
          summary: response.summary,
        });
      } else if (Array.isArray(response)) {
        // Fallback para la estructura anterior
        const inventory = response;
        const summary = {
          total_products: inventory.reduce(
            (sum, item) => sum + (item.total_products || 0),
            0
          ),
          total_products_with_inventory: inventory.reduce(
            (sum, item) => sum + (item.products_with_inventory || 0),
            0
          ),
          total_value: inventory.reduce(
            (sum, item) => sum + (item.total_value || 0),
            0
          ),
          total_profit_potential: inventory.reduce(
            (sum, item) => sum + (item.total_profit_potential || 0),
            0
          ),
        };
        setInventoryData({
          data: inventory,
          summary: summary,
        });
      } else {
        setInventoryData({
          data: [],
          summary: {},
        });
      }
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setInventoryData({
        data: [],
        summary: {},
      });
    }
  }, [selectedBranches]);

  // Actualizar datos cuando cambien las dependencias
  useEffect(() => {
    fetchSummary();
    fetchInventoryData();

    // Actualizar el período mostrado
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      setCurrentPeriod(formatPeriod(dateRange[0], dateRange[1]));
    } else {
      setCurrentPeriod("");
    }
  }, [
    dateRange,
    selectedBranches,
    fetchSummary,
    fetchInventoryData,
    formatPeriod,
  ]);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      // Clients (sin filtro por sucursal para métricas generales)
      const allClients = await api.clients.list_all();
      const clientsList = Array.isArray(allClients)
        ? allClients
        : allClients?.results || [];
      const activeClients = clientsList.filter((c) => c.is_active).length;
      const inactiveClients = clientsList.length - activeClients;

      // Orders
      let query = [];
      if (selectedBranches.length > 0) {
        query.push(`client__branch__in=${selectedBranches.join(",")}`);
      }
      if (dateRange.length === 2) {
        const [start, end] = dateRange;
        query.push(`start_date=${start.format("YYYY-MM-DD")}`);
        query.push(`end_date=${end.format("YYYY-MM-DD")}`);
      }
      const response = await api.orders.list(1, query.join("&"));
      const orders = Array.isArray(response.results)
        ? response.results
        : response || [];
      const activeOrders = orders.filter((o) => o.is_pay).length;
      const canceledOrders = orders.filter((o) => !o.is_active).length;

      // Sales amounts and costs
      const totalSales = orders.reduce(
        (sum, o) => sum + (o.total_amount || 0) + (o.driver?.amount || 0),
        0
      );
      const totalCost = orders.reduce((sum, o) => sum + (o.total_cost || 0), 0);
      const profit = totalSales - totalCost;

      // Best selling product
      const countMap = {};
      orders.forEach((o) => {
        Array.isArray(o.registers) &&
          o.registers.forEach((r) => {
            if (r.product) {
              countMap[r.name] =
                (countMap[r.name] || 0) + Math.abs(r.quantity || 0);
            }
          });
      });
      const bestProduct =
        Object.entries(countMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name)[0] || "-";

      setMetrics({
        activeClients,
        inactiveClients,
        activeOrders,
        canceledOrders,
        totalSales,
        totalCost,
        profit,
        bestProduct,
      });
    } catch (error) {
      // Establecer valores por defecto en caso de error
      setMetrics({
        activeClients: 0,
        inactiveClients: 0,
        activeOrders: 0,
        canceledOrders: 0,
        totalSales: 0,
        totalCost: 0,
        profit: 0,
        bestProduct: "-",
      });
    }
    setLoading(false);
  };

  // Re-fetch metrics when branches or date range changes
  useEffect(() => {
    fetchMetrics();
  }, [selectedBranches, dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers para modales
  const handleCardClick = async (type, indicator = null) => {
    setModalType(type);
    setModalVisible(true);
    setModalLoading(true);

    try {
      let queryParams = [];
      if (selectedBranches.length > 0)
        queryParams.push(`branch_ids=${selectedBranches.join(",")}`);
      if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        queryParams.push(
          `start_date=${dayjs(dateRange[0]).format("YYYY-MM-DD")}`
        );
        queryParams.push(
          `end_date=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`
        );
      }

      // Determinar el tipo específico de modal según el indicador
      let modalType = type;
      if (indicator) {
        if (type === "sales") {
          if (indicator === "pagadas") modalType = "sales_paid";
          else if (indicator === "anuladas") modalType = "sales_cancelled";
          else if (indicator === "cantidad") modalType = "sales_active";
        } else if (type === "orders") {
          if (indicator === "pagados") modalType = "orders_paid";
          else if (indicator === "anulados") modalType = "orders_cancelled";
          else if (indicator === "cantidad") modalType = "orders_active";
        }
      }

      queryParams.push(`type=${modalType}`);
      queryParams.push("page=1");

      const response = await api.dashboard.modal_data(queryParams.join("&"));
      const data = Array.isArray(response) ? response : response.results || [];
      setModalData(data);
    } catch (error) {
      setModalData([]);
    }
    setModalLoading(false);
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "sales":
        return "Detalle de Ventas";
      case "orders":
        return "Detalle de Pedidos";
      case "payments":
        return "Detalle de Pagos";
      default:
        return "Detalle";
    }
  };

  const getModalColumns = () => {
    const baseColumns = [
      {
        title: "Fecha",
        dataIndex: "date",
        key: "date",
        render: (date) => new Date(date).toLocaleDateString("es-ES"),
      },
      {
        title: "Cliente",
        dataIndex: ["client", "name"],
        key: "client",
      },
      {
        title: "Tienda",
        dataIndex: ["client", "branch", "business_name"],
        key: "branch",
      },
    ];

    if (modalType === "payments") {
      return [
        ...baseColumns.slice(0, 3),
        {
          title: "Tipo  Pago",
          dataIndex: ["type_payment", "name"],
          key: "type_payment",
        },
        {
          title: "Pago",
          dataIndex: "amount",
          key: "amount",
          render: (amount) => formatCLP(amount),
        },
        {
          title: "Total",
          dataIndex: "order",
          key: "order_total",
          render: (order) => formatCLP(getOrderTotal(order)),
        },
        {
          title: "Procedencía",
          dataIndex: "order",
          key: "order_type",
          render: (order) => {
            if (order?.is_sale) return "Venta";
            if (order?.is_order) return "Pedido";
            return "N/A";
          },
        },
      ];
    }

    // Para órdenes (ventas y pedidos)
    return [
      ...baseColumns,
      {
        title: "Total",
        key: "total_amount",
        render: (record) => formatCLP(getOrderTotal(record)),
      },
      {
        title: "Costo",
        dataIndex: "total_cost",
        key: "total_cost",
        render: (cost) => formatCLP(cost),
      },
      {
        title: "Estado",
        dataIndex: "is_pay",
        key: "status",
        render: (isPay, record) => {
          if (record.is_null) return <Tag color="red">Anulada</Tag>;
          if (isPay) return <Tag color="green">Pagada</Tag>;
          if (record.is_active === null)
            return <Tag color="gray">Borrador</Tag>;
          return <Tag color="orange">Pendiente</Tag>;
        },
      },
      {
        title: "Tipo",
        dataIndex: "is_sale",
        key: "type",
        render: (isSale) => (
          <Tag color={isSale ? "blue" : "purple"}>
            {isSale ? "Venta" : "Pedido"}
          </Tag>
        ),
      },
    ];
  };

  const handleNavigateToModule = (module) => {
    setModalVisible(false);
    if (module === "sales") {
      navigate("/app/sales-management");
    } else if (module === "orders") {
      navigate("/app/orders-management");
    }
  };

  // Agregar la función para manejar el cambio de página en el modal
  const handleModalPageChange = async (page) => {
    setModalLoading(true);
    try {
      let queryParams = [];
      if (selectedBranches.length > 0)
        queryParams.push(`branch_ids=${selectedBranches.join(",")}`);
      if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        queryParams.push(
          `start_date=${dayjs(dateRange[0]).format("YYYY-MM-DD")}`
        );
        queryParams.push(
          `end_date=${dayjs(dateRange[1]).format("YYYY-MM-DD")}`
        );
      }

      // Determinar el tipo específico de modal según el modalType actual
      let currentModalType = modalType;
      if (modalType === "sales") {
        currentModalType = "sales_active"; // Por defecto
      } else if (modalType === "orders") {
        currentModalType = "orders_active"; // Por defecto
      } else if (modalType === "payments") {
        currentModalType = "payments";
      }

      queryParams.push(`type=${currentModalType}`);
      queryParams.push(`page=${page}`);

      const response = await api.dashboard.modal_data(queryParams.join("&"));
      const data = response.results || response || [];
      setModalData(data);
    } catch (error) {
      setModalData([]);
    }
    setModalLoading(false);
  };

  // Handler para abrir el modal secundario con la ficha de la orden o el pago
  const handleRowClick = (record) => {
    if (modalType === "payments") {
      setSelectedPayment(record);
      setPaymentDetailVisible(true);
    } else {
      setSelectedOrder(record);
      setDetailVisible(true);
    }
  };

  // Helper para total con delivery y siempre positivo
  const getOrderTotal = (record) => {
    let total = Math.abs(record.total_amount || 0);

    if (
      record.is_delivery &&
      record.driver &&
      typeof record.driver.amount === "number"
    ) {
      total += Math.abs(record.driver.amount);
    }

    return total;
  };

  // 1. Nueva función para obtener la orden/venta completa por ID
  const fetchOrderById = async (orderId) => {
    try {
      const response = await api.orders.retrieve(orderId);

      return response;
    } catch (error) {
      return null;
    }
  };

  return (
    <Flex
      vertical={true}
      gap="small"
      style={{ width: "100%", padding: isMobile ? 8 : 24 }}
    >
      <Flex justify="space-around">
        {isMobile ? (
          <Flex style={{ width: "100%", marginBottom: 12 }} vertical>
            <Flex gap={8} style={{ width: "100%" }}>
              <Button
                style={{ width: "50%" }}
                icon={<CalendarOutlined />}
                onClick={() => setShowDesdeModal(true)}
              >
                {dateRange && dateRange[0]
                  ? ` ${dayjs(dateRange[0]).format("DD/MM/YYYY")}`
                  : ""}
              </Button>
              <Button
                style={{ width: "50%" }}
                icon={<CalendarOutlined />}
                onClick={() => setShowHastaModal(true)}
              >
                {dateRange && dateRange[1]
                  ? ` ${dayjs(dateRange[1]).format("DD/MM/YYYY")}`
                  : ""}
              </Button>
            </Flex>
            {/* Modal para seleccionar fecha DESDE */}
            <Modal
              open={showDesdeModal}
              onCancel={() => setShowDesdeModal(false)}
              footer={null}
              width="100vw"
              style={{ top: 40, padding: 0 }}
              bodyStyle={{ padding: "32px 0 0 0" }}
              centered
              closeIcon={
                <span
                  style={{
                    fontSize: 28,
                    color: "#fff",
                    background: "#222",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 10,
                    right: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  ×
                </span>
              }
            >
              <DatePicker
                style={{ width: "100%", padding: 16 }}
                value={tempDesde}
                onChange={(val) => {
                  setTempDesde(val);
                  setShowDesdeModal(false);
                  // Si ya hay hasta, actualizar el rango
                  if (val && tempHasta) {
                    setDateRange([val, tempHasta]);
                  }
                }}
                format="DD/MM/YYYY"
                autoFocus
                allowClear
                disabledDate={(d) => tempHasta && d > tempHasta}
              />
            </Modal>
            {/* Modal para seleccionar fecha HASTA */}
            <Modal
              open={showHastaModal}
              onCancel={() => setShowHastaModal(false)}
              footer={null}
              width="100vw"
              style={{ top: 40, padding: 0 }}
              bodyStyle={{ padding: "32px 0 0 0" }}
              centered
              closeIcon={
                <span
                  style={{
                    fontSize: 28,
                    color: "#fff",
                    background: "#222",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 10,
                    right: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  ×
                </span>
              }
            >
              <DatePicker
                style={{ width: "100%", padding: 16 }}
                value={tempHasta}
                onChange={(val) => {
                  setTempHasta(val);
                  setShowHastaModal(false);
                  // Si ya hay desde, actualizar el rango
                  if (tempDesde && val) {
                    setDateRange([tempDesde, val]);
                  }
                }}
                format="DD/MM/YYYY"
                autoFocus
                allowClear
                disabledDate={(d) => tempDesde && d < tempDesde}
              />
            </Modal>
            <BranchSelector
              mode="multiple"
              placeholder="Selecciona sucursales"
              style={{ width: "100%", marginTop: 12 }}
              value={selectedBranches}
              onChange={(val) => {
                if (!val) {
                  setSelectedBranches([]);
                } else if (Array.isArray(val)) {
                  setSelectedBranches(val);
                } else {
                  setSelectedBranches([val]);
                }
              }}
              showRole={true}
              showCount={true}
              maxTagCount="responsive"
              maxTagTextLength={20}
              hookOptions={{
                includeAllOption: true,
                showRoles: true,
                filterByRole: null,
              }}
            />
          </Flex>
        ) : (
          <Flex gap={16}>
            <Flex vertical gap="small" justify="center">
              <RangePicker
                style={{ width: 260 }}
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
              />
              <BranchSelector
                mode="multiple"
                placeholder="Selecciona sucursales"
                style={{ width: 260 }}
                value={selectedBranches}
                onChange={(val) => {
                  if (!val) {
                    setSelectedBranches([]);
                  } else if (Array.isArray(val)) {
                    setSelectedBranches(val);
                  } else {
                    setSelectedBranches([val]);
                  }
                }}
                showRole={true}
                showCount={true}
                maxTagCount="responsive"
                maxTagTextLength={20}
                hookOptions={{
                  includeAllOption: true,
                  showRoles: true,
                  filterByRole: null,
                }}
              />
            </Flex>
            {showInfoAlert && (
              <Card
                size="small"
                style={{
                  border: "none",
                  marginBottom: isMobile ? 10 : 24,
                  fontSize: isMobile ? 13 : 15,
                  padding: isMobile ? 8 : 16,
                  borderRadius: 10,
                  maxWidth: 800,
                  alignSelf: "center",
                }}
                styles={{ body: { padding: isMobile ? 10 : 18 } }}
              >
                <Typography.Paragraph style={{ color: token.colorText }}>
                  <span role="img" aria-label="calendario">
                    📅
                  </span>{" "}
                  <Typography.Text strong>Período Inicial:</Typography.Text> Por
                  defecto, el dashboard muestra el{" "}
                  <Typography.Text strong>último mes completo</Typography.Text>{" "}
                  para ventas, pedidos y pagos. Para ver datos del mes actual,
                  cambia el rango de fechas usando el selector de arriba.
                </Typography.Paragraph>
                <Typography.Paragraph style={{ color: token.colorText }}>
                  <span role="img" aria-label="inventario">
                    📦
                  </span>{" "}
                  <Typography.Text strong>Inventario:</Typography.Text> El
                  inventario muestra el{" "}
                  <Typography.Text strong>
                    estado actual de la bodega
                  </Typography.Text>{" "}
                  y{" "}
                  <Typography.Text strong>
                    NO se filtra por fecha
                  </Typography.Text>
                  , solo por sucursal. Representa el stock disponible en tiempo
                  real.
                </Typography.Paragraph>
              </Card>
            )}
          </Flex>
        )}
      </Flex>

      <Flex wrap gap={"small"} vertical>
        {/* Filtros arriba: vertical en móvil, horizontal en escritorio */}

        {loading ? (
          <Flex justify="center" style={{ margin: "50px 0" }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Card
            style={{
              margin: isMobile ? "8px 0" : "24px 0",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              width: "100%",
              maxWidth: 1200,
              alignSelf: "center",
            }}
            styles={{ body: { padding: isMobile ? 12 : 24 } }}
          >
            <Title level={3}>
              {selectedBranches.length === 0
                ? "Todas las Sucursales"
                : selectedBranches.length === 1
                ? (() => {
                    const branchName =
                      branches.find((b) => b.id === selectedBranches[0])
                        ?.business_name || "Sucursal";
                    return branchName.length > 35
                      ? branchName.substring(0, 35) + "..."
                      : branchName;
                  })()
                : `${selectedBranches.length} Sucursales Seleccionadas`}
            </Title>

            {/* Grupo VENTAS */}
            <div style={{ margin: isMobile ? "16px 0 8px 0" : "24px 0 8px 0" }}>
              <Flex
                justify="space-between"
                align="center"
                style={{
                  marginBottom: 12,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Ventas
                </Title>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => navigate("/app/sales-management")}
                  size={isMobile ? "small" : "middle"}
                >
                  Gestionar Ventas
                </Button>
              </Flex>
              <Flex
                wrap={isMobile ? "wrap" : "nowrap"}
                justify="center"
                gap={isMobile ? 8 : 16}
                style={{ width: "100%" }}
              >
                <IndicatorCard
                  title="Pagadas"
                  value={formatCLP(totalSummary.sales_average)}
                  color="#52c41a"
                  icon="💰"
                  onClick={() => handleCardClick("sales", "pagadas")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Costo"
                  value={formatCLP(totalSummary.sales_cost)}
                  color="#ff7f50"
                  icon="📊"
                  onClick={() => handleCardClick("sales", "pagadas")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Cantidad Ventas"
                  value={totalSummary.sales_count || 0}
                  color="#faad14"
                  icon="#️⃣"
                  onClick={() => handleCardClick("sales", "cantidad")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Anuladas"
                  value={totalSummary.sales_cancelled_count || 0}
                  color="#ff4d4f"
                  icon="❌"
                  onClick={() => handleCardClick("sales", "anuladas")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
              </Flex>
              {/* Productos destacados ventas */}
              <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Más vendido"
                    product={totalSummary.best_selling_product}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Más rentable"
                    product={totalSummary.most_profitable_product}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Menos vendido"
                    product={totalSummary.sales_least_selling}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Menos rentable"
                    product={totalSummary.sales_least_profitable}
                  />
                </Col>
              </Row>
            </div>

            {/* Grupo PEDIDOS */}
            <div style={{ margin: isMobile ? "16px 0 8px 0" : "24px 0 8px 0" }}>
              <Flex
                justify="space-between"
                align="center"
                style={{
                  marginBottom: 12,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Pedidos
                </Title>
                <Button
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => navigate("/app/orders-management")}
                  size={isMobile ? "small" : "middle"}
                >
                  Gestionar Pedidos
                </Button>
              </Flex>
              <Flex
                wrap={isMobile ? "wrap" : "nowrap"}
                gap={isMobile ? 8 : 16}
                style={{ width: "100%" }}
                justify="center"
              >
                <IndicatorCard
                  title="Pagados"
                  value={formatCLP(totalSummary.orders_average)}
                  color="#52c41a"
                  icon="💰"
                  onClick={() => handleCardClick("orders", "pagados")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Costo"
                  value={formatCLP(totalSummary.orders_cost)}
                  color="#ff7f50"
                  icon="📊"
                  onClick={() => handleCardClick("orders", "pagados")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Cantidad Pedidos"
                  value={totalSummary.orders_count || 0}
                  color="#faad14"
                  icon="#️⃣"
                  onClick={() => handleCardClick("orders", "cantidad")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                <IndicatorCard
                  title="Anulados"
                  value={totalSummary.orders_cancelled_count || 0}
                  color="#ff4d4f"
                  icon="❌"
                  onClick={() => handleCardClick("orders", "anulados")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
              </Flex>
              {/* Productos destacados pedidos */}
              <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Más vendido"
                    product={totalSummary.orders_best_selling_product}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Más rentable"
                    product={totalSummary.orders_most_profitable_product}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Menos vendido"
                    product={totalSummary.orders_least_selling}
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                  <ProductHighlightCard
                    title="Menos rentable"
                    product={totalSummary.orders_least_profitable}
                  />
                </Col>
              </Row>
            </div>

            {/* Grupo PAGOS */}
            <div style={{ margin: isMobile ? "16px 0 8px 0" : "24px 0 8px 0" }}>
              <Title level={4} style={{ marginBottom: 12 }}>
                Pagos
              </Title>
              <Flex
                wrap={isMobile ? "wrap" : "nowrap"}
                gap={isMobile ? 8 : 16}
                style={{ width: "100%" }}
                justify="center"
              >
                <IndicatorCard
                  title="Total Pagos"
                  value={formatCLP(totalSummary.payments?.total)}
                  color="#52c41a"
                  icon="💳"
                  onClick={() => handleCardClick("payments")}
                  clickable={true}
                  style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                />
                {totalSummary.payments?.by_type &&
                  Object.entries(totalSummary.payments.by_type).map(
                    ([type, data]) => (
                      <IndicatorCard
                        key={type}
                        title={`Pagos ${type || "Sin tipo"}`}
                        value={formatCLP(data?.amount)}
                        color="#0ea5e9"
                        icon="💵"
                        onClick={() => handleCardClick("payments")}
                        clickable={true}
                        style={{ flex: 1, minWidth: isMobile ? "100%" : 180 }}
                      />
                    )
                  )}
              </Flex>
            </div>

            {/* Grupo INVENTARIO */}
            <div style={{ margin: isMobile ? "16px 0 8px 0" : "24px 0 8px 0" }}>
              <Flex
                justify="space-between"
                align="center"
                style={{
                  marginBottom: 12,
                  flexWrap: isMobile ? "wrap" : "nowrap",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Inventario
                </Title>
                <Button
                  type="primary"
                  icon={<AppstoreOutlined />}
                  onClick={() => navigate("/app/products")}
                  size={isMobile ? "small" : "middle"}
                >
                  Gestionar Productos
                </Button>
              </Flex>

              <InventorySection
                inventoryData={inventoryData.data}
                summary={inventoryData.summary}
                loading={loading}
              />
            </div>
          </Card>
        )}
      </Flex>

      {/* Gráfico de ventas y pedidos por sucursal */}
      {summary.length > 0 && (
        <div
          style={{
            marginTop: isMobile ? 16 : 32,
            background: "#18181c",
            borderRadius: 12,
            padding: isMobile ? 8 : 24,
            overflowX: isMobile ? "auto" : "visible",
          }}
        >
          <Title level={5} style={{ color: "#fff", marginBottom: 16 }}>
            Ventas y Pedidos por Sucursal
          </Title>
          <div
            style={{
              width: isMobile ? 400 : "100%",
              minWidth: 320,
            }}
          >
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 340}>
              <BarChart
                data={summary.map((item) => ({
                  name: item.branch?.business_name || "Sucursal",
                  ventas: item.sales_amount || 0,
                  pedidos: item.orders_amount || 0,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    background: "#222",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                  formatter={(value, name) => {
                    if (name === "ventas")
                      return [`${value.toLocaleString()}`, "Ventas"];
                    if (name === "pedidos")
                      return [`${value.toLocaleString()}`, "Pedidos"];
                    return value;
                  }}
                  labelFormatter={(label) => `Sucursal: ${label}`}
                />
                <Bar dataKey="ventas" fill="#1890ff" name="Ventas" />
                <Bar dataKey="pedidos" fill="#faad14" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Widget de sucursales del usuario */}
      <div style={{ marginTop: isMobile ? 16 : 32 }}>
        <BranchesWidget />
      </div>

      {/* Modal para detalles */}
      <Modal
        title={getModalTitle()}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Cerrar
          </Button>,
          modalType === "sales" && (
            <Button
              key="navigate"
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => handleNavigateToModule("sales")}
            >
              Ir a Ventas
            </Button>
          ),
          modalType === "orders" && (
            <Button
              key="navigate"
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={() => handleNavigateToModule("orders")}
            >
              Ir a Pedidos
            </Button>
          ),
        ].filter(Boolean)}
        width={1000}
      >
        {modalLoading ? (
          <Flex justify="center" style={{ margin: "50px 0" }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Table
            dataSource={modalData}
            bordered
            columns={getModalColumns()}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            })}
            pagination={{
              pageSize: 10,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} registros`,
              onChange: (page, pageSize) => {
                // Recargar los datos de la página seleccionada
                handleModalPageChange(page);
              },
            }}
            scroll={{ x: true }}
          />
        )}
      </Modal>

      {/* Modal secundario para ficha de orden */}
      <Drawer
        title={selectedOrder?.is_sale ? "Ficha de Venta" : "Ficha de Pedido"}
        placement="right"
        width={500}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
        extra={
          selectedOrder && (
            <Button
              type="primary"
              icon={
                selectedOrder.is_sale ? (
                  <span role="img" aria-label="Boleta">
                    🧾
                  </span>
                ) : (
                  <span role="img" aria-label="Ficha">
                    📄
                  </span>
                )
              }
              onClick={() => {
                setReceiptType(selectedOrder.is_sale ? "venta" : "pedido");
                setReceiptVisible(true);
              }}
            >
              {selectedOrder.is_sale ? "Boleta" : "Ficha"}
            </Button>
          )
        }
      >
        {selectedOrder ? (
          <div>
            <p>
              <b>Fecha:</b>{" "}
              {selectedOrder.date
                ? new Date(selectedOrder.date).toLocaleString("es-CL")
                : "-"}
            </p>
            <p>
              <b>Cliente:</b> {selectedOrder.client?.name || "Sin cliente"}
            </p>
            <p>
              <b>Tienda:</b>{" "}
              {selectedOrder.client?.branch?.business_name || "-"}
            </p>
            <p>
              <b>Total:</b> {formatCLP(getOrderTotal(selectedOrder))}
            </p>
            <p>
              <b>Costo:</b> {formatCLP(selectedOrder.total_cost)}
            </p>
            <p>
              <b>Estado:</b>{" "}
              {selectedOrder.is_null
                ? "Anulada"
                : selectedOrder.is_pay
                ? "Pagada"
                : selectedOrder.is_active === null
                ? "Borrador"
                : "Pendiente"}
            </p>
            <p>
              <b>Tipo:</b> {selectedOrder.is_sale ? "Venta" : "Pedido"}
            </p>
            <p>
              <b>Productos:</b>
            </p>
            <ul>
              {selectedOrder.registers && selectedOrder.registers.length > 0 ? (
                selectedOrder.registers.map((reg) => (
                  <li key={reg.id}>
                    {reg.product?.name || "-"} x {Math.abs(reg.quantity)} @{" "}
                    {formatCLP(Math.abs(reg.product?.price || 0))}
                  </li>
                ))
              ) : (
                <li>Sin productos</li>
              )}
            </ul>
            {selectedOrder.driver && (
              <p>
                <b>Repartidor:</b> Monto:{" "}
                {formatCLP(selectedOrder.driver.amount)}
              </p>
            )}
          </div>
        ) : (
          <Spin />
        )}
      </Drawer>
      {/* El modal de boleta/ficha debe ir fuera del Drawer, y debe usar receiptVisible */}
      {selectedOrder &&
        receiptVisible &&
        (selectedOrder.is_sale ? (
          <ReceiptModalVenta
            visible={receiptVisible}
            onClose={() => setReceiptVisible(false)}
            saleData={selectedOrder}
          />
        ) : (
          <ReceiptModalPedido
            visible={receiptVisible}
            onClose={() => setReceiptVisible(false)}
            orderData={selectedOrder}
          />
        ))}
      {/* NUEVO: Drawer para detalle de pago */}
      <Drawer
        title="Detalle de Pago"
        placement="right"
        width={400}
        onClose={() => setPaymentDetailVisible(false)}
        open={paymentDetailVisible}
      >
        {selectedPayment ? (
          <div>
            <p>
              <b>Fecha:</b>{" "}
              {selectedPayment.date
                ? new Date(selectedPayment.date).toLocaleString("es-CL")
                : "-"}
            </p>
            <p>
              <b>Monto:</b> {formatCLP(selectedPayment.amount)}
            </p>
            <p>
              <b>Tipo de pago:</b> {selectedPayment.type_payment?.name || "-"}
            </p>
            <p>
              <b>Cliente:</b> {selectedPayment.client?.name || "Sin cliente"}
            </p>
            <p>
              <b>Tienda:</b>{" "}
              {selectedPayment.client?.branch?.business_name || "-"}
            </p>
            <p>
              <b>Procedencia:</b>{" "}
              {selectedPayment.order && (
                <Button
                  type="primary"
                  shape="round"
                  size="small"
                  onClick={async () => {
                    try {
                      // Verificar si tenemos order_id en el pago o id en la orden
                      const orderId =
                        selectedPayment.order_id || selectedPayment.order?.id;

                      if (orderId) {
                        const fullOrder = await fetchOrderById(orderId);

                        if (fullOrder) {
                          setSelectedOrder(fullOrder);
                          setDetailVisible(true);
                          setPaymentDetailVisible(false); // Cerrar el drawer de pago
                        } else {
                          Modal.error({
                            title: "No se pudo obtener el detalle completo",
                            content:
                              "No fue posible cargar la información completa de la orden/venta.",
                          });
                        }
                      } else {
                        Modal.error({
                          title: "No se pudo obtener el detalle completo",
                          content:
                            "No fue posible cargar la información completa de la orden/venta.",
                        });
                      }
                    } catch (error) {
                      Modal.error({
                        title: "Error inesperado",
                        content:
                          "Ocurrió un error al intentar cargar la información de la orden/venta.",
                      });
                    }
                  }}
                >
                  {selectedPayment.order.is_sale ? "Venta" : "Pedido"}
                </Button>
              )}
            </p>
            {/* Mostrar totales de la orden/venta con delivery */}
            {selectedPayment.order && (
              <div style={{ marginTop: 16 }}>
                <b>
                  Total de la{" "}
                  {selectedPayment.order.is_sale ? "venta" : "orden"}:
                </b>{" "}
                {formatCLP(getOrderTotal(selectedPayment.order))}
              </div>
            )}
          </div>
        ) : (
          <Spin />
        )}
      </Drawer>
    </Flex>
  );
};

export default Dashboard;
