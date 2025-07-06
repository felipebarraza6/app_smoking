export const rules = (state) => {
  const rules = {
    business_name: [
      {
        required: true,
        message: "Ingresa el nombre de la tienda",
      },
      {
        max: 300,
        message: "El nombre de la tienda debe tener menos de 300 caracteres",
      },
    ],
    commercial_business: [
      {
        required: true,
        message: "Ingresa el giro comercial",
      },
    ],
    logo: [
      {
        required: true,
        message: "Ingresa el logo",
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
