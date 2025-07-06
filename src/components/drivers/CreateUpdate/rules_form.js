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
        message: "Ingresa el nombre del conductor",
      },
      {
        max: 300,
        message: "El nombre debe tener menos de 300 caracteres",
      },
    ],
    vehicle_plate: [
      {
        required: true,
        message: "Ingresa la patente",
      },
    ],

    dni: [
      {
        required: true,
        message: "Ingresa el rut",
      },
    ],
    phone_number: [
      {
        required: true,
        message: "Ingresa el teléfono",
      },
      {
        min: 8,
        message: "El teléfono debe tener 8 dígitos",
      },
    ],
    amount: [
      {
        required: true,
        message: "Ingresa el monto",
      },
      {
        validator: (_, value) => {
          if (value) {
            return validateMinZero(_, value, "El monto debe ser mayor a 0");
          }
          return Promise.resolve();
        },
      },
      {
        validator: (_, value) => {
          if (value) {
            return validateNumber(_, value, "El monto debe ser un número");
          }
          return Promise.resolve();
        },
      },
    ],
    email: [
      {
        required: true,
        message: "Ingresa el email",
      },
      {
        type: "email",
        message: "Ingresa un email válido",
      },
    ],
    branch: [
      {
        required: true,
        message: "Selecciona una sucursal",
      },
    ],
  };
  return rules;
};
