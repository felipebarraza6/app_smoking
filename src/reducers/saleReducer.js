export const saleReducer = (state, action) => {
  switch (action.type) {
    case "add_branchs":
      var selected_branch = null;
      if (!selected_branch) {
        selected_branch = action.payload.length > 0 ? action.payload[0] : null;
      }

      return {
        ...state,
        branchs: {
          ...state.branchs,
          list: action.payload,
          count: action.payload.length,
          selected: selected_branch,
        },
      };

    case "add_clients":
      return {
        ...state,
        clients: {
          ...state.clients,
          list: action.payload,
          count: action.payload.length,
        },
      };

    case "selected_client":
      return {
        ...state,
        clients: {
          ...state.clients,
          selected: action.payload,
        },
      };

    case "add_drivers":
      return {
        ...state,
        drivers: {
          ...state.drivers,
          list: action.payload,
          count: action.payload.length,
        },
      };

    case "selected_driver":
      return {
        ...state,
        drivers: {
          ...state.drivers,
          selected: action.payload,
        },
      };

    case "add_products":
      return {
        ...state,
        products: {
          ...state.products,
          list: action.payload.results,
          count: action.payload.count,
          categories: action.payload.categories,
        },
      };

    case "add_selected_products":
      const existingProductIndex = state.products.selected_products.findIndex(
        (product) => product.id === action.payload.id
      );

      if (existingProductIndex !== -1) {
        const updatedSelectedProducts = state.products.selected_products.map(
          (product, index) =>
            index === existingProductIndex
              ? {
                  ...product,
                  quantity: product.quantity + action.payload.quantity,
                }
              : product
        );

        return {
          ...state,
          products: {
            ...state.products,
            selected_products: updatedSelectedProducts,
          },
        };
      } else {
        return {
          ...state,
          products: {
            ...state.products,
            selected_products: [
              ...state.products.selected_products,
              action.payload,
            ],
          },
        };
      }

    case "update_for_order":
      let api_data = action.payload;

      return {
        ...state,
        products: {
          ...state.products,
          selected_products: state.products.selected_products.map((product) => {
            const apiProduct = api_data.find(
              (p) => p.product.id === product.id
            );
            if (apiProduct) {
              return {
                ...product,
                id_order_product: apiProduct.id,
              };
            }
            return product;
          }),
        },
      };

    case "update_select_products":
      const updatedSelectedProducts = state.products.selected_products.map(
        (product) =>
          product.id === action.payload.id
            ? {
                ...product,
                quantity: action.payload.quantity,
                id: action.payload.id,
                product: action.payload.product,
              }
            : product
      );

      return {
        ...state,
        products: {
          ...state.products,
          selected_products: updatedSelectedProducts,
        },
      };

    case "remove_selected_products":
      const filteredSelectedProducts = state.products.selected_products.filter(
        (product) => product.id !== action.payload.id
      );

      return {
        ...state,
        products: {
          ...state.products,
          selected_products: filteredSelectedProducts,
        },
      };

    case "clear_selected_products":
      return {
        ...state,
        products: {
          ...state.products,
          selected_products: [],
        },
      };

    case "selected_branch":
      return {
        ...state,
        branchs: {
          ...state.branchs,
          selected: action.payload,
        },
        steps: {
          ...state.steps,
          current: 0,
        },
        products: {
          list: [],
          selected_products: [],
          categories: [],
          page: 1,
          count: 0,
          filters: {
            search: "",
            code: "",
            category: "",
          },
        },
        order: {
          create_id: null,
          created: null,
        },
        drivers: {
          list: [],
          selected: null,
          count: 0,
        },
        clients: {
          list: [],
          selected: null,
          count: 0,
          page: 1,
          filters: {
            search: "",
          },
          is_created: true,
        },

        payments: {
          list: [],
          selected: null,
          type_payments: [],
          paytotal: 0,
          count: 0,
          validate: false,
        },
      };

    case "change_page_products":
      return {
        ...state,
        products: {
          ...state.products,
          page: action.payload,
        },
      };

    case "update_list":
      return {
        ...state,
        countUpdate: state.countUpdate + 1,
      };

    case "set_current_step":
      return {
        ...state,
        steps: {
          ...state.steps,
          current: action.payload.current,
        },
      };

    case "select_to_edit":
      return {
        ...state,
        select_to_edit: action.payload.product,
      };

    case "change_page":
      return {
        ...state,
        list: {
          ...state.list,
          page: action.page,
        },
      };

    case "change_filters_products":
      return {
        ...state,
        products: {
          ...state.products,
          filters: {
            ...state.products.filters,
            ...action.payload,
          },
          page: 1,
        },
      };

    case "add_payment":
      return {
        ...state,
        payments: {
          ...state.payments,
          list: [...state.payments.list, action.payload],
          paytotal:
            parseInt(state.payments.paytotal) + parseInt(action.payload.amount),
        },
      };

    case "update_payment":
      return {
        ...state,
        payments: {
          ...state.payments,
          list: action.payload,
        },
      };
    case "clear_payments":
      return {
        ...state,
        payments: {
          ...state.payments,
          list: [],
          paytotal: 0,
        },
      };

    case "add_type_payments":
      return {
        ...state,
        payments: {
          ...state.payments,
          type_payments: action.payload,
        },
      };

    case "delete_payment":
      const paymentToDelete = state.payments.list[action.payload];
      const updatedPayments = state.payments.list.filter(
        (_, index) => index !== action.payload
      );
      const newPaytotal =
        parseInt(state.payments.paytotal) - parseInt(paymentToDelete.amount);

      return {
        ...state,
        payments: {
          ...state.payments,
          list: updatedPayments,
          paytotal: newPaytotal,
        },
      };

    case "add_order_created":
      return {
        ...state,
        order: {
          ...state.order,
          create_id: action.payload,
        },
      };

    case "add_draw_to_edit":
      const { id, client, registers, driver, address, branch_only_sale } =
        action.payload;

      return {
        ...state,
        branchs: {
          ...state.branchs,
          selected: client ? client.branch : branch_only_sale,
        },
        order: {
          ...state.order,
          create_id: id,
        },
        clients: {
          ...state.clients,
          selected: client,
          page: 1,
          filters: {
            search: "",
          },
          is_created: true,
        },
        products: {
          ...state.products,
          selected_products: registers,
        },
        drivers: driver
          ? {
              ...state.drivers,
              selected: {
                ...driver,
                address: address,
                charge_amount: driver.amount,
              },
            }
          : {
              ...state.drivers,
              selected: null,
            },
        payments: {
          list: [],
          selected: null,
          type_payments: [],
          paytotal: 0,
          count: 0,
          validate: false,
        },
        steps: {
          current: 0,
          loading: false,
        },
      };

    case "reset_all":
      return {
        ...state,

        products: {
          list: [],
          selected_products: [],
          categories: [],
          page: 1,
          count: 0,
          filters: {
            search: "",
            code: "",
            category: "",
          },
        },
        order: {
          create_id: null,
          created: null,
        },
        drivers: {
          list: [],
          selected: null,
          count: 0,
        },
        clients: {
          list: [],
          selected: null,
          count: 0,
          page: 1,
          filters: {
            search: "",
          },
          is_created: true,
        },

        payments: {
          list: [],
          selected: null,
          type_payments: [],
          paytotal: 0,
          count: 0,
          validate: false,
        },
        steps: {
          current: 0,
          loading: false,
        },
      };

    default:
      return state;
  }
};
