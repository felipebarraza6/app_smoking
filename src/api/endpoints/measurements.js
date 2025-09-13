import { GET, POST, PATCH, DELETE } from "../config";

/**
 * API endpoints para mediciones de materias primas
 * Usa las APIs específicas de mediciones del backend
 */

// === TIPOS DE MEDICIÓN ===
export const measurementTypes = {
  list: async () => {
    const response = await GET("inventory/measurement-types/");
    return response.data;
  },
  
  create: async (data) => {
    const response = await POST("inventory/measurement-types/", data);
    return response;
  },
  
  update: async (id, data) => {
    const response = await PATCH(`inventory/measurement-types/${id}/`, data);
    return response;
  },
  
  delete: async (id) => {
    const response = await DELETE(`inventory/measurement-types/${id}/`);
    return response;
  },
  
  getActive: async () => {
    const response = await GET("inventory/measurement-types/active_types/");
    return response.data;
  }
};

// === PUNTOS DE MEDICIÓN ===
export const measurementPoints = {
  list: async (filters = {}) => {
    let url = "inventory/measurement-points/";
    const params = new URLSearchParams();
    
    if (filters.branch_id) {
      params.append('branch', filters.branch_id);
    }
    if (filters.measurement_type) {
      params.append('measurement_type', filters.measurement_type);
    }
    if (filters.is_active !== undefined) {
      params.append('is_active', filters.is_active);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await GET(url);
    return response.data;
  },
  
  get: async (id) => {
    const response = await GET(`inventory/measurement-points/${id}/`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await POST("inventory/measurement-points/", data);
    return response;
  },
  
  update: async (id, data) => {
    const response = await PATCH(`inventory/measurement-points/${id}/`, data);
    return response;
  },
  
  delete: async (id) => {
    const response = await DELETE(`inventory/measurement-points/${id}/`);
    return response;
  },
  
  getByBranch: async (branchId) => {
    const response = await GET(`inventory/measurement-points/by_branch/?branch_id=${branchId}`);
    return response.data;
  },
  
  getConsumptionSummary: async (pointId, filters = {}) => {
    let url = `inventory/measurement-points/${pointId}/consumption_summary/`;
    const params = new URLSearchParams();
    
    if (filters.days) {
      params.append('days', filters.days);
    }
    if (filters.start_date) {
      params.append('start_date', filters.start_date);
    }
    if (filters.end_date) {
      params.append('end_date', filters.end_date);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await GET(url);
    return response.data;
  },
  
  getMeasurementHistory: async (pointId, days = 30) => {
    const response = await GET(
      `inventory/measurement-points/${pointId}/measurement_history/?days=${days}`
    );
    return response.data;
  }
};

// === MEDICIONES DE MATERIAS PRIMAS ===
export const list = async (page = 1, filters = {}) => {
  let url = `inventory/measurements/?page=${page}`;
  
  if (filters.measurement_point) {
    url += `&measurement_point=${filters.measurement_point}`;
  }
  if (filters.product) {
    url += `&product=${filters.product}`;
  }
  if (filters.reader) {
    url += `&reader=${filters.reader}`;
  }
  if (filters.is_verified !== undefined) {
    url += `&is_verified=${filters.is_verified}`;
  }
  if (filters.search) {
    url += `&search=${filters.search}`;
  }
  if (filters.start_date) {
    url += `&measurement_date__gte=${filters.start_date}`;
  }
  if (filters.end_date) {
    url += `&measurement_date__lte=${filters.end_date}`;
  }
  
  const response = await GET(url);
  return response.data;
};

export const retrieve = async (id) => {
  const response = await GET(`inventory/measurements/${id}/`);
  return response.data;
};

export const create = async (data) => {
  const response = await POST("inventory/measurements/", data);
  return response;
};

export const bulkCreate = async (measurements) => {
  const response = await POST("inventory/measurements/bulk_create/", {
    measurements: measurements
  });
  return response;
};

export const update = async (id, data) => {
  const response = await PATCH(`inventory/measurements/${id}/`, data);
  return response;
};

export const destroy = async (id) => {
  const response = await DELETE(`inventory/measurements/${id}/`);
  return response;
};

// === FUNCIONES ESPECÍFICAS DE MEDICIONES ===
export const verify = async (measurementIds, notes = '') => {
  const response = await POST("inventory/measurements/verify_measurements/", {
    measurement_ids: measurementIds,
    verification_notes: notes
  });
  return response;
};

export const getPendingVerification = async () => {
  const response = await GET("inventory/measurements/pending_verification/");
  return response.data;
};

export const getMyMeasurements = async () => {
  const response = await GET("inventory/measurements/my_measurements/");
  return response.data;
};

export const getDashboard = async (filters = {}) => {
  let url = "inventory/measurements/dashboard/";
  const params = new URLSearchParams();
  
  if (filters.branch_id) {
    params.append('branch_id', filters.branch_id);
  }
  if (filters.days) {
    params.append('days', filters.days);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await GET(url);
  return response.data;
};

export const getConsumptionTrends = async (filters = {}) => {
  let url = "inventory/measurements/consumption_trends/";
  const params = new URLSearchParams();
  
  if (filters.branch_id) {
    params.append('branch_id', filters.branch_id);
  }
  if (filters.days) {
    params.append('days', filters.days);
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await GET(url);
  return response.data;
};

// === INVENTARIO - DESCUENTO AUTOMÁTICO DE STOCK ===
export const inventory = {
  validateStockAvailability: async (items) => {
    const response = await POST("inventory/product-inventory/validate_stock_availability/", {
      items: items
    });
    return response;
  },
  
  bulkDeductStock: async (items, orderId, orderType = 'Order') => {
    const response = await POST("inventory/product-inventory/bulk_deduct_stock/", {
      items: items,
      order_id: orderId,
      order_type: orderType
    });
    return response;
  },
  
  getStockAlerts: async () => {
    const response = await GET("inventory/product-inventory/stock_alerts/");
    return response.data;
  }
};

// === FUNCIONES HELPER ===
export const measurementHelpers = {
  formatQuantity: (quantity, unit) => {
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity)) return '0';
    
    // Formatear según la unidad
    switch (unit) {
      case 'CUBIC_METERS':
        return `${numQuantity.toFixed(3)} m³`;
      case 'LITERS':
        return `${numQuantity.toFixed(2)} L`;
      case 'KILOGRAMS':
        return `${numQuantity.toFixed(2)} kg`;
      case 'TONS':
        return `${numQuantity.toFixed(3)} t`;
      case 'GALLONS':
        return `${numQuantity.toFixed(2)} gal`;
      default:
        return `${numQuantity.toFixed(2)} ${unit}`;
    }
  },
  
  calculateValue: (consumption, price) => {
    const numConsumption = parseFloat(consumption);
    const numPrice = parseFloat(price);
    
    if (isNaN(numConsumption) || isNaN(numPrice)) return 0;
    
    return numConsumption * numPrice;
  },
  
  formatCurrency: (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '$0';
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(numAmount);
  },
  
  validateMeasurement: (measurement) => {
    const errors = [];
    
    if (!measurement.measurement_point) {
      errors.push('Punto de medición es requerido');
    }
    
    if (!measurement.product) {
      errors.push('Producto es requerido');
    }
    
    if (!measurement.measurement_date) {
      errors.push('Fecha de medición es requerida');
    }
    
    if (!measurement.quantity_measured || measurement.quantity_measured <= 0) {
      errors.push('Cantidad medida debe ser mayor a 0');
    }
    
    // Validar fecha no muy antigua (30 días)
    if (measurement.measurement_date) {
      const measurementDate = new Date(measurement.measurement_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (measurementDate < thirtyDaysAgo) {
        errors.push('No se pueden registrar mediciones con más de 30 días de antigüedad');
      }
    }
    
    return errors;
  },
  
  getUnitOptions: () => [
    { value: 'CUBIC_METERS', label: 'Metros Cúbicos (m³)', symbol: 'm³' },
    { value: 'LITERS', label: 'Litros (L)', symbol: 'L' },
    { value: 'KILOGRAMS', label: 'Kilogramos (kg)', symbol: 'kg' },
    { value: 'TONS', label: 'Toneladas (t)', symbol: 't' },
    { value: 'GALLONS', label: 'Galones (gal)', symbol: 'gal' },
    { value: 'CUSTOM', label: 'Personalizado', symbol: '' }
  ],
  
  getStatusColor: (status) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  }
};

// === LEGACY EXPORTS PARA COMPATIBILIDAD ===
// Mantener temporalmente hasta migrar todos los componentes
export const readings = {
  create: create,
  update: update,
  destroy: destroy,
  list: (page, orderId) => list(page, { measurement_point: orderId })
};

export const equipment = {
  list: async (page, filters) => {
    // Mock data para mantener compatibilidad
    return {
      results: [
        {
          id: 1,
          name: "Caudalímetro Principal",
          equipment_code: "CAU001",
          equipment_type: "MEASUREMENT",
          status: "AVAILABLE",
          manufacturer: "Siemens",
          model: "WFC-100"
        }
      ],
      count: 1
    };
  },
  retrieve: async (id) => ({
    id: id,
    name: "Caudalímetro Mock",
    equipment_code: "CAU" + id,
    equipment_type: "MEASUREMENT"
  })
};

export const service_clients = {
  list: async (page, filters = {}) => {
    // Redirigir a la API estándar de clientes
    try {
      const { list: clientsList } = await import('./clients');
      const response = await clientsList(page, filters);
      
      // Agregar datos mock de servicios a los clientes
      const clientsWithServices = response?.results?.map(client => ({
        ...client,
        service_type: "WATER",
        last_reading_value: Math.floor(Math.random() * 1000),
        last_reading_date: "2024-01-15",
        service_rate: 1500,
        service_product_id: 1
      })) || [];
      
      return {
        results: clientsWithServices,
        count: response?.count || 0,
        page: page
      };
    } catch (error) {
      return { results: [], count: 0 };
    }
  }
};

export const tax_documents = {
  generate_from_order: async (data) => {
    console.log("Generando documento mock:", data);
    return {
      status: 201,
      data: {
        id: Date.now(),
        document_type: data.document_type,
        folio: Math.floor(Math.random() * 10000),
        customer_name: data.customer_name,
        total_amount: data.total_amount || 0,
        status: "ISSUED"
      }
    };
  },
  list: async (page, filters) => ({ results: [], count: 0 })
};

export const technicians = {
  list: async (page, filters) => ({
    results: [
      {
        id: 1,
        name: "Juan Pérez",
        dni: "12345678-9",
        role: "Técnico de Medición"
      }
    ],
    count: 1
  })
};