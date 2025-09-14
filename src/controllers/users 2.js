import { message } from "antd";
import {
  create,
  update,
  list,
  destroy,
  change_password,
  signup,
} from "../api/endpoints/users";
import { invite_user } from "../api/endpoints/branchs";

import { postLogin } from "./users/auth";
import { selectUser, createOrClear } from "./users/create_update_form";
import { changePage } from "./users/list_table";

const createUser = async (values, dispatch, form, notification) => {
  try {
    // Validar que se haya seleccionado una sucursal y rol
    if (!values.branch_id || !values.role) {
      notification.error({
        message: "Datos incompletos",
        description: "Debes seleccionar una sucursal y un rol para el usuario.",
      });
      return;
    }

    // Preparar datos para el endpoint signup
    const signupData = {
      ...values,
      type_user: values.type_user || "CL", // Valor por defecto del modelo User
      password_confirmation:
        values.password_confirmation || values.password_validation, // Manejar ambos casos
      role: values.role || "VIEWER", // Valor por defecto si no viene
      is_active: values.is_active !== undefined ? values.is_active : true,
      username:
        values.username ||
        values.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, ""), // Generar username desde email
    };

    // Limpiar campos que no deben ir al backend
    delete signupData.password_validation;

    // Crear el usuario usando el endpoint signup que crea la asignación automáticamente
    const userResponse = await signup(signupData);
    notification.success({
      message: "Usuario creado y asignado automáticamente a la sucursal.",
    });
    dispatch({
      type: "update_list",
    });
    form.resetFields();
  } catch (e) {

    // Manejar diferentes tipos de errores
    if (e.response) {
      const status = e.response.status;
      const data = e.response.data;

      if (status === 500) {
        notification.error({
          message: "Error del servidor",
          description:
            "Error interno del servidor. Verifica que el backend esté funcionando correctamente.",
        });
      } else if (status === 400) {
        // Errores de validación
        const errors = data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);

        notification.error({
          message: "Errores de validación",
          description: (
            <ul>
              {errorList.length > 0 ? (
                errorList.map((error, index) => <li key={index}>{error}</li>)
              ) : (
                <li>Datos inválidos. Verifica la información ingresada.</li>
              )}
            </ul>
          ),
        });
      } else if (status === 401) {
        notification.error({
          message: "No autorizado",
          description:
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
        });
      } else if (status === 403) {
        notification.error({
          message: "Acceso denegado",
          description: "No tienes permisos para realizar esta acción.",
        });
      } else {
        notification.error({
          message: `Error ${status}`,
          description: "Error inesperado. Intenta nuevamente.",
        });
      }
    } else if (e.request) {
      // No se recibió respuesta del servidor
      notification.error({
        message: "Error de conexión",
        description:
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      });
    } else {
      // Error en la configuración de la petición
      notification.error({
        message: "Error de configuración",
        description: "Error al configurar la petición. Intenta nuevamente.",
      });
    }
  }
};

const updateUser = async (values, state, dispatch, form, notification) => {
  var notified = true;
  if (values.password) {
    if (values.password === values.password_validation) {
      await change_password({
        user: state.select_to_edit.email,
        new_password: values.password,
      })
        .then(() => {
          form.resetFields();
          notification.success({
            message: "Contraseña y datos actualizada correctamente",
          });
          dispatch({ type: "select_to_edit", payload: { user: null } });
          form.resetFields();
          notified = false;
        })
        .catch((e) => {
          const errors = e.response.data;

          const errorList = Object.keys(errors).map((key) => errors[key]);
          notification.error({
            message: "Errores al modificar la contraseña usuario.",
            description: <ul>{errorList.map((error) => error)}</ul>,
          });
        });
    } else {
      notification.error({
        message: "ERROR",
        description:
          "Las contraseñas no coinciden, verifica e intenta de nuevo.",
      });
    }
  }
  await update(state.select_to_edit, values)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      if (notified) {
        notification.success({ message: "Usuario actualizado correctamente." });
      }
      dispatch({ type: "select_to_edit", payload: { user: null } });
      form.resetFields();
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Errores al actualizar el usuario.",
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

const getUsers = async (state, dispatch) => {
  try {
    const response = await list(state.list.page);
    // Verificar que la respuesta tenga la estructura esperada
    const payload = {
      results: response?.results || response?.data || [],
      count: response?.count || 0,
    };

    dispatch({
      type: "add_users",
      payload: payload,
    });
  } catch (error) {

    // En caso de error, enviar datos vacíos
    dispatch({
      type: "add_users",
      payload: {
        results: [],
        count: 0,
      },
    });
  }
};

const deleteUser = async (user, dispatch, notification) => {

  try {
    // Verificar que notification existe
    if (!notification) {

      return;
    }

    await destroy(user.username);

    dispatch({
      type: "update_list",
    });
    dispatch({
      type: "change_page",
      page: 1,
    });

    notification.success({
      message: "Usuario eliminado correctamente",
    });

  } catch (error) {

    // Manejar diferentes tipos de errores
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 500) {
        notification.error({
          message: "Error del servidor",
          description:
            "Error interno del servidor. No se pudo eliminar el usuario.",
        });
      } else if (status === 404) {
        notification.error({
          message: "Usuario no encontrado",
          description: "El usuario que intentas eliminar no existe.",
        });
      } else if (status === 403) {
        notification.error({
          message: "Acceso denegado",
          description: "No tienes permisos para eliminar usuarios.",
        });
      } else if (status === 400) {
        // Errores de validación
        const errors = data || {};
        const errorList = Object.keys(errors).map((key) => errors[key]);

        notification.error({
          message: "Error al eliminar usuario",
          description: (
            <ul>
              {errorList.length > 0 ? (
                errorList.map((error, index) => <li key={index}>{error}</li>)
              ) : (
                <li>No se pudo eliminar el usuario. Verifica los datos.</li>
              )}
            </ul>
          ),
        });
      } else {
        notification.error({
          message: `Error ${status}`,
          description: "Error inesperado al eliminar el usuario.",
        });
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      notification.error({
        message: "Error de conexión",
        description:
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      });
    } else {
      // Error en la configuración de la petición
      notification.error({
        message: "Error de configuración",
        description: "Error al configurar la petición de eliminación.",
      });
    }
  }
};

export const controller = {
  auth: {
    login: postLogin,
  },
  create_update_form: {
    select_to_edit: selectUser,
    create_or_clear: createOrClear,
  },
  list_table: {
    pagination: changePage,
  },
  list: getUsers,
  delete: deleteUser,
  create: createUser,
  update: updateUser,
};
