/**
 * Reducer para gestión de mediciones en terreno
 * Maneja estado de equipos, clientes, lecturas y workflow de medición
 */

export const measurementsReducer = (state, action) => {
  switch (action.type) {
    // === EQUIPMENT ACTIONS ===
    case "SET_EQUIPMENT_LIST":
      return {
        ...state,
        equipment: {
          ...state.equipment,
          list: action.payload.results || action.payload,
          count: action.payload.count || action.payload.length
        }
      };

    case "SELECT_EQUIPMENT":
      return {
        ...state,
        equipment: {
          ...state.equipment,
          selected: action.payload
        }
      };

    case "UPDATE_EQUIPMENT_FILTERS":
      return {
        ...state,
        equipment: {
          ...state.equipment,
          filters: { ...state.equipment.filters, ...action.payload }
        }
      };

    // === CLIENTS ACTIONS ===
    case "SET_CLIENTS_LIST":
      return {
        ...state,
        clients: {
          ...state.clients,
          list: action.payload.results || action.payload,
          count: action.payload.count || action.payload.length,
          page: action.payload.page || state.clients.page
        }
      };

    case "SELECT_CLIENT":
      return {
        ...state,
        clients: {
          ...state.clients,
          selected: action.payload
        },
        workflow: {
          ...state.workflow,
          can_proceed: !!action.payload
        }
      };

    case "UPDATE_CLIENT_FILTERS":
      return {
        ...state,
        clients: {
          ...state.clients,
          filters: { ...state.clients.filters, ...action.payload }
        }
      };

    // === MEASUREMENTS ACTIONS ===
    case "SET_MEASUREMENTS_LIST":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          list: action.payload.results || action.payload,
          count: action.payload.count || action.payload.length,
          page: action.payload.page || state.measurements.page
        }
      };

    case "SET_CURRENT_MEASUREMENT":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          current: action.payload
        }
      };

    case "CREATE_MEASUREMENT_SUCCESS":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          create_id: action.payload.id,
          current: action.payload
        },
        workflow: {
          ...state.workflow,
          current_step: 1
        }
      };

    case "UPDATE_MEASUREMENT_FILTERS":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          filters: { ...state.measurements.filters, ...action.payload }
        }
      };

    // === READINGS ACTIONS ===
    case "SET_CURRENT_READING":
      const consumption = action.payload.current_reading - 
                         (action.payload.previous_reading || 0);
      const total_amount = consumption * (action.payload.unit_price || 0);

      return {
        ...state,
        readings: {
          ...state.readings,
          ...action.payload,
          consumption,
          total_amount
        },
        workflow: {
          ...state.workflow,
          can_proceed: !!action.payload.current_reading
        }
      };

    case "ADD_READING_PHOTO":
      return {
        ...state,
        readings: {
          ...state.readings,
          photos: [...state.readings.photos, action.payload]
        }
      };

    case "REMOVE_READING_PHOTO":
      return {
        ...state,
        readings: {
          ...state.readings,
          photos: state.readings.photos.filter((_, index) => index !== action.payload)
        }
      };

    case "UPDATE_READING_NOTES":
      return {
        ...state,
        readings: {
          ...state.readings,
          notes: action.payload
        }
      };

    // === LOCATION ACTIONS ===
    case "SET_CURRENT_LOCATION":
      return {
        ...state,
        locations: {
          ...state.locations,
          current_position: action.payload,
          gps_enabled: true
        }
      };

    case "SET_GPS_ERROR":
      return {
        ...state,
        locations: {
          ...state.locations,
          gps_enabled: false,
          current_position: null
        },
        workflow: {
          ...state.workflow,
          error: action.payload
        }
      };

    // === TECHNICIANS ACTIONS ===
    case "SET_TECHNICIANS_LIST":
      return {
        ...state,
        technicians: {
          ...state.technicians,
          list: action.payload.results || action.payload,
          count: action.payload.count || action.payload.length
        }
      };

    case "SELECT_TECHNICIAN":
      return {
        ...state,
        technicians: {
          ...state.technicians,
          selected: action.payload
        }
      };

    // === WORKFLOW ACTIONS ===
    case "SET_WORKFLOW_STEP":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          current_step: action.payload,
          error: null
        }
      };

    case "NEXT_WORKFLOW_STEP":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          current_step: Math.min(state.workflow.current_step + 1, 3),
          error: null
        }
      };

    case "PREVIOUS_WORKFLOW_STEP":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          current_step: Math.max(state.workflow.current_step - 1, 0),
          error: null
        }
      };

    case "SET_WORKFLOW_LOADING":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          loading: action.payload
        }
      };

    case "SET_WORKFLOW_ERROR":
      return {
        ...state,
        workflow: {
          ...state.workflow,
          error: action.payload,
          loading: false
        }
      };

    case "COMPLETE_MEASUREMENT":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          current: { ...state.measurements.current, status: "COMPLETED" }
        },
        workflow: {
          ...state.workflow,
          current_step: 3,
          can_proceed: true
        }
      };

    // === SETTINGS ACTIONS ===
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    // === RESET ACTIONS ===
    case "RESET_MEASUREMENT_FORM":
      return {
        ...state,
        measurements: {
          ...state.measurements,
          current: null,
          create_id: null
        },
        readings: {
          current_reading: null,
          previous_reading: null,
          consumption: 0,
          unit_price: 0,
          total_amount: 0,
          photos: [],
          notes: ""
        },
        clients: {
          ...state.clients,
          selected: null
        },
        equipment: {
          ...state.equipment,
          selected: null
        },
        workflow: {
          current_step: 0,
          loading: false,
          error: null,
          can_proceed: false
        }
      };

    case "CLEAR_ALL":
      return {
        ...state,
        measurements: { ...state.measurements, list: [], count: 0 },
        clients: { ...state.clients, list: [], count: 0 },
        equipment: { ...state.equipment, list: [], count: 0 },
        technicians: { ...state.technicians, list: [], count: 0 }
      };

    default:
      return state;
  }
};