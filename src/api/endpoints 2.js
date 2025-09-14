import * as users from "./endpoints/users";
import * as products from "./endpoints/products";
import * as drivers from "./endpoints/drivers";
import * as clients from "./endpoints/clients";
import * as orders from "./endpoints/orders";
import * as payments from "./endpoints/payments";
import * as branchs from "./endpoints/branchs";
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
  },
  branchs: {
    list: branchs.list,
    create: branchs.create,
    update: branchs.update,
    destroy: branchs.destroy,
    retrieve: branchs.retrieve,
    my_branches: branchs.my_branches,
    my_branches_for_filters: branchs.my_branches_for_filters,
    get_branch_users: branchs.get_branch_users,
    invite_user: branchs.invite_user,
    update_user_role: branchs.update_user_role,
    remove_user: branchs.remove_user,
    toggle_user_status: branchs.toggle_user_status,
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
    total: drivers.list_all,
  },
  orders: {
    list: orders.list,
    retrieve: orders.retrieve,
    create: orders.create,
    update: orders.update,
    delete: orders.destroy,
    register_products: { ...orders.register_products },
  },
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
  dashboard: dashboardEndpoints,
};

export default api;
