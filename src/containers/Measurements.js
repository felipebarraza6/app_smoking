import React, { createContext, useReducer } from "react";
import MeasurementMain from "../components/measurements/MeasurementMain";
import { measurementsReducer } from "../reducers/measurementsReducer";
import AnimatedContainer from "./AnimatedContainer";

/**
 * Container principal para gestión de mediciones en terreno.
 * Adaptado del sistema de órdenes para mediciones de servicios (agua, gas, etc.)
 * 
 * Estado incluye:
 * - equipment: Caudalímetros y equipos de medición
 * - measurements: Registros de mediciones
 * - clients: Clientes con servicios 
 * - locations: Ubicaciones de medición
 * - readings: Lecturas históricas
 */

export const MeasurementsContext = createContext();

const Measurements = () => {
  const initialState = {
    // Equipos de medición (caudalímetros, etc.)
    equipment: {
      list: [],
      selected: null,
      count: 0,
      filters: {
        search: "",
        equipment_type: "MEASUREMENT",
        status: "AVAILABLE"
      }
    },
    
    // Clientes con servicios
    clients: {
      list: [],
      selected: null,
      count: 0,
      page: 1,
      filters: {
        search: "",
        name: "", // Para el endpoint
        service_type: "" // Inicializar vacío para mostrar todos
      }
    },

    // Mediciones (Orders adaptadas)
    measurements: {
      list: [],
      current: null,
      create_id: null,
      readings: [],
      count: 0,
      page: 1,
      filters: {
        status: "PENDING", // PENDING, COMPLETED, INVOICED, PAID
        date_from: null,
        date_to: null,
        technician: null
      }
    },

    // Ubicaciones de medición
    locations: {
      list: [],
      selected: null,
      current_position: null,
      gps_enabled: false
    },

    // Técnicos (ex-drivers)
    technicians: {
      list: [],
      selected: null,
      count: 0,
      current_route: []
    },

    // Lecturas y registros
    readings: {
      current_reading: null,
      previous_reading: null,
      consumption: 0,
      unit_price: 0,
      total_amount: 0,
      photos: [],
      notes: ""
    },

    // Workflow de medición
    workflow: {
      current_step: 0, // 0: Select Client, 1: Take Reading, 2: Confirm, 3: Complete
      loading: false,
      error: null,
      can_proceed: false
    },

    // Configuración
    settings: {
      auto_calculate: true,
      require_photos: true,
      gps_required: true,
      offline_mode: false
    }
  };

  const [state, dispatch] = useReducer(measurementsReducer, initialState);

  return (
    <MeasurementsContext.Provider value={{ state, dispatch }}>
      <AnimatedContainer>
        <MeasurementMain />
      </AnimatedContainer>
    </MeasurementsContext.Provider>
  );
};

export default Measurements;