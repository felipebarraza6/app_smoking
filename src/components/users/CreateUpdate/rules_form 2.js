import { message } from "antd";

export const rules = (state) => {
  const rules = {
    first_name: [
      {
        required: true,
        message: "Ingresa el nombre",
      },
    ],
    last_name: [
      {
        required: true,
        message: "Ingresa el apellido",
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
    dni: [
      {
        required: true,
        message: "Ingresa el rut",
      },
    ],
    type_user: [
      {
        required: true,
        message: "Selecciona un tipo de usuario",
      },
    ],
    password: [
      {
        required: state.select_to_edit ? false : true,
        message: "Ingresa la contraseña",
      },
      { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
    ],
    password_confirmation: [
      {
        required: state.select_to_edit ? false : true,
        message: "Ingresa la confirmación de contraseña",
      },
      { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
    ],
  };
  return rules;
};
