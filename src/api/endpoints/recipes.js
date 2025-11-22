import { Axios } from '../config'

const RECIPES_BASE_URL = 'recipes'

export const recipesAPI = {
  // CRUD básico de recetas
  // El router registra 'recipes', entonces el endpoint es /api/recipes/recipes/
  getRecipes: (params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/`, { params }),
  
  getRecipe: (id) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/${id}/`),
  
  createRecipe: (data) => 
    Axios.post(`${RECIPES_BASE_URL}/recipes/`, data),
  
  updateRecipe: (id, data) => 
    Axios.put(`${RECIPES_BASE_URL}/recipes/${id}/`, data),
  
  deleteRecipe: (id) => 
    Axios.delete(`${RECIPES_BASE_URL}/recipes/${id}/`),

  // Gestión nutricional
  calculateNutrition: (id, data = {}) => 
    Axios.post(`${RECIPES_BASE_URL}/recipes/${id}/calculate_nutrition/`, data),
  
  updateNutrition: (id, data) => 
    Axios.post(`${RECIPES_BASE_URL}/recipes/${id}/update_nutrition/`, data),
  
  getNutritionLabel: (id) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/${id}/nutrition_label/`),
  
  /**
   * Obtiene los ingredientes nutricionales disponibles
   * Endpoint correcto: /api/recipes/recipes/nutritional_ingredients/
   * (acción del RecipeViewSet, no del IngredientViewSet)
   * El router registra 'recipes' y la acción es 'nutritional_ingredients'
   */
  getNutritionalIngredients: () => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/nutritional_ingredients/`),

  // Gestión de costos  
  calculateCost: (id, params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/${id}/calculate_cost/`, { params }),
  
  updateCosts: (id) => 
    Axios.post(`${RECIPES_BASE_URL}/recipes/${id}/update_costs/`),
  
  getProfitabilityAnalysis: (id, params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/${id}/profitability_analysis/`, { params }),
  
  getCostComparison: (params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/cost_comparison/`, { params }),

  // Dashboard y estadísticas
  getDashboard: () => 
    Axios.get(`${RECIPES_BASE_URL}/recipes/dashboard/`),
  
  scaleRecipe: (id, scaleFactor) => 
    Axios.post(`${RECIPES_BASE_URL}/recipes/${id}/scale/`, { scale_factor: scaleFactor }),

  // Ingredientes de receta
  getIngredients: (params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/ingredients/`, { params }),
  
  createIngredient: (data) => 
    Axios.post(`${RECIPES_BASE_URL}/ingredients/`, data),
  
  updateIngredient: (id, data) => 
    Axios.put(`${RECIPES_BASE_URL}/ingredients/${id}/`, data),
  
  deleteIngredient: (id) => 
    Axios.delete(`${RECIPES_BASE_URL}/ingredients/${id}/`),

  // Pasos de receta
  getSteps: (params = {}) => 
    Axios.get(`${RECIPES_BASE_URL}/steps/`, { params }),
  
  createStep: (data) => 
    Axios.post(`${RECIPES_BASE_URL}/steps/`, data),
  
  updateStep: (id, data) => 
    Axios.put(`${RECIPES_BASE_URL}/steps/${id}/`, data),
  
  deleteStep: (id) => 
    Axios.delete(`${RECIPES_BASE_URL}/steps/${id}/`)
}