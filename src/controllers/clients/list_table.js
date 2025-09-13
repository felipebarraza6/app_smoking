import { contacts } from "../../api/endpoints/clients";
export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};

export const changeFiltersSelects = (type, filter, dispatch) => {
  dispatch({
    type: "change_filters",
    payload: { [type]: filter },
  });
};

export const resetFilterSelects = (dispatch) => {
  dispatch({
    type: "change_filters",
    payload: {
      category: null,
      branch: null,
      search: null,
      code: null,
    },
  });
};

export const addContacts = async (dispatch, contacts) => {
  dispatch({
    type: "add_contacts",
    payload: {
      results: contacts,
      count: contacts.count,
    },
  });
};

export const selectContact = (contact, dispatch) => {
  dispatch({
    type: "select_contact",
    payload: { contact: contact },
  });
};

// ✅ MEJORADO: Mejor manejo de errores y logging
export const createContact = async (
  contact,
  dispatch,
  notification,
  setOpenSecond
) => {
  try {
    console.log("🚀 Creating contact with data:", contact);

    const response = await contacts.create(contact);
    console.log("✅ Contact created successfully:", response);

    dispatch({
      type: "update_list",
    });

    notification.success({
      message: "Contacto creado exitosamente",
      placement: "bottomRight",
    });

    setOpenSecond(false);
  } catch (e) {
    console.error("❌ Error creating contact:", e);

    const errors = e.response?.data || {};
    console.error("❌ Server errors:", errors);

    // ✅ MEJORADO: Mapeo de errores más específico
    const errorMapping = {
      first_name: "nombre",
      last_name: "apellido",
      dni: "RUT/DNI",
      email: "email",
      phone: "teléfono",
      job_title: "cargo",
      department: "departamento",
      contact_type: "tipo de contacto",
      client: "cliente",
      branch: "sucursal",
      non_field_errors: "errores generales",
    };

    const errorList = Object.keys(errors)
      .map((key) => {
        const fieldName = errorMapping[key] || key;
        const errorMessages = Array.isArray(errors[key])
          ? errors[key]
          : [errors[key]];

        return errorMessages.map((msg) => `${fieldName}: ${msg}`);
      })
      .flat();

    notification.error({
      message: "Error al crear el contacto",
      description: (
        <ul>
          {errorList.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ),
    });
  }
};

// ✅ MEJORADO: Mejor manejo de errores
export const updateContact = async (
  contact,
  dispatch,
  notification,
  setOpenSecond
) => {
  try {
    console.log("🔄 Updating contact with data:", contact);

    const response = await contacts.update(contact.id, contact);
    console.log("✅ Contact updated successfully:", response);

    dispatch({
      type: "update_list",
    });

    dispatch({
      type: "select_contact",
      payload: { contact: null },
    });

    notification.success({
      message: "Contacto actualizado exitosamente",
      placement: "bottomRight",
    });

    setOpenSecond(false);
  } catch (e) {
    console.error("❌ Error updating contact:", e);

    const errors = e.response?.data || {};

    // ✅ Usar el mismo mapeo de errores
    const errorMapping = {
      first_name: "nombre",
      last_name: "apellido",
      dni: "RUT/DNI",
      email: "email",
      phone: "teléfono",
      job_title: "cargo",
      department: "departamento",
      contact_type: "tipo de contacto",
      client: "cliente",
      branch: "sucursal",
      non_field_errors: "errores generales",
    };

    const errorList = Object.keys(errors)
      .map((key) => {
        const fieldName = errorMapping[key] || key;
        const errorMessages = Array.isArray(errors[key])
          ? errors[key]
          : [errors[key]];

        return errorMessages.map((msg) => `${fieldName}: ${msg}`);
      })
      .flat();

    notification.error({
      message: "Error al actualizar el contacto",
      description: (
        <ul>
          {errorList.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ),
    });
  }
};

export const deleteContact = async (contact, dispatch, notification) => {
  try {
    console.log("🗑️ Deleting contact:", contact.id);

    await contacts.destroy(contact.id);
    console.log("✅ Contact deleted successfully");

    dispatch({
      type: "update_list",
    });

    dispatch({
      type: "change_page",
      page: 1,
    });

    notification.success({
      message: "Contacto eliminado correctamente",
      placement: "bottomRight",
    });
  } catch (e) {
    console.error("❌ Error deleting contact:", e);

    const errors = e.response?.data || {};
    const errorList = Object.keys(errors)
      .map((key) => errors[key])
      .flat();

    notification.error({
      message: "Error al eliminar el contacto",
      description: (
        <ul>
          {errorList.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ),
    });
  }
};
