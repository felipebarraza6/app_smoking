import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Flex,
  DatePicker,
  Space,
  Alert,
  Spin,
  theme,
} from "antd";
import { useBreakpoint } from "../../utils/breakpoints";

// Hooks personalizados
import { useDashboardData } from "./hooks/useDashboardData";
import { useDashboardModals } from "./hooks/useDashboardModals";
import { useDashboardFilters } from "./hooks/useDashboardFilters";

// Componentes
import SalesSection from "./sections/SalesSection";
import OrdersSection from "./sections/OrdersSection";
import ProductPerformanceSection from "./sections/ProductPerformanceSection";
import PaymentsSection from "./sections/PaymentsSection";
import InventorySection from "./InventorySection";
import BranchSelector from "../common/BranchSelector";
import TimeSeriesChart from "./sections/TimeSeriesChart";
import BranchPerformanceChart from "./sections/BranchPerformanceChart";

// Utilidades
import { formatPeriod } from "./utils/dashboardHelpers";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardRefactored = () => {
  const { token } = theme.useToken();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  // Estado local
  const [showInfoAlert, setShowInfoAlert] = useState(true);

  // Hooks personalizados
  const { filters, setFilters, branches } = useDashboardFilters();

  // Validación de filtros: si no hay sucursales o fechas, no se debe intentar cargar el dashboard
  const filtrosListos =
    filters &&
    Array.isArray(filters.branch_ids) &&
    filters.branch_ids.length > 0 &&
    filters.dates &&
    filters.dates.length === 2 &&
    filters.dates[0] &&
    filters.dates[1];

  // Hook de datos del dashboard
  const {
    summary,
    totalSummary,
    inventoryData,
    loading,
    fetchSummary,
    fetchInventoryData,
  } = useDashboardData(filters);

  const {
    modalVisible,
    modalType,
    modalData,
    modalLoading,
    handleCardClick,
    handleModalClose,
  } = useDashboardModals();

  // Generar título dinámico
  const getTitle = () => {
    const branchText =
      !filters?.branch_ids || filters.branch_ids.length === 0
        ? "Todas las sucursales"
        : filters.branch_ids.length === 1
        ? branches.find((b) => b.id === filters.branch_ids[0])?.business_name ||
          "Sucursal"
        : `${filters.branch_ids.length} sucursales`;

    return `Resumen • ${branchText}`;
  };

  const getSubtitle = () => {
    if (filters?.dates && filters.dates.length === 2) {
      return `Período: ${filters.dates[0].format(
        "DD/MM/YYYY"
      )} - ${filters.dates[1].format("DD/MM/YYYY")}`;
    }
    return "Selecciona un período para ver los datos";
  };

  const handleBranchChange = (newBranches) => {
    setFilters((prev) => ({ ...prev, branch_ids: newBranches }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters((prev) => ({ ...prev, dates: dates }));
  };

  // Mostrar loading si está cargando
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

  // Mostrar advertencia si no hay sucursales o fechas seleccionadas
  if (!filtrosListos) {
    return (
      <div style={{ padding: isMobile ? 16 : 24 }}>
        <Card>
          <Typography.Title level={4} style={{ color: "#faad14" }}>
            Filtros incompletos
          </Typography.Title>
          <Typography.Text>
            Debes seleccionar al menos una sucursal y un rango de fechas para
            ver el dashboard.
          </Typography.Text>
        </Card>
      </div>
    );
  }

  // Render principal del dashboard
  return (
    <div style={{ padding: isMobile ? 16 : 24 }}>
      {/* Estructura principal del dashboard */}
      <Flex vertical gap="large">
        {/* Header con filtros */}
        <Card size="small">
          <Flex
            justify="space-between"
            align="center"
            wrap={isMobile ? "wrap" : "nowrap"}
            gap={isMobile ? 8 : 16}
          >
            <div>
              <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
                {getTitle()}
              </Title>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {getSubtitle()}
              </Text>
            </div>
            <Space
              direction={isMobile ? "vertical" : "horizontal"}
              size="small"
            >
              <BranchSelector
                value={filters?.branch_ids || []}
                onChange={handleBranchChange}
                style={{ minWidth: isMobile ? "100%" : 200 }}
                size={isMobile ? "small" : "middle"}
              />
              <RangePicker
                value={filters?.dates}
                onChange={handleDateRangeChange}
                size={isMobile ? "small" : "middle"}
                style={{ minWidth: isMobile ? "100%" : 250 }}
              />
            </Space>
          </Flex>
        </Card>

        {/* Gráfico de series de tiempo */}
        <TimeSeriesChart data={totalSummary?.time_series} loading={loading} />

        {/* Gráfico de Rendimiento por Sucursal */}
        <BranchPerformanceChart data={summary} loading={loading} />

        {/* Sección de Ventas */}
        <SalesSection
          totalSummary={totalSummary}
          onCardClick={handleCardClick}
          isMobile={isMobile}
        />

        {/* Sección de Pedidos */}
        <OrdersSection
          totalSummary={totalSummary}
          onCardClick={handleCardClick}
          isMobile={isMobile}
        />

        {/* Sección de Pagos */}
        <PaymentsSection
          title="Pagos"
          payments={totalSummary.payments}
          isMobile={isMobile}
          onCardClick={handleCardClick}
        />

        {/* Sección de Rendimiento de Productos */}
        <ProductPerformanceSection data={totalSummary} />

        {/* Sección de Inventario */}
        <InventorySection inventoryData={inventoryData} isMobile={isMobile} />
      </Flex>
    </div>
  );
};

export default DashboardRefactored;
