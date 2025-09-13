import React, { useMemo } from "react";
import {
  Card,
  Typography,
  Flex,
  DatePicker,
  Space,
  Spin,
  Skeleton,
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
import DashboardSkeleton from "./DashboardSkeleton";

// Utilidades (comentado por no uso actual)
// import { formatPeriod } from "./utils/dashboardHelpers";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DashboardRefactored = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";

  // Estado local (comentado por no uso actual)
  // const [showInfoAlert, setShowInfoAlert] = useState(true);

  // Hooks personalizados
  const {
    filters,
    setFilters,
    branches,
    loading: branchesLoading,
  } = useDashboardFilters();

  // Validación de filtros: memorizada para evitar re-cálculos
  const filtrosListos = useMemo(() => {
    if (!filters) return false;
    
    // Verificar sucursales: debe haber al menos una y debe ser un array válido
    const hasBranches = filters.branch_ids && 
                       Array.isArray(filters.branch_ids) && 
                       filters.branch_ids.length > 0 &&
                       filters.branch_ids.every(id => id !== null && id !== undefined);
    
    // Verificar fechas: debe ser un array de 2 elementos válidos
    const hasDates = filters.dates && 
                    Array.isArray(filters.dates) && 
                    filters.dates.length === 2 &&
                    filters.dates[0] && 
                    filters.dates[1] &&
                    filters.dates[0].isValid && filters.dates[0].isValid() &&
                    filters.dates[1].isValid && filters.dates[1].isValid();
    
    return hasBranches && hasDates;
  }, [filters]);

  // Hook de datos del dashboard
  const {
    summary,
    totalSummary,
    inventoryData,
    loading,
    initialLoad,
    // fetchSummary, // Comentado por no uso actual
    // fetchInventoryData, // Comentado por no uso actual
  } = useDashboardData(filters);

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 DashboardRefactored render:", {
      filtrosListos,
      loading,
      initialLoad,
      hasData: !!totalSummary,
      filtersChanged: filters?.branch_ids?.length,
    });
  }

  const {
    // modalVisible, // Comentado por no uso actual
    // modalType, // Comentado por no uso actual
    // modalData, // Comentado por no uso actual
    // modalLoading, // Comentado por no uso actual
    handleCardClick,
    // handleModalClose, // Comentado por no uso actual
  } = useDashboardModals();

  // Generar título dinámico
  const getTitle = () => {
    // Restar 1 porque el primer elemento siempre es "Todas mis sucursales"
    const totalBranches = (branches?.length || 1) - 1;

    const branchText =
      !filters?.branch_ids || filters.branch_ids.length === 0
        ? `${totalBranches} sucursal${totalBranches !== 1 ? "es" : ""}`
        : filters.branch_ids.length === 1
        ? branches.find((b) => b.id === filters.branch_ids[0])?.business_name ||
          "Sucursal"
        : `${totalBranches} sucursal${totalBranches !== 1 ? "es" : ""}`;

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
    // Si newBranches es null o está vacío, usar todas las sucursales (excluyendo la opción "all")
    let branchIds;
    if (!newBranches || (Array.isArray(newBranches) && newBranches.length === 0)) {
      branchIds = branches.filter(b => !b.is_all_option).map((b) => b.id);
    } else if (Array.isArray(newBranches)) {
      branchIds = newBranches;
    } else {
      branchIds = [newBranches];
    }
    setFilters((prev) => ({ ...prev, branch_ids: branchIds }));
  };

  const handleDateRangeChange = (dates) => {
    setFilters((prev) => ({ ...prev, dates: dates }));
  };

  // Mostrar loading si está cargando datos del dashboard
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

  // Mostrar skeleton durante la carga inicial de sucursales y filtros
  if (branchesLoading || !filtrosListos) {
    return <DashboardSkeleton isMobile={isMobile} />;
  }

  // Render principal del dashboard
  return (
    <div
      style={{
        padding: isMobile ? 16 : 24,
        opacity: 1,
        transition: "opacity 0.4s ease-in-out",
      }}
    >
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
        <Card
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <div style={{ minHeight: "200px" }}>
              <TimeSeriesChart
                data={totalSummary?.time_series || []}
                loading={loading}
              />
            </div>
          )}
        </Card>

        {/* Gráfico de Rendimiento por Sucursal */}
        <Card
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div style={{ minHeight: "150px" }}>
              <BranchPerformanceChart data={summary} loading={loading} />
            </div>
          )}
        </Card>

        {/* Sección de Ventas */}
        <div
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ) : (
            <SalesSection
              totalSummary={totalSummary}
              onCardClick={handleCardClick}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* Sección de Pedidos */}
        <div
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ) : (
            <OrdersSection
              totalSummary={totalSummary}
              onCardClick={handleCardClick}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* Sección de Pagos */}
        <div
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Card>
              <Skeleton active paragraph={{ rows: 3 }} />
            </Card>
          ) : (
            <PaymentsSection
              title="Pagos"
              payments={totalSummary?.payments || []}
              isMobile={isMobile}
              onCardClick={handleCardClick}
            />
          )}
        </div>

        {/* Sección de Rendimiento de Productos */}
        <div
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Card>
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
          ) : (
            <ProductPerformanceSection data={totalSummary} />
          )}
        </div>

        {/* Sección de Inventario */}
        <div
          style={{
            transition: "opacity 0.3s ease-in-out",
            opacity: loading && !initialLoad ? 0.7 : 1,
          }}
        >
          {initialLoad ? (
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} />
            </Card>
          ) : (
            <InventorySection
              inventoryData={inventoryData}
              isMobile={isMobile}
            />
          )}
        </div>
      </Flex>
    </div>
  );
};

export default DashboardRefactored;
