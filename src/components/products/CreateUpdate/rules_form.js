import { message } from "antd";

export const rules = (state) => {
  const validateNumber = (_, value, text) => {
    if (isNaN(value)) {
      return Promise.reject(new Error(text));
    }
    return Promise.resolve();
  };

  const validateMinZero = (_, value, text) => {
    if (value <= 0) {
      return Promise.reject(new Error(text));
    }
    return Promise.resolve();
  };

  const rules = {
    name: [
      {
        required: true,
        message: "Ingresa el nombre",
      },
      {
        max: 300,
        message: "El nombre no puede tener más de 300 caracteres",
      },
    ],
    code: [
      {
        max: 100,
        message: "El código no puede tener más de 100 caracteres",
      },
    ],
    branch: [
      {
        required: true,
        message: "Selecciona una sucursal",
      },
    ],
    category: [
      {
        required: true,
        message: "Selecciona una categoría",
      },
    ],
    product_type: [
      {
        required: true,
        message: "Selecciona el tipo de producto",
      },
    ],
    price: [
      {
        required: true,
        message: "Ingresa el precio",
      },
      {
        validator: (_, value) =>
          validateNumber(_, value, "Precio debe ser un número"),
      },
      {
        validator: (_, value) =>
          validateMinZero(_, value, "Precio debe ser mayor a 0"),
      },
    ],
    price_internal: [
      {
        required: true,
        message: "Ingresa el costo",
      },
      {
        validator: (_, value) =>
          validateMinZero(_, value, "Costo debe ser mayor a 0"),
      },
      {
        validator: (_, value) =>
          validateNumber(_, value, "Costo debe ser un número"),
      },
    ],
    type_medition: [
      {
        required: true,
        message: "Selecciona una unidad de medida",
      },
    ],
    quantity: [
      {
        required: true,
        message: "Ingresa la cantidad",
      },
      {
        validator: (_, value) =>
          validateMinZero(_, value, "Cantidad debe ser mayor a 0"),
      },
      {
        validator: (_, value) =>
          validateNumber(_, value, "Cantidad debe ser un número"),
      },
    ],
    quantity_alert: [
      {
        validator: (_, value) =>
          validateMinZero(_, value, "Cantidad de alerta debe ser mayor a 0"),
      },
      {
        validator: (_, value) =>
          validateNumber(_, value, "Cantidad de alerta debe ser un número"),
      },
    ],
  };
  return rules;
};
