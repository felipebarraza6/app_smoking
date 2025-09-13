import api from "../../api/endpoints";
import { list_all } from "../../api/endpoints/clients";

const getBranchs = async (dispatch) => {
  try {
    const response = await api.branchs.my_branches();
    const branchesData = Array.isArray(response.data) ? response.data : [];
    
    // Extraer solo las sucursales del array de accesos
    const branches = branchesData.map(branchAccess => branchAccess.branch || branchAccess);
    
    dispatch({
      type: "add_branchs",
      payload: {
        results: branches,
        count: branches.length,
      },
    });
    
    // Si hay sucursales, seleccionar la primera por defecto
    if (branches.length > 0) {
      dispatch({
        type: "selected_branch",
        payload: branches[0],
      });
    }
    
    return branches;
  } catch (error) {
    console.error("Error fetching branches:", error);
    dispatch({
      type: "add_branchs",
      payload: {
        results: [],
        count: 0,
      },
    });
    return [];
  }
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
