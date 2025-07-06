import React, { useEffect } from "react";
import { Col, Row } from "antd";
import { useDrivers } from "../hooks/useDrivers";
import { useNotifications } from "../hooks/useNotifications";
import List from "../components/drivers/List/ComponentWithHooks";
import CreateUpdate from "../components/drivers/CreateUpdate/ComponentWithHooks";
import AnimatedContainer from "./AnimatedContainer";
import { defaultGutterRow } from "../utils/layout";

/**
 * Container principal para la gestión de conductores usando hooks.
 * Reemplaza el patrón de controllers con hooks modernos de React.
 *
 * Ventajas:
 * - Lógica más limpia y reutilizable
 * - Mejor testing
 * - Estado local más fácil de manejar
 * - Patrón moderno de React
 * - Filtrado por sucursales del usuario
 */
const Drivers = () => {
  const {
    drivers,
    filters,
    selectedDriver,
    loading,
    error,
    userBranches,
    branchOptions,
    loadDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    changePage,
    changeFilters,
    resetFilters,
    selectDriverForEdit,
    clearSelection,
    clearError,
  } = useDrivers();

  const { handleOperationResult, showError } = useNotifications();

  const gutterRow = defaultGutterRow;

  // Cargar drivers al montar el componente
  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  // Mostrar errores si existen
  useEffect(() => {
    if (error) {
      showError("Error", error);
      clearError();
    }
  }, [error, showError, clearError]);

  // Handlers para el componente List
  const handleCreateDriver = async (values, form) => {
    const result = await createDriver(values, form);
    handleOperationResult(result);
  };

  const handleUpdateDriver = async (values, form) => {
    const result = await updateDriver(values, form);
    handleOperationResult(result);
  };

  const handleDeleteDriver = async (driver) => {
    const result = await deleteDriver(driver);
    handleOperationResult(result);
  };

  const handlePageChange = (page) => {
    changePage(page);
  };

  const handleFilterChange = (newFilters) => {
    changeFilters(newFilters);
  };

  const handleFilterReset = () => {
    resetFilters();
  };

  const handleSelectDriver = (driver) => {
    selectDriverForEdit(driver);
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <AnimatedContainer>
      <Row justify="space-around" gutter={gutterRow}>
        <Col xl={17} xs={24}>
          <List
            drivers={drivers}
            filters={filters}
            loading={loading}
            branchOptions={branchOptions}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onFilterReset={handleFilterReset}
            onSelectDriver={handleSelectDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        </Col>
        <Col xl={7}>
          <CreateUpdate
            selectedDriver={selectedDriver}
            loading={loading}
            userBranches={userBranches}
            onCreate={handleCreateDriver}
            onUpdate={handleUpdateDriver}
            onClearSelection={handleClearSelection}
          />
        </Col>
      </Row>
    </AnimatedContainer>
  );
};

export default Drivers;
