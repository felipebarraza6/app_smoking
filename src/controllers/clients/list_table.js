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

export const createContact = async (
  contact,
  dispatch,
  notification,
  setOpenSecond
) => {
  await contacts
    .create(contact)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      setOpenSecond(false);
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Error al crear el contacto.",
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

export const updateContact = async (
  contact,
  dispatch,
  notification,
  setOpenSecond
) => {
  await contacts
    .update(contact.id, contact)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "select_contact",
        payload: { contact: null },
      });
      setOpenSecond(false);
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Error al actualizar el contacto.",
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

export const deleteContact = async (contact, dispatch, notification) => {
  await contacts
    .destroy(contact.id)
    .then(() => {
      dispatch({
        type: "update_list",
      });
      dispatch({
        type: "change_page",
        page: 1,
      });
      notification.success({
        message: "Contacto eliminado correctamente.",
        placement: "bottomRight",
      });
    })
    .catch((e) => {
      const errors = e.response.data;
      const errorList = Object.keys(errors).map((key) => errors[key]);
      notification.error({
        message: "Error al eliminar el contacto.",
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
