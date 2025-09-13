import { create, update } from "../api/endpoints/orders";
import {
  getResources,
  getProducts,
  getClients,
  getDrivers,
} from "./sales/list_resources";

const createSale = async (values, dispatch, form, notification) => {
  await create(values)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      notification.success({ message: " creado correctamente." });
      form.resetFields();
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message:
          "Errores al crear la nueva venta, revisa tus datos ingresados.",
        description: (
          <ul>
            {errorList.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ),
      });
    });
};

const updateSale = async (values, state, dispatch, form, notification) => {
  var notified = true;

  await update(state.select_to_edit, values)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      if (notified) {
        notification.success({ message: "Venta actualizado correctamente." });
      }
      dispatch({ type: "select_to_edit", payload: { user: null } });
      form.resetFields();
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al actualizar la venta.",
        description: (
          <ul>
            {errorList.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ),
      });
    });
};

export const controller = {
  create: createSale,
  update: updateSale,
  get_resources: getResources,
  get_products: getProducts,
  get_clients: getClients,
  get_drivers: getDrivers,
};
