import { GET, POST, PATCH, DELETE } from "../config";

// === PAYMENT METHODS (Métodos de Pago) ===
export const payment_methods = {
  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.name) params.append("name__icontains", filters.name);
    if (filters.is_active !== undefined) params.append("is_active", filters.is_active);
    
    const response = await GET(`finance/api/payment-methods/?${params.toString()}`);
    return response.data;
  },

  list_active: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    
    const response = await GET(`finance/api/payment-methods/active/?${params.toString()}`);
    return response.data;
  },

  create: async (data) => {
    const response = await POST("finance/api/payment-methods/", data);
    return response;
  },

  update: async (id, data) => {
    const response = await PATCH(`finance/api/payment-methods/${id}/`, data);
    return response;
  },

  destroy: async (id) => {
    const response = await DELETE(`finance/api/payment-methods/${id}/`);
    return response;
  }
};

// === PAYMENTS (Pagos) ===
export const payments = {
  list: async (page = 1, filters = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    
    if (filters.order) params.append("order", filters.order);
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.status) params.append("status", filters.status);
    if (filters.payment_method) params.append("payment_method", filters.payment_method);
    
    const response = await GET(`finance/api/payments/?${params.toString()}`);
    return response.data;
  },

  by_order: async (order_id) => {
    const response = await GET(`finance/api/payments/by_order/?order_id=${order_id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await POST("finance/api/payments/", data);
    return response;
  },

  process: async (payment_id, data = {}) => {
    const response = await POST(`finance/api/payments/${payment_id}/process/`, data);
    return response;
  },

  refund: async (payment_id, data) => {
    const response = await POST(`finance/api/payments/${payment_id}/refund/`, data);
    return response;
  },

  summary: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.date_from) params.append("date_from", filters.date_from);
    if (filters.date_to) params.append("date_to", filters.date_to);
    
    const response = await GET(`finance/api/payments/summary/?${params.toString()}`);
    return response.data;
  },

  pending: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    
    const response = await GET(`finance/api/payments/pending/?${params.toString()}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await PATCH(`finance/api/payments/${id}/`, data);
    return response;
  },

  destroy: async (id) => {
    const response = await DELETE(`finance/api/payments/${id}/`);
    return response;
  }
};

// Mantener compatibilidad con API legacy (DEPRECATED)
export const legacy_payments = {
  create: async (data) => {
    console.warn("DEPRECATED: Usando legacy payments API. Migrar a finance/api/payments/");
    const response = await POST("sales/payments/", data);
    return response;
  },

  bulk_create: async (payments_array) => {
    console.warn("DEPRECATED: bulk_create no existe en sistema unificado. Crear pagos individuales.");
    // Crear pagos individuales usando el sistema unificado
    const results = [];
    for (const payment_data of payments_array) {
      try {
        const result = await payments.create(payment_data);
        results.push(result);
      } catch (error) {
        console.error("Error creando pago:", error);
        throw error;
      }
    }
    return { data: { results } };
  }
};

export const legacy_type_payments = {
  list: async (filters = {}) => {
    console.warn("DEPRECATED: Usando legacy type_payments. Migrar a payment_methods.");
    const params = new URLSearchParams();
    if (filters.branch) params.append("branch", filters.branch);
    if (filters.name) params.append("name__icontains", filters.name);
    if (filters.is_active !== undefined) params.append("is_active", filters.is_active);
    
    const response = await GET(`sales/type-payments/?${params.toString()}`);
    return response.data;
  }
};