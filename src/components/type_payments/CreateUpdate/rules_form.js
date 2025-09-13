export const rules = (state) => {
  const rules = {
    branch: [
      {
        required: true,
        message: "Selecciona una sucursal",
      },
    ],
    name: [
      {
        required: true,
        message: "Selecciona una opción",
      },
    ],
  };
  return rules;
};
