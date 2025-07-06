import api from "../../api/endpoints";
import { list_all } from "../../api/endpoints/clients";

const getBranchs = async (dispatch) => {
  const get_branchs = await api.branchs.list(1).then((response) => {
    dispatch({
      type: "add_branchs",
      payload: response,
    });
  });
  return get_branchs;
};

export const getProducts = async (dispatch, state) => {
  await api.products
    .list(state.products.page, {
      ...state.products.filters,
      branch: state.branchs.selected ? state.branchs.selected.id : "",
    })
    .then((res) => {
      dispatch({
        type: "add_products",
        payload: res,
      });
    });
};

export const getClients = async (dispatch, state) => {
  try {
    const response = await list_all({
      ...state.clients.filters,
      branch: state.branchs.selected ? state.branchs.selected.id : "",
    });
    dispatch({
      type: "add_clients",
      payload: response,
    });
  } catch (error) {

  }
};

export const getDrivers = async (dispatch, state) => {
  await api.drivers
    .total({
      ...state.drivers.filters,
      branch: state.branchs.selected ? state.branchs.selected.id : "",
    })
    .then((res) => {
      dispatch({
        type: "add_drivers",
        payload: res,
      });
    });
};

export const getResources = async (dispatch, state) => {
  const get_branchs = await getBranchs(dispatch);

  const response = {
    branchs: get_branchs,
  };
  return response;
};
