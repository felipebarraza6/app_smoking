import * as users from "./endpoints/users";
import * as products from "./endpoints/products";
import * as drivers from "./endpoints/drivers";
import * as clients from "./endpoints/clients";
import * as orders from "./endpoints/orders";
import * as payments from "./endpoints/payments";
import * as finance from "./endpoints/finance";
import * as branchs from "./endpoints/branchs";
import * as measurements from "./endpoints/measurements";
import dashboardEndpoints from "./endpoints/dashboard";

const api = {
  auth: {
    login: users.login,
    get_profile: users.get_profile,
    forgot_password: users.forgot_password,
    reset_password_confirm: users.reset_password_confirm,
  },
  users: {
    list: users.list,
    create: users.create,
    signup: users.signup,
    update: users.update,
    delete: users.destroy,
    retrieve: users.retrieve,
    change_password: users.change_password,
    toggle_user_status: users.toggle_user_status,
    change_user_role: users.change_user_role,
    toggle_branch_assignment_status: users.toggle_branch_assignment_status,
    change_assignment_role: users.change_assignment_role,
  },
  branchs: {
    list: branchs.list,
    create: branchs.create,
    update: branchs.update,
    destroy: branchs.destroy,
    retrieve: branchs.retrieve,
    my_branches: branchs.my_branches,
    my_branches_for_filters: branchs.my_branches_for_filters,
    my_branches_select: branchs.my_branches_select,
    get_branch_users: branchs.get_branch_users,
    invite_user: branchs.invite_user,
    update_user_role: branchs.update_user_role,
    remove_user: branchs.remove_user,
    toggle_user_status: branchs.toggle_user_status,
    change_user_branch: branchs.change_user_branch,
    my_invitations: branchs.my_invitations,
    accept_invitation: branchs.accept_invitation,
    reject_invitation: branchs.reject_invitation,
    leave_branch: branchs.leave_branch,
    transfer_ownership: branchs.transfer_ownership,
    get_available_users: branchs.get_available_users,
    assign_existing_user: branchs.assign_existing_user,
  },
  products: {
    list: products.list,
    create: products.create,
    update: products.update,
    delete: products.destroy,
    categories: { ...products.categories },
  },
  clients: {
    list: clients.list,
    create: clients.create,
    update: clients.update,
    delete: clients.destroy,
    total: clients.list_all,
    contacts: { ...clients.contacts },
  },
  drivers: {
    list: drivers.list,
    create: drivers.create,
    update: drivers.update,
    delete: drivers.destroy,
    retrieve: drivers.retrieve,
    total: drivers.list_all,
    // Nuevos endpoints del sistema DriverProfile
    get_available_drivers: drivers.get_available_drivers,
    calculate_delivery_cost: drivers.calculate_delivery_cost,
    get_driver_performance: drivers.get_driver_performance,
    update_driver_availability: drivers.update_driver_availability,
    get_driver_dashboard: drivers.get_driver_dashboard,
  },
  orders: {
    list: orders.list,
    retrieve: orders.retrieve,
    create: orders.create,
    update: orders.update,
    delete: orders.destroy,
    register_products: { ...orders.register_products },
  },
  // LEGACY - DEPRECATED (mantener temporalmente para compatibilidad)
  payments: {
    list: payments.list,
    create: payments.create,
    update: payments.update,
    delete: payments.destroy,
    type_payments: { ...payments.type_payments },
    bulk: {
      create: payments.create_bulk,
    },
  },

  // NUEVO SISTEMA UNIFICADO DE PAGOS
  finance: {
    payments: { ...finance.payments },
    payment_methods: { ...finance.payment_methods },
    // Mantener aliases legacy temporalmente
    legacy: {
      payments: { ...finance.legacy_payments },
      type_payments: { ...finance.legacy_type_payments },
    },
  },
  dashboard: dashboardEndpoints,
  measurements: {
    // API principal de mediciones
    list: measurements.list,
    retrieve: measurements.retrieve,
    create: measurements.create,
    update: measurements.update,
    delete: measurements.destroy,
    bulkCreate: measurements.bulkCreate,
    verify: measurements.verify,
    getPendingVerification: measurements.getPendingVerification,
    getMyMeasurements: measurements.getMyMeasurements,
    getDashboard: measurements.getDashboard,
    getConsumptionTrends: measurements.getConsumptionTrends,

    // Tipos de medición
    measurementTypes: { ...measurements.measurementTypes },

    // Puntos de medición
    measurementPoints: { ...measurements.measurementPoints },

    // Inventario - descuento automático
    inventory: { ...measurements.inventory },

    // Funciones helper
    helpers: { ...measurements.measurementHelpers },

    // Legacy compatibility - mantener hasta migración completa
    readings: { ...measurements.readings },
    equipment: { ...measurements.equipment },
    service_clients: { ...measurements.service_clients },
    tax_documents: { ...measurements.tax_documents },
    technicians: { ...measurements.technicians },
  },
};

export default api;
