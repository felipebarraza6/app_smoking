import { categories } from "../../api/endpoints/products";

export const changePage = (page, dispatch) => {
  dispatch({
    type: "change_page",
    page: page,
  });
};

export const selectAddOrSubstract = (product, option, dispatch) => {
  dispatch({
    type: "select_to_add_rest",
    payload: {
      product: { ...product },
      add_quantity: option ? true : false,
      sus_quantity: option ? false : true,
    },
  });
};

export const changeFiltersSelects = (type, filter, dispatch) => {
  if (type === "branch" && filter === "all") {
    dispatch({
      type: "change_filters",
      payload: { [type]: null },
    });
  } else if (type === "branch" && Array.isArray(filter)) {
    dispatch({
      type: "change_filters",
      payload: { [type]: filter },
    });
  } else {
    dispatch({
      type: "change_filters",
      payload: { [type]: filter },
    });
  }
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

export const createCategory = async (values, dispatch, form) => {
  try {
    console.log("➕ Creating category:", values);
    const response = await categories.create(values);
    console.log("✅ Category created successfully:", response);
    
    // Recargar las categorías directamente después de crear una nueva
    try {
      const response = await categories.list();
      console.log("✅ Categories reloaded after creation:", response);
      
      const categoriesData = response?.results || response || [];
      dispatch({
        type: "set_categories",
        payload: {
          categories: categoriesData,
        },
      });
    } catch (reloadError) {
      console.error("❌ Error reloading categories after creation:", reloadError);
    }
    
    form.resetFields();
    
    return { success: true, data: response };
  } catch (error) {
    console.error("❌ Error creating category:", error);
    console.error("❌ Create error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return { success: false, error };
  }
};

export const destroyCategory = async (id, dispatch) => {
  try {
    console.log("🗑️ Deleting category with ID:", id);
    await categories.destroy(id);
    console.log("✅ Category deleted successfully");
    
    // Recargar las categorías directamente después de eliminar
    try {
      const response = await categories.list();
      console.log("✅ Categories reloaded after deletion:", response);
      
      const categoriesData = response?.results || response || [];
      console.log("📊 Processed categories data:", categoriesData);
      
      dispatch({
        type: "set_categories",
        payload: {
          categories: categoriesData,
        },
      });
    } catch (reloadError) {
      console.error("❌ Error reloading categories after deletion:", reloadError);
      // Mantener el estado actual si no se pueden recargar las categorías
      // No cambiar nada en lugar de romper la UI
    }
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    console.error("❌ Delete error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    // No hacer nada si la eliminación falla - mantener el estado actual
  }
};

export const updateCategory = async (e, dispatch) => {
  try {
    const payload = {
      name: e.target.value,
    };
    console.log("✏️ Updating category ID:", e.target.name, "with:", payload);
    await categories.update(e.target.name, payload);
    console.log("✅ Category updated successfully");
    
    // Recargar las categorías directamente después de actualizar
    try {
      const response = await categories.list();
      console.log("✅ Categories reloaded after update:", response);
      
      const categoriesData = response?.results || response || [];
      dispatch({
        type: "set_categories",
        payload: {
          categories: categoriesData,
        },
      });
    } catch (reloadError) {
      console.error("❌ Error reloading categories after update:", reloadError);
    }
  } catch (error) {
    console.error("❌ Error updating category:", error);
    console.error("❌ Update error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
};
