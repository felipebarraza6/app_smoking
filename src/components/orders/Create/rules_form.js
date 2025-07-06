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
    driver: [
      {
        required: true,
        message: "Selecciona un conductor",
      },
    ],
    charge_amount: [
      {
        required: true,
        message: "Ingresa un monto",
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
    address: [
      {
        required: true,
        message: "Ingresa una dirección",
      },
      {
        max: 300,
        message: "La dirección no puede tener más de 300 caracteres",
      },
    ],
    name: [
      {
        required: true,
        message: "Ingresa un nombre",
      },
      {
        max: 300,
        message: "El nombre no puede tener más de 300 caracteres",
      },
    ],
    phone: [
      {
        max: 20,
        message: "El teléfono no puede tener más de 20 caracteres",
      },
      {
        validator: (_, value) => {
          if (value) {
            return validateNumber(_, value, "El teléfono debe ser un número");
          }
          return Promise.resolve();
        },
      },
    ],
    email: [
      {
        type: "email",
        message: "Ingresa un email válido",
      },
      {
        max: 100,
        message: "El email no puede tener más de 100 caracteres",
      },
    ],
  };
  return rules;
};
