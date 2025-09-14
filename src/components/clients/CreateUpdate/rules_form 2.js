export const rules = (state) => {
  const rules = {
    name: [
      {
        required: true,
        message: "Ingresa el nombre",
      },
      {
        max: 300,
        message: "El nombre debe tener menos de 300 caracteres",
      },
    ],
    branch: [
      {
        required: true,
        message: "Selecciona una sucursal",
      },
    ],
    commercial_business: [
      {
        required: true,
        message: "Ingresa el giro comercial",
      },
    ],

    dni: [
      {
        required: true,
        message: "Ingresa el rut",
      },
    ],
    phone: [
      {
        required: true,
        message: "Ingresa el teléfono",
      },
      {
        min: 8,
        message: "El teléfono debe tener 8 dígitos",
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
    region: [
      {
        required: true,
        message: "Selecciona la región",
      },
    ],
    province: [
      {
        required: true,
        message: "Selecciona la provincia",
      },
    ],
    commune: [
      {
        required: true,
        message: "Selecciona la comuna",
      },
    ],
    address: [
      {
        required: true,
        message: "Ingresa la dirección",
      },
    ],
  };
  return rules;
};
