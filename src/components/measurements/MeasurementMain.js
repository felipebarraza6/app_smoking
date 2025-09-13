/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { Card, Steps, Button, Row, Col, Alert, Space } from "antd";
import { motion } from "framer-motion";
import {
  UserOutlined,
  ReadOutlined,
  CheckCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";

import { MeasurementsContext } from "../../containers/Measurements";
import ClientSelection from "./steps/ClientSelection";
import TakeReading from "./steps/TakeReading";
import ConfirmMeasurement from "./steps/ConfirmMeasurement";
import CompletedMeasurement from "./steps/CompletedMeasurement";

/**
 * Componente principal para toma de mediciones en terreno
 * Workflow de 4 pasos:
 * 1. Seleccionar Cliente y Servicio
 * 2. Tomar Lectura del Medidor
 * 3. Confirmar Medición y Datos
 * 4. Medición Completada - Generar Documento
 */

const MeasurementMain = () => {
  const { state, dispatch } = useContext(MeasurementsContext);
  const { workflow, settings } = state;

  // Configuración de pasos
  const steps = [
    {
      title: "Cliente",
      description: "Seleccionar cliente y servicio",
      icon: <UserOutlined />,
      content: <ClientSelection />
    },
    {
      title: "Lectura",
      description: "Tomar lectura del medidor",
      icon: <ReadOutlined />,
      content: <TakeReading />
    },
    {
      title: "Confirmar",
      description: "Revisar y confirmar datos",
      icon: <CheckCircleOutlined />,
      content: <ConfirmMeasurement />
    },
    {
      title: "Completado",
      description: "Medición registrada",
      icon: <FileTextOutlined />,
      content: <CompletedMeasurement />
    }
  ];

  // Funciones de navegación
  const handleNext = () => {
    if (canProceedToNext()) {
      dispatch({ type: "NEXT_WORKFLOW_STEP" });
    }
  };

  const handlePrevious = () => {
    dispatch({ type: "PREVIOUS_WORKFLOW_STEP" });
  };

  const handleReset = () => {
    dispatch({ type: "RESET_MEASUREMENT_FORM" });
  };

  // Validaciones para avanzar
  const canProceedToNext = () => {
    switch (workflow.current_step) {
      case 0: // Cliente seleccionado
        return !!state.clients.selected;
      case 1: // Lectura tomada
        return !!state.readings.current_reading && 
               (!settings.require_photos || state.readings.photos.length > 0) &&
               (!settings.gps_required || !!state.locations.current_position);
      case 2: // Confirmación
        return true;
      default:
        return false;
    }
  };

  // Efectos
  useEffect(() => {
    // Inicializar GPS si es requerido
    if (settings.gps_required) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          dispatch({
            type: "SET_CURRENT_LOCATION",
            payload: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString()
            }
          });
        },
        (error) => {
          dispatch({
            type: "SET_GPS_ERROR",
            payload: "No se pudo obtener la ubicación GPS"
          });
        }
      );
    }
  }, [settings.gps_required, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title="Toma de Mediciones en Terreno"
        extra={
          workflow.current_step < 3 && (
            <Button 
              type="link" 
              onClick={handleReset}
              disabled={workflow.loading}
            >
              Reiniciar
            </Button>
          )
        }
      >
        {/* Indicador de pasos */}
        <Steps
          current={workflow.current_step}
          status={workflow.error ? "error" : "process"}
          style={{ marginBottom: 32 }}
        >
          {steps.map((step, index) => (
            <Steps.Step
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Steps>

        {/* Mensaje de error */}
        {workflow.error && (
          <Alert
            message="Error en el proceso"
            description={workflow.error}
            type="error"
            closable
            style={{ marginBottom: 16 }}
            onClose={() => dispatch({ type: "SET_WORKFLOW_ERROR", payload: null })}
          />
        )}

        {/* Contenido del paso actual */}
        <div style={{ minHeight: 400 }}>
          {steps[workflow.current_step]?.content}
        </div>

        {/* Botones de navegación */}
        <Row justify="end" style={{ marginTop: 24 }}>
          <Col>
            <Space>
              {workflow.current_step > 0 && workflow.current_step < 3 && (
                <Button 
                  onClick={handlePrevious}
                  disabled={workflow.loading}
                >
                  Anterior
                </Button>
              )}
              
              {workflow.current_step < 2 && (
                <Button 
                  type="primary"
                  onClick={handleNext}
                  loading={workflow.loading}
                  disabled={!canProceedToNext()}
                >
                  Siguiente
                </Button>
              )}
              
              {workflow.current_step === 3 && (
                <Button 
                  type="primary"
                  onClick={handleReset}
                >
                  Nueva Medición
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );
};

export default MeasurementMain;