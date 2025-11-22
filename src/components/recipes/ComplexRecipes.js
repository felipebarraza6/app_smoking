import React, { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Tag,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Descriptions,
  Divider,
  Transfer,
  List,
  Typography,
  Progress,
  Tabs,
  Alert,
  Steps,
  Empty,
  Flex
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  CalculatorOutlined,
  EyeOutlined,
  PrinterOutlined,
  DollarOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { recipesAPI } from '../../api/endpoints/recipes'
import jsPDF from 'jspdf'

const { Option } = Select
const { TextArea } = Input
const { Text, Paragraph, Title } = Typography
const { TabPane } = Tabs
const { Step } = Steps

const ComplexRecipes = () => {
  const [complexRecipes, setComplexRecipes] = useState([])
  const [nutritionalIngredients, setNutritionalIngredients] = useState([])
  const [subRecipes, setSubRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false)
  const [costModalVisible, setCostModalVisible] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [selectedSubRecipes, setSelectedSubRecipes] = useState([])
  const [ingredientQuantities, setIngredientQuantities] = useState({})
  const [subRecipeQuantities, setSubRecipeQuantities] = useState({})
  const [calculatedNutrition, setCalculatedNutrition] = useState(null)
  const [costAnalysis, setCostAnalysis] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchComplexRecipes()
    fetchNutritionalIngredients()
    fetchSubRecipes()
  }, [])

  /**
   * Obtiene las recetas complejas desde la API
   * Asegura que el resultado siempre sea un array para evitar errores con .filter()
   */
  const fetchComplexRecipes = async () => {
    setLoading(true)
    try {
      const response = await recipesAPI.getRecipes({ recipe_type: 'NUTRITIONAL_RECIPE' })
      // Asegurar que siempre sea un array
      const recipes = response.data?.results || response.data || []
      setComplexRecipes(Array.isArray(recipes) ? recipes : [])
    } catch (error) {
      console.error('Error al cargar recetas complejas:', error)
      message.error('Error al cargar recetas complejas')
      setComplexRecipes([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  /**
   * Obtiene los ingredientes nutricionales desde la API
   * Maneja errores y asegura que siempre sea un array
   */
  const fetchNutritionalIngredients = async () => {
    try {
      const response = await recipesAPI.getNutritionalIngredients()
      // Validar que response.data sea un array
      const ingredients = Array.isArray(response.data) ? response.data : []
      setNutritionalIngredients(ingredients.map(ing => ({
        ...ing,
        key: ing.id.toString(),
        type: 'ingredient'
      })))
    } catch (error) {
      console.error('Error al cargar ingredientes nutricionales:', error)
      message.error('Error al cargar ingredientes nutricionales')
      setNutritionalIngredients([]) // Asegurar que siempre sea un array
    }
  }

  /**
   * Obtiene las sub-recetas desde la API
   * Maneja errores y asegura que siempre sea un array
   */
  const fetchSubRecipes = async () => {
    try {
      const response = await recipesAPI.getRecipes({ recipe_type: 'SUB_RECIPE' })
      // Asegurar que siempre sea un array
      const recipes = response.data?.results || response.data || []
      const validRecipes = Array.isArray(recipes) ? recipes : []
      setSubRecipes(validRecipes.map(recipe => ({
        ...recipe,
        key: recipe.id.toString(),
        type: 'sub_recipe'
      })))
    } catch (error) {
      console.error('Error al cargar sub-recetas:', error)
      message.error('Error al cargar sub-recetas')
      setSubRecipes([]) // Asegurar que siempre sea un array
    }
  }

  const handleAddComplexRecipe = () => {
    form.resetFields()
    setEditingRecipe(null)
    setSelectedIngredients([])
    setSelectedSubRecipes([])
    setIngredientQuantities({})
    setSubRecipeQuantities({})
    setCalculatedNutrition(null)
    setCostAnalysis(null)
    setCurrentStep(0)
    setModalVisible(true)
  }

  const handleEditComplexRecipe = async (recipe) => {
    setEditingRecipe(recipe)
    form.setFieldsValue({
      name: recipe.name,
      description: recipe.description,
      yield_quantity: recipe.yield_quantity,
      yield_unit: recipe.yield_unit,
      instructions: recipe.instructions,
      notes: recipe.notes,
      preparation_time_minutes: recipe.preparation_time_minutes,
      cooking_time_minutes: recipe.cooking_time_minutes,
      servings: recipe.servings,
      difficulty_level: recipe.difficulty_level
    })

    // Cargar ingredientes y sub-recetas de la receta
    try {
      const response = await recipesAPI.getIngredients({ recipe: recipe.id })
      const recipeIngredients = response.data.results || response.data
      
      const ingredients = []
      const subRecipesIds = []
      const ingQuantities = {}
      const subQuantities = {}
      
      recipeIngredients.forEach(ing => {
        // Determinar si es ingrediente base o sub-receta
        const ingredient = nutritionalIngredients.find(ni => ni.id === ing.ingredient)
        const subRecipe = subRecipes.find(sr => sr.id === ing.ingredient)
        
        if (ingredient) {
          ingredients.push(ing.ingredient.toString())
          ingQuantities[ing.ingredient] = {
            quantity: ing.quantity,
            unit: ing.unit
          }
        } else if (subRecipe) {
          subRecipesIds.push(ing.ingredient.toString())
          subQuantities[ing.ingredient] = {
            quantity: ing.quantity,
            unit: ing.unit
          }
        }
      })
      
      setSelectedIngredients(ingredients)
      setSelectedSubRecipes(subRecipesIds)
      setIngredientQuantities(ingQuantities)
      setSubRecipeQuantities(subQuantities)
    } catch (error) {
      console.error('Error loading recipe components:', error)
    }

    setModalVisible(true)
  }

  const handleSubmit = async (values) => {
    // Obtener todos los valores del formulario, incluyendo campos no renderizados
    const allValues = form.getFieldsValue(true)
    
    // Combinar valores del parámetro y del formulario
    const formValues = { ...allValues, ...values }
    
    // Debug temporal para ver qué valores tenemos
    console.log('🔍 Valores del formulario:', formValues)
    console.log('🔍 Campo name:', formValues.name)
    console.log('🔍 Tipo de name:', typeof formValues.name)
    
    // Validar que se haya completado el paso 0 (nombre requerido)
    if (!formValues.name || (typeof formValues.name === 'string' && formValues.name.trim() === '')) {
      message.error('El nombre de la receta es requerido. Por favor complete el paso 1.')
      setCurrentStep(0) // Volver al paso 0
      // Intentar hacer focus en el campo name
      setTimeout(() => {
        const nameField = document.querySelector('input[name="name"]')
        if (nameField) {
          nameField.focus()
          nameField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    if (selectedIngredients.length === 0 && selectedSubRecipes.length === 0) {
      message.error('Debe seleccionar al menos un ingrediente o sub-receta')
      setCurrentStep(1) // Volver al paso de selección
      return
    }

    try {
      // Preparar datos de la receta
      const recipeData = {
        name: formValues.name?.trim(),
        description: formValues.description || '',
        yield_quantity: formValues.yield_quantity || 1,
        yield_unit: formValues.yield_unit || 'g',
        servings: formValues.servings || 1,
        preparation_time_minutes: formValues.preparation_time_minutes || 0,
        cooking_time_minutes: formValues.cooking_time_minutes || 0,
        difficulty_level: formValues.difficulty_level || 1,
        instructions: formValues.instructions || '',
        notes: formValues.notes || '',
        recipe_type: 'NUTRITIONAL_RECIPE',
        status: 'DRAFT',
        // No enviar resulting_product, se creará automáticamente en el backend
        // No enviar code, se generará automáticamente en el backend
        // No enviar branch, se asignará automáticamente en el backend
      }

      let savedRecipe
      if (editingRecipe) {
        const response = await recipesAPI.updateRecipe(editingRecipe.id, recipeData)
        savedRecipe = response.data
        message.success('Receta compleja actualizada exitosamente')
      } else {
        const response = await recipesAPI.createRecipe(recipeData)
        savedRecipe = response.data
        message.success('Receta compleja creada exitosamente')
      }

      // Agregar ingredientes base
      for (const ingredientId of selectedIngredients) {
        const quantities = ingredientQuantities[ingredientId]
        if (quantities) {
          await recipesAPI.createIngredient({
            recipe: savedRecipe.id,
            ingredient: parseInt(ingredientId),
            quantity: quantities.quantity,
            unit: quantities.unit,
            is_active: true
          })
        }
      }

      // Agregar sub-recetas
      for (const subRecipeId of selectedSubRecipes) {
        const quantities = subRecipeQuantities[subRecipeId]
        if (quantities) {
          await recipesAPI.createIngredient({
            recipe: savedRecipe.id,
            ingredient: parseInt(subRecipeId),
            quantity: quantities.quantity,
            unit: quantities.unit,
            is_active: true
          })
        }
      }

      // Calcular información nutricional y costos
      await recipesAPI.calculateNutrition(savedRecipe.id)
      await recipesAPI.updateCosts(savedRecipe.id)

      setModalVisible(false)
      fetchComplexRecipes()
    } catch (error) {
      console.error('Error al guardar la receta:', error)
      const errorMessage = error.response?.data?.name?.[0] || 
                          error.response?.data?.error || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Error al guardar la receta compleja'
      message.error(errorMessage)
      
      // Si el error es de validación de nombre, volver al paso 0
      if (error.response?.data?.name) {
        setCurrentStep(0)
      }
    }
  }

  const handleDeleteComplexRecipe = async (id) => {
    try {
      await recipesAPI.deleteRecipe(id)
      message.success('Receta compleja eliminada exitosamente')
      fetchComplexRecipes()
    } catch (error) {
      message.error('Error al eliminar la receta compleja')
    }
  }

  const handleQuantityChange = (id, field, value, type) => {
    if (type === 'ingredient') {
      setIngredientQuantities(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: value }
      }))
    } else {
      setSubRecipeQuantities(prev => ({
        ...prev,
        [id]: { ...prev[id], [field]: value }
      }))
    }
  }

  const calculatePreviewNutrition = () => {
    // Esta es una simulación del cálculo nutricional
    // En un caso real, esto se haría en el backend
    let totalWeight = 0
    const nutrition = {
      energy_kcal: 0,
      proteins_g: 0,
      total_fats_g: 0,
      saturated_fats_g: 0,
      carbohydrates_g: 0,
      sodium_mg: 0
    }

    // Calcular aportes de ingredientes base
    selectedIngredients.forEach(ingredientId => {
      const ingredient = nutritionalIngredients.find(i => i.id.toString() === ingredientId)
      const quantities = ingredientQuantities[ingredientId]
      
      if (ingredient && quantities) {
        const weightGrams = convertToGrams(quantities.quantity, quantities.unit)
        totalWeight += weightGrams

        Object.keys(nutrition).forEach(field => {
          if (ingredient[field]) {
            nutrition[field] += (ingredient[field] * weightGrams) / 100
          }
        })
      }
    })

    // Para sub-recetas, necesitarías sus valores nutricionales calculados
    selectedSubRecipes.forEach(subRecipeId => {
      const subRecipe = subRecipes.find(sr => sr.id.toString() === subRecipeId)
      const quantities = subRecipeQuantities[subRecipeId]
      
      if (subRecipe && quantities) {
        const weightGrams = convertToGrams(quantities.quantity, quantities.unit)
        totalWeight += weightGrams
        
        // Aquí aplicarías los valores nutricionales de la sub-receta
        // Por ahora es una aproximación
        Object.keys(nutrition).forEach(field => {
          const calculatedField = `calculated_${field}`
          if (subRecipe[calculatedField]) {
            nutrition[field] += (subRecipe[calculatedField] * weightGrams) / 100
          }
        })
      }
    })

    // Convertir a valores por 100g del producto final
    if (totalWeight > 0) {
      Object.keys(nutrition).forEach(field => {
        nutrition[field] = (nutrition[field] / totalWeight) * 100
      })
    }

    setCalculatedNutrition({ ...nutrition, totalWeight })
  }

  const loadCostAnalysis = async (recipe) => {
    try {
      const costResponse = await recipesAPI.calculateCost(recipe.id, {
        include_overhead: true,
        include_labor: true
      })
      const profitabilityResponse = await recipesAPI.getProfitabilityAnalysis(recipe.id)
      
      setCostAnalysis({
        cost: costResponse.data,
        profitability: profitabilityResponse.data,
        recipe
      })
      setCostModalVisible(true)
    } catch (error) {
      message.error('Error al cargar análisis de costos')
    }
  }

  const convertToGrams = (quantity, unit) => {
    const conversions = {
      'g': 1,
      'kg': 1000,
      'ml': 1,
      'l': 1000,
      'unidad': 100
    }
    return quantity * (conversions[unit] || 1)
  }

  const viewNutritionInfo = async (recipe) => {
    try {
      const response = await recipesAPI.getNutritionLabel(recipe.id)
      setSelectedRecipe({ ...recipe, nutritionInfo: response.data })
      setNutritionModalVisible(true)
    } catch (error) {
      message.error('Error al cargar información nutricional')
    }
  }

  /**
   * Genera un PDF profesional con la etiqueta nutricional de la receta
   * Formato similar a etiquetas comerciales con toda la información requerida
   */
  const printNutritionLabel = async (recipe) => {
    try {
      // Obtener datos nutricionales y detalles completos de la receta
      const [nutritionResponse, recipeResponse] = await Promise.all([
        recipesAPI.getNutritionLabel(recipe.id),
        recipesAPI.getRecipe(recipe.id)
      ])
      
      const nutritionData = nutritionResponse.data
      const recipeData = recipeResponse.data

      // Crear documento PDF en formato A4 (210mm x 297mm) para etiqueta completa
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = 210
      const pageHeight = 297
      const margin = 10
      const contentWidth = pageWidth - (margin * 2)
      let yPos = margin

      // Configuración de colores
      const primaryColor = [0, 0, 0] // Negro
      const secondaryColor = [100, 100, 100] // Gris

      // ========== SECCIÓN IZQUIERDA: INFORMACIÓN DEL PRODUCTO ==========
      const leftSectionX = margin
      const leftSectionWidth = contentWidth * 0.48

      // Nombre del producto (grande y destacado)
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...primaryColor)
      const productName = recipe.name || recipeData.name || 'Producto'
      pdf.text(productName, leftSectionX, yPos, { maxWidth: leftSectionWidth })
      yPos += 12

      // Volumen/Cantidad
      if (recipe.yield_quantity || recipeData.yield_quantity) {
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        const volume = `${recipe.yield_quantity || recipeData.yield_quantity} ${recipe.yield_unit || recipeData.yield_unit || 'g'}`
        pdf.text(`Volumen: ${volume}`, leftSectionX, yPos)
        yPos += 7
      }

      // Contiene (alérgenos o ingredientes principales)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Contiene:', leftSectionX, yPos)
      yPos += 5

      // Lista de ingredientes principales
      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        const mainIngredients = recipeData.ingredients.slice(0, 5).map(ing => ing.ingredient_name || ing.ingredient?.name).filter(Boolean)
        if (mainIngredients.length > 0) {
          pdf.text(mainIngredients.join(', '), leftSectionX, yPos, { maxWidth: leftSectionWidth })
          yPos += 5
        }
      }

      // Alérgenos (advertencia)
      yPos += 3
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(150, 0, 0) // Rojo para advertencia
      pdf.text('Puede contener trazas de soya, maní, nueces, huevo.', leftSectionX, yPos, { maxWidth: leftSectionWidth })
      pdf.setTextColor(...primaryColor)
      yPos += 8

      // Ingredientes completos
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Ingredientes:', leftSectionX, yPos)
      yPos += 5

      if (recipeData.ingredients && recipeData.ingredients.length > 0) {
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        const ingredientsList = recipeData.ingredients.map(ing => {
          const name = ing.ingredient_name || ing.ingredient?.name || ''
          const qty = ing.quantity || 0
          const unit = ing.unit || ''
          return `${name} (${qty} ${unit})`
        }).join(', ')
        
        // Dividir texto largo en múltiples líneas
        const splitIngredients = pdf.splitTextToSize(ingredientsList, leftSectionWidth)
        splitIngredients.forEach((line, index) => {
          if (yPos < pageHeight - 50) {
            pdf.text(line, leftSectionX, yPos)
            yPos += 4
          }
        })
      }

      yPos += 5

      // Información del fabricante (placeholder - se puede obtener de branch)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Elaborado por: [Nombre de la Empresa]', leftSectionX, yPos)
      yPos += 4
      pdf.text('Resolución Sanit.: [Número]', leftSectionX, yPos)
      yPos += 4
      pdf.text('Dirección: [Dirección]', leftSectionX, yPos)
      yPos += 4
      pdf.text('Fecha elaboración: ___________', leftSectionX, yPos)

      // ========== SECCIÓN DERECHA: INFORMACIÓN NUTRICIONAL ==========
      const rightSectionX = margin + leftSectionWidth + 10
      const rightSectionWidth = contentWidth * 0.48
      yPos = margin

      // Título de información nutricional
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...primaryColor)
      pdf.text('INFORMACIÓN NUTRICIONAL', rightSectionX, yPos, { maxWidth: rightSectionWidth, align: 'center' })
      yPos += 10

      // Porción
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const servingSize = recipe.yield_quantity || recipeData.yield_quantity || 120
      const servingUnit = recipe.yield_unit || recipeData.yield_unit || 'g'
      pdf.text(`Porción: 1 vaso (${servingSize} ${servingUnit})`, rightSectionX, yPos)
      yPos += 5

      // Porciones por envase
      if (nutritionData?.total_weight_grams) {
        const servingsPerContainer = Math.floor(nutritionData.total_weight_grams / servingSize)
        pdf.text(`Porciones por envase: ${servingsPerContainer}`, rightSectionX, yPos)
        yPos += 8
      }

      // Tabla nutricional
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Por 100 g', rightSectionX + 20, yPos)
      pdf.text('Por porción', rightSectionX + 60, yPos)
      yPos += 5

      // Línea divisoria
      pdf.setDrawColor(...secondaryColor)
      pdf.line(rightSectionX, yPos, rightSectionX + rightSectionWidth, yPos)
      yPos += 3

      // Mapeo de campos nutricionales
      const nutritionFields = [
        { key: 'energia_kcal', label: 'Energía (kcal)', per100g: 'energia_kcal', perServing: 'energia_kcal' },
        { key: 'proteinas_g', label: 'Proteína (g)', per100g: 'proteinas_g', perServing: 'proteinas_g' },
        { key: 'grasas_totales_g', label: 'Grasa total (g)', per100g: 'grasas_totales_g', perServing: 'grasas_totales_g' },
        { key: 'grasas_saturadas_g', label: 'Grasas saturadas (g)', per100g: 'grasas_saturadas_g', perServing: 'grasas_saturadas_g' },
        { key: 'hidratos_carbono_g', label: 'Hidratos de carbono (g)', per100g: 'hidratos_carbono_g', perServing: 'hidratos_carbono_g' },
        { key: 'azucares_totales_g', label: 'Azúcares totales (g)', per100g: 'azucares_totales_g', perServing: 'azucares_totales_g' },
        { key: 'sodio_mg', label: 'Sodio (mg)', per100g: 'sodio_mg', perServing: 'sodio_mg' },
        { key: 'fibra_dietetica_g', label: 'Fibra dietética (g)', per100g: 'fibra_dietetica_g', perServing: 'fibra_dietetica_g' }
      ]

      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')

      nutritionFields.forEach(field => {
        if (nutritionData?.nutrition_per_100g?.[field.per100g] !== undefined) {
          const valuePer100g = nutritionData.nutrition_per_100g[field.per100g] || 0
          const valuePerServing = (valuePer100g * servingSize) / 100

          // Nombre del nutriente
          pdf.text(field.label, rightSectionX, yPos)
          
          // Valor por 100g
          pdf.text(valuePer100g.toFixed(2), rightSectionX + 25, yPos, { align: 'right' })
          
          // Valor por porción
          pdf.text(valuePerServing.toFixed(2), rightSectionX + 65, yPos, { align: 'right' })
          
          yPos += 5
        }
      })

      // Guardar el PDF
      const fileName = `etiqueta_nutricional_${productName.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      pdf.save(fileName)

      message.success('Etiqueta nutricional profesional generada exitosamente')
    } catch (error) {
      console.error('Error al generar etiqueta nutricional:', error)
      message.error('Error al generar etiqueta nutricional: ' + (error.response?.data?.error || error.message))
    }
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left'
    },
    {
      title: 'Tipo',
      dataIndex: 'recipe_type',
      key: 'recipe_type',
      width: 120,
      render: () => <Tag color="purple">Receta Compleja</Tag>
    },
    {
      title: 'Rendimiento',
      key: 'yield',
      width: 150,
      render: (_, record) => `${record.yield_quantity} ${record.yield_unit}`
    },
    {
      title: 'Tiempo Total',
      key: 'total_time',
      width: 120,
      render: (_, record) => `${record.total_time_minutes || 0} min`
    },
    {
      title: 'Porciones',
      dataIndex: 'servings',
      key: 'servings',
      width: 100
    },
    {
      title: 'Cálculo Nutricional',
      dataIndex: 'has_nutritional_calculation',
      key: 'has_nutritional_calculation',
      width: 150,
      render: (hasCalc) => (
        <Tag color={hasCalc ? 'green' : 'orange'}>
          {hasCalc ? 'Calculado' : 'Pendiente'}
        </Tag>
      )
    },
    {
      title: 'Costo Total',
      dataIndex: 'total_cost',
      key: 'total_cost',
      width: 120,
      render: (cost) => cost ? `$${cost}` : '-'
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => viewNutritionInfo(record)}
            title="Ver información nutricional"
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => printNutritionLabel(record)}
            title="Imprimir etiqueta nutricional"
          />
          <Button
            type="text"
            icon={<DollarOutlined />}
            onClick={() => loadCostAnalysis(record)}
            title="Análisis de costos"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditComplexRecipe(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar esta receta?"
            onConfirm={() => handleDeleteComplexRecipe(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  /**
   * Obtiene los nombres de los campos del paso actual para validación
   */
  const getStepFields = (step) => {
    switch (step) {
      case 0:
        return ['name', 'yield_quantity', 'yield_unit']
      case 1:
        return [] // No hay campos del formulario en este paso
      case 2:
        return [] // No hay campos del formulario en este paso
      case 3:
        return ['instructions']
      default:
        return []
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Nombre de la Receta"
                  rules={[{ required: true, message: 'Ingrese el nombre' }]}
                >
                  <Input placeholder="Ej: Helado de Leche Blanca" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Descripción"
                >
                  <Input placeholder="Descripción de la receta" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="yield_quantity"
                  label="Cantidad de Rendimiento"
                  rules={[{ required: true, message: 'Ingrese el rendimiento' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="6700"
                    min={0}
                    step={0.01}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="yield_unit"
                  label="Unidad de Rendimiento"
                  rules={[{ required: true, message: 'Seleccione la unidad' }]}
                >
                  <Select placeholder="Seleccione unidad">
                    <Option value="g">Gramos</Option>
                    <Option value="kg">Kilogramos</Option>
                    <Option value="ml">Mililitros</Option>
                    <Option value="l">Litros</Option>
                    <Option value="unidad">Unidad</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="servings"
                  label="Número de Porciones"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="8"
                    min={1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="preparation_time_minutes"
                  label="Tiempo Preparación (min)"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="30"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="cooking_time_minutes"
                  label="Tiempo Cocción (min)"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="120"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="difficulty_level"
                  label="Nivel de Dificultad"
                >
                  <Select placeholder="Seleccione nivel">
                    <Option value={1}>Fácil</Option>
                    <Option value={2}>Medio</Option>
                    <Option value={3}>Difícil</Option>
                    <Option value={4}>Muy Difícil</Option>
                    <Option value={5}>Experto</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )

      case 1:
        return (
          <div>
            <Alert
              message="Selección de Ingredientes Base"
              description="Seleccione los insumos nutricionales que utilizará directamente en esta receta."
              type="info"
              style={{ marginBottom: 16 }}
            />
            
            <Transfer
              dataSource={nutritionalIngredients}
              titles={['Ingredientes Disponibles', 'Ingredientes Seleccionados']}
              targetKeys={selectedIngredients}
              onChange={setSelectedIngredients}
              render={item => `${item.name} (${item.supplier_company})`}
              listStyle={{
                width: 350,
                height: 300,
              }}
            />

            {selectedIngredients.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Divider orientation="left">Cantidades de Ingredientes</Divider>
                <Row gutter={16}>
                  {selectedIngredients.map(ingredientId => {
                    const ingredient = nutritionalIngredients.find(i => i.id.toString() === ingredientId)
                    const quantities = ingredientQuantities[ingredientId] || { quantity: '', unit: 'g' }
                    
                    return (
                      <Col span={12} key={ingredientId}>
                        <Card size="small" title={ingredient?.name}>
                          <Row gutter={8}>
                            <Col span={12}>
                              <InputNumber
                                placeholder="Cantidad"
                                value={quantities.quantity}
                                onChange={(value) => handleQuantityChange(ingredientId, 'quantity', value, 'ingredient')}
                                style={{ width: '100%' }}
                                min={0}
                                step={0.01}
                              />
                            </Col>
                            <Col span={12}>
                              <Select
                                value={quantities.unit}
                                onChange={(value) => handleQuantityChange(ingredientId, 'unit', value, 'ingredient')}
                                style={{ width: '100%' }}
                              >
                                <Option value="g">g</Option>
                                <Option value="kg">kg</Option>
                                <Option value="ml">ml</Option>
                                <Option value="l">l</Option>
                              </Select>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    )
                  })}
                </Row>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div>
            <Alert
              message="Selección de Sub-recetas"
              description="Seleccione las sub-recetas que utilizará como componentes en esta receta compleja."
              type="info"
              style={{ marginBottom: 16 }}
            />

            {subRecipes.length > 0 ? (
              <>
                <Transfer
                  dataSource={subRecipes}
                  titles={['Sub-recetas Disponibles', 'Sub-recetas Seleccionadas']}
                  targetKeys={selectedSubRecipes}
                  onChange={setSelectedSubRecipes}
                  render={item => `${item.name} (${item.yield_quantity} ${item.yield_unit})`}
                  listStyle={{
                    width: 350,
                    height: 300,
                  }}
                />

                {selectedSubRecipes.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Divider orientation="left">Cantidades de Sub-recetas</Divider>
                    <Row gutter={16}>
                      {selectedSubRecipes.map(subRecipeId => {
                        const subRecipe = subRecipes.find(sr => sr.id.toString() === subRecipeId)
                        const quantities = subRecipeQuantities[subRecipeId] || { quantity: '', unit: 'g' }
                        
                        return (
                          <Col span={12} key={subRecipeId}>
                            <Card size="small" title={subRecipe?.name}>
                              <Row gutter={8}>
                                <Col span={12}>
                                  <InputNumber
                                    placeholder="Cantidad"
                                    value={quantities.quantity}
                                    onChange={(value) => handleQuantityChange(subRecipeId, 'quantity', value, 'sub_recipe')}
                                    style={{ width: '100%' }}
                                    min={0}
                                    step={0.01}
                                  />
                                </Col>
                                <Col span={12}>
                                  <Select
                                    value={quantities.unit}
                                    onChange={(value) => handleQuantityChange(subRecipeId, 'unit', value, 'sub_recipe')}
                                    style={{ width: '100%' }}
                                  >
                                    <Option value="g">g</Option>
                                    <Option value="kg">kg</Option>
                                    <Option value="ml">ml</Option>
                                    <Option value="l">l</Option>
                                  </Select>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        )
                      })}
                    </Row>
                  </div>
                )}
              </>
            ) : (
              <Empty
                description="No hay sub-recetas disponibles"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        )

      case 3:
        return (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="instructions"
                  label="Instrucciones de Preparación"
                  rules={[{ required: true, message: 'Ingrese las instrucciones' }]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Instrucciones detalladas paso a paso..."
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="notes"
                  label="Notas y Consejos"
                >
                  <TextArea
                    rows={6}
                    placeholder="Consejos, advertencias, variaciones..."
                  />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
              <Button
                type="dashed"
                onClick={calculatePreviewNutrition}
                icon={<CalculatorOutlined />}
                block
              >
                Calcular Vista Previa Nutricional
              </Button>

              {calculatedNutrition && (
                <Card title="Vista Previa Nutricional" style={{ marginTop: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Statistic title="Peso Total" value={calculatedNutrition.totalWeight.toFixed(2)} suffix="g" />
                    </Col>
                    <Col span={6}>
                      <Statistic title="Energía" value={calculatedNutrition.energy_kcal.toFixed(2)} suffix="kcal/100g" />
                    </Col>
                    <Col span={6}>
                      <Statistic title="Proteínas" value={calculatedNutrition.proteins_g.toFixed(2)} suffix="g/100g" />
                    </Col>
                    <Col span={6}>
                      <Statistic title="Grasas" value={calculatedNutrition.total_fats_g.toFixed(2)} suffix="g/100g" />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <Statistic title="Carbohidratos" value={calculatedNutrition.carbohydrates_g.toFixed(2)} suffix="g/100g" />
                    </Col>
                    <Col span={6}>
                      <Statistic title="Sodio" value={calculatedNutrition.sodium_mg.toFixed(2)} suffix="mg/100g" />
                    </Col>
                  </Row>
                </Card>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const steps = [
    {
      title: 'Información General',
      description: 'Datos básicos de la receta'
    },
    {
      title: 'Ingredientes Base',
      description: 'Insumos nutricionales directos'
    },
    {
      title: 'Sub-recetas',
      description: 'Componentes pre-elaborados'
    },
    {
      title: 'Instrucciones y Cálculos',
      description: 'Preparación y vista previa'
    }
  ]

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined />
          Gestión de Recetas Complejas
        </Space>
      }
      extra={
        <Flex gap="small" align="center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddComplexRecipe}
          >
            Nueva Receta Compleja
          </Button>
        </Flex>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic
            title="Total Recetas Complejas"
            value={Array.isArray(complexRecipes) ? complexRecipes.length : 0}
            prefix={<ExperimentOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Con Cálculo Nutricional"
            value={Array.isArray(complexRecipes) ? complexRecipes.filter(r => r?.has_nutritional_calculation).length : 0}
            prefix={<CalculatorOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Con Costos Calculados"
            value={Array.isArray(complexRecipes) ? complexRecipes.filter(r => r?.total_cost > 0).length : 0}
            prefix={<DollarOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Tiempo Promedio"
            value={Array.isArray(complexRecipes) && complexRecipes.length > 0
              ? complexRecipes.reduce((acc, r) => acc + (r?.total_time_minutes || 0), 0) / complexRecipes.length
              : 0}
            suffix="min"
            precision={0}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={Array.isArray(complexRecipes) ? complexRecipes : []}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} recetas complejas`
        }}
      />

      {/* Modal para crear/editar receta compleja */}
      <Modal
        title={editingRecipe ? 'Editar Receta Compleja' : 'Nueva Receta Compleja'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1200}
        destroyOnClose
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          {steps.map(item => (
            <Step key={item.title} title={item.title} description={item.description} />
          ))}
        </Steps>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          preserve={true}
        >
          {renderStepContent()}

          <Row justify="space-between" style={{ marginTop: 24 }}>
            <Col>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  Anterior
                </Button>
              )}
            </Col>
            <Col>
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancelar
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        // Validar campos del paso actual antes de avanzar
                        const fields = getStepFields(currentStep)
                        await form.validateFields(fields)
                        setCurrentStep(currentStep + 1)
                      } catch (error) {
                        console.error('Error de validación:', error)
                      }
                    }}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    onClick={async (e) => {
                      e.preventDefault()
                      try {
                        // Validar todos los campos antes de enviar
                        await form.validateFields()
                        // Obtener todos los valores y enviar manualmente
                        const allValues = form.getFieldsValue()
                        handleSubmit(allValues)
                      } catch (error) {
                        console.error('Error de validación:', error)
                        message.error('Por favor complete todos los campos requeridos')
                      }
                    }}
                  >
                    {editingRecipe ? 'Actualizar' : 'Crear'} Receta
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal información nutricional */}
      <Modal
        title="Información Nutricional Completa"
        open={nutritionModalVisible}
        onCancel={() => setNutritionModalVisible(false)}
        footer={[
          <Button 
            key="print" 
            icon={<PrinterOutlined />}
            type="primary"
            onClick={() => selectedRecipe && printNutritionLabel(selectedRecipe)}
          >
            Generar PDF Etiqueta
          </Button>,
          <Button key="close" onClick={() => setNutritionModalVisible(false)}>
            Cerrar
          </Button>
        ]}
        width={800}
      >
        {selectedRecipe?.nutritionInfo && (
          <div>
            <Descriptions title="Información General" bordered size="small">
              <Descriptions.Item label="Producto" span={3}>
                {selectedRecipe.name}
              </Descriptions.Item>
              <Descriptions.Item label="Peso Total">
                {selectedRecipe.nutritionInfo.total_weight_grams} g
              </Descriptions.Item>
              <Descriptions.Item label="Rendimiento" span={2}>
                {selectedRecipe.yield_quantity} {selectedRecipe.yield_unit}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Tabla Nutricional por 100g</Divider>

            <Row gutter={[16, 16]}>
              {Object.entries(selectedRecipe.nutritionInfo.nutrition_per_100g).map(([key, value]) => (
                <Col span={8} key={key}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic
                      title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      value={value}
                      precision={2}
                      suffix={key.includes('_mg') ? 'mg' : key.includes('_g') ? 'g' : key.includes('kcal') ? 'kcal' : ''}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>

      {/* Modal análisis de costos */}
      <Modal
        title="Análisis de Costos y Rentabilidad"
        open={costModalVisible}
        onCancel={() => setCostModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCostModalVisible(false)}>
            Cerrar
          </Button>
        ]}
        width={900}
      >
        {costAnalysis && (
          <Tabs defaultActiveKey="costs">
            <TabPane tab="Costos Detallados" key="costs">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Costo Total"
                    value={costAnalysis.cost.totals?.total_cost || 0}
                    prefix="$"
                    precision={2}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Costo por Unidad"
                    value={costAnalysis.cost.totals?.cost_per_unit || 0}
                    prefix="$"
                    precision={2}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Costo por Gramo"
                    value={costAnalysis.cost.totals?.cost_per_gram || 0}
                    prefix="$"
                    precision={4}
                  />
                </Col>
              </Row>
            </TabPane>
            
            <TabPane tab="Rentabilidad" key="profitability">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Margen de Ganancia"
                    value={costAnalysis.profitability.margins?.profit_margin || 0}
                    suffix="%"
                    precision={1}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Precio Sugerido"
                    value={costAnalysis.profitability.suggested_prices?.conservative || 0}
                    prefix="$"
                    precision={2}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="ROI Estimado"
                    value={costAnalysis.profitability.roi?.estimated_roi || 0}
                    suffix="%"
                    precision={1}
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </Card>
  )
}

export default ComplexRecipes