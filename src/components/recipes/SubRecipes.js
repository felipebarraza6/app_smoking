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
  PrinterOutlined
} from '@ant-design/icons'
import { recipesAPI } from '../../api/endpoints/recipes'
import jsPDF from 'jspdf'

const { Option } = Select
const { TextArea } = Input
const { Text, Paragraph } = Typography

const SubRecipes = () => {
  const [subRecipes, setSubRecipes] = useState([])
  const [nutritionalIngredients, setNutritionalIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [nutritionModalVisible, setNutritionModalVisible] = useState(false)
  const [editingSubRecipe, setEditingSubRecipe] = useState(null)
  const [selectedSubRecipe, setSelectedSubRecipe] = useState(null)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [ingredientQuantities, setIngredientQuantities] = useState({})
  const [calculatedNutrition, setCalculatedNutrition] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchSubRecipes()
    fetchNutritionalIngredients()
  }, [])

  /**
   * Obtiene las sub-recetas desde la API
   * Asegura que el resultado siempre sea un array para evitar errores
   */
  const fetchSubRecipes = async () => {
    setLoading(true)
    try {
      const response = await recipesAPI.getRecipes({ recipe_type: 'SUB_RECIPE' })
      // Asegurar que siempre sea un array
      const recipes = response.data?.results || response.data || []
      setSubRecipes(Array.isArray(recipes) ? recipes : [])
    } catch (error) {
      console.error('Error al cargar sub-recetas:', error)
      message.error('Error al cargar sub-recetas')
      setSubRecipes([]) // Asegurar que siempre sea un array
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
        key: ing.id.toString()
      })))
    } catch (error) {
      console.error('Error al cargar ingredientes nutricionales:', error)
      message.error('Error al cargar ingredientes nutricionales')
      setNutritionalIngredients([]) // Asegurar que siempre sea un array
    }
  }

  const handleAddSubRecipe = () => {
    form.resetFields()
    setEditingSubRecipe(null)
    setSelectedIngredients([])
    setIngredientQuantities({})
    setCalculatedNutrition(null)
    setModalVisible(true)
  }

  const handleEditSubRecipe = async (subRecipe) => {
    setEditingSubRecipe(subRecipe)
    form.setFieldsValue({
      name: subRecipe.name,
      description: subRecipe.description,
      yield_quantity: subRecipe.yield_quantity,
      yield_unit: subRecipe.yield_unit,
      instructions: subRecipe.instructions,
      notes: subRecipe.notes
    })

    // Cargar ingredientes de la sub-receta
    try {
      const response = await recipesAPI.getIngredients({ recipe: subRecipe.id })
      const recipeIngredients = response.data.results || response.data
      const selectedIds = recipeIngredients.map(ing => ing.ingredient.toString())
      const quantities = {}
      recipeIngredients.forEach(ing => {
        quantities[ing.ingredient] = {
          quantity: ing.quantity,
          unit: ing.unit
        }
      })
      
      setSelectedIngredients(selectedIds)
      setIngredientQuantities(quantities)
    } catch (error) {
      console.error('Error loading recipe ingredients:', error)
    }

    setModalVisible(true)
  }

  const handleSubmit = async (values) => {
    if (selectedIngredients.length === 0) {
      message.error('Debe seleccionar al menos un ingrediente')
      return
    }

    try {
      const subRecipeData = {
        ...values,
        recipe_type: 'SUB_RECIPE',
        has_nutritional_calculation: true,
        // Aquí necesitarías el producto resultante - podrías crearlo automáticamente
        resulting_product: editingSubRecipe?.resulting_product?.id
      }

      let savedRecipe
      if (editingSubRecipe) {
        const response = await recipesAPI.updateRecipe(editingSubRecipe.id, subRecipeData)
        savedRecipe = response.data
        message.success('Sub-receta actualizada exitosamente')
      } else {
        const response = await recipesAPI.createRecipe(subRecipeData)
        savedRecipe = response.data
        message.success('Sub-receta creada exitosamente')
      }

      // Agregar ingredientes a la receta
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

      // Calcular información nutricional
      await recipesAPI.calculateNutrition(savedRecipe.id)

      setModalVisible(false)
      fetchSubRecipes()
    } catch (error) {
      console.error('Error:', error)
      message.error('Error al guardar la sub-receta')
    }
  }

  const handleDeleteSubRecipe = async (id) => {
    try {
      await recipesAPI.deleteRecipe(id)
      message.success('Sub-receta eliminada exitosamente')
      fetchSubRecipes()
    } catch (error) {
      message.error('Error al eliminar la sub-receta')
    }
  }

  const handleTransferChange = (targetKeys) => {
    setSelectedIngredients(targetKeys)
    
    // Limpiar cantidades de ingredientes no seleccionados
    const newQuantities = { ...ingredientQuantities }
    Object.keys(newQuantities).forEach(key => {
      if (!targetKeys.includes(key)) {
        delete newQuantities[key]
      }
    })
    setIngredientQuantities(newQuantities)
  }

  const handleQuantityChange = (ingredientId, field, value) => {
    setIngredientQuantities(prev => ({
      ...prev,
      [ingredientId]: {
        ...prev[ingredientId],
        [field]: value
      }
    }))
  }

  const calculatePreviewNutrition = () => {
    // Simulación del cálculo nutricional local
    let totalWeight = 0
    const nutrition = {
      energy_kcal: 0,
      proteins_g: 0,
      total_fats_g: 0,
      saturated_fats_g: 0,
      carbohydrates_g: 0,
      sodium_mg: 0
    }

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

    // Convertir a valores por 100g
    if (totalWeight > 0) {
      Object.keys(nutrition).forEach(field => {
        nutrition[field] = (nutrition[field] / totalWeight) * 100
      })
    }

    setCalculatedNutrition({ ...nutrition, totalWeight })
  }

  const convertToGrams = (quantity, unit) => {
    const conversions = {
      'g': 1,
      'kg': 1000,
      'ml': 1,
      'l': 1000,
      'unidad': 100 // Asumimos peso promedio
    }
    return quantity * (conversions[unit] || 1)
  }

  /**
   * Carga y muestra la información nutricional de una sub-receta
   */
  const viewNutritionInfo = async (subRecipe) => {
    try {
      const response = await recipesAPI.getNutritionLabel(subRecipe.id)
      setSelectedSubRecipe({ ...subRecipe, nutritionInfo: response.data })
      setNutritionModalVisible(true)
    } catch (error) {
      console.error('Error al cargar información nutricional:', error)
      message.error('Error al cargar información nutricional')
    }
  }

  /**
   * Genera un PDF profesional con la etiqueta nutricional de la sub-receta
   * Formato similar a etiquetas comerciales con toda la información requerida
   */
  const printNutritionLabel = async (subRecipe) => {
    try {
      // Obtener datos nutricionales y detalles completos de la receta
      const [nutritionResponse, recipeResponse] = await Promise.all([
        recipesAPI.getNutritionLabel(subRecipe.id),
        recipesAPI.getRecipe(subRecipe.id)
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
      const productName = subRecipe.name || recipeData.name || 'Producto'
      pdf.text(productName, leftSectionX, yPos, { maxWidth: leftSectionWidth })
      yPos += 12

      // Volumen/Cantidad
      if (subRecipe.yield_quantity || recipeData.yield_quantity) {
        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        const volume = `${subRecipe.yield_quantity || recipeData.yield_quantity} ${subRecipe.yield_unit || recipeData.yield_unit || 'g'}`
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
      const servingSize = subRecipe.yield_quantity || recipeData.yield_quantity || 120
      const servingUnit = subRecipe.yield_unit || recipeData.yield_unit || 'g'
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
      render: () => <Tag color="green">Sub-receta</Tag>
    },
    {
      title: 'Rendimiento',
      key: 'yield',
      width: 150,
      render: (_, record) => `${record.yield_quantity} ${record.yield_unit}`
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
      title: 'Última Actualización',
      dataIndex: 'last_nutritional_calculation',
      key: 'last_nutritional_calculation',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-'
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
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
            title="Generar PDF etiqueta nutricional"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSubRecipe(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar esta sub-receta?"
            onConfirm={() => handleDeleteSubRecipe(record.id)}
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

  const renderIngredientQuantityForm = ({ key, title }) => {
    const quantities = ingredientQuantities[key] || { quantity: '', unit: 'g' }
    
    return (
      <div style={{ padding: '8px 0' }}>
        <Text strong>{title}</Text>
        <Row gutter={8} style={{ marginTop: 4 }}>
          <Col span={12}>
            <InputNumber
              size="small"
              placeholder="Cantidad"
              value={quantities.quantity}
              onChange={(value) => handleQuantityChange(key, 'quantity', value)}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
            />
          </Col>
          <Col span={12}>
            <Select
              size="small"
              value={quantities.unit}
              onChange={(value) => handleQuantityChange(key, 'unit', value)}
              style={{ width: '100%' }}
            >
              <Option value="g">g</Option>
              <Option value="kg">kg</Option>
              <Option value="ml">ml</Option>
              <Option value="l">l</Option>
              <Option value="unidad">unidad</Option>
            </Select>
          </Col>
        </Row>
      </div>
    )
  }

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined />
          Gestión de Sub-recetas
        </Space>
      }
      extra={
        <Flex gap="small" align="center">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSubRecipe}
          >
            Nueva Sub-receta
          </Button>
        </Flex>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic
            title="Total Sub-recetas"
            value={Array.isArray(subRecipes) ? subRecipes.length : 0}
            prefix={<ExperimentOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Con Cálculo Nutricional"
            value={Array.isArray(subRecipes) ? subRecipes.filter(r => r?.has_nutritional_calculation).length : 0}
            prefix={<CalculatorOutlined />}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={Array.isArray(subRecipes) ? subRecipes : []}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} sub-recetas`
        }}
      />

      <Modal
        title={editingSubRecipe ? 'Editar Sub-receta' : 'Nueva Sub-receta'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nombre de la Sub-receta"
                rules={[{ required: true, message: 'Ingrese el nombre' }]}
              >
                <Input placeholder="Ej: Base de Leche, Pasta de Maní" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Descripción"
              >
                <Input placeholder="Descripción de la sub-receta" />
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
                  placeholder="1000"
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
          </Row>

          <Divider orientation="left">Ingredientes</Divider>

          <Transfer
            dataSource={nutritionalIngredients}
            titles={['Ingredientes Disponibles', 'Ingredientes Seleccionados']}
            targetKeys={selectedIngredients}
            onChange={handleTransferChange}
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
                  return (
                    <Col span={12} key={ingredientId}>
                      {renderIngredientQuantityForm({
                        key: ingredientId,
                        title: ingredient?.name || 'Ingrediente'
                      })}
                    </Col>
                  )
                })}
              </Row>

              <Row style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Button
                    type="dashed"
                    onClick={calculatePreviewNutrition}
                    icon={<CalculatorOutlined />}
                  >
                    Calcular Información Nutricional (Preview)
                  </Button>
                </Col>
              </Row>

              {calculatedNutrition && (
                <Card size="small" title="Vista Previa Nutricional" style={{ marginTop: 8 }}>
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
                </Card>
              )}
            </div>
          )}

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Form.Item
                name="instructions"
                label="Instrucciones de Preparación"
              >
                <TextArea
                  rows={4}
                  placeholder="Instrucciones detalladas de preparación..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="notes"
                label="Notas Adicionales"
              >
                <TextArea
                  rows={4}
                  placeholder="Notas, consejos, advertencias..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingSubRecipe ? 'Actualizar' : 'Crear'} Sub-receta
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Información Nutricional"
        open={nutritionModalVisible}
        onCancel={() => setNutritionModalVisible(false)}
        footer={[
          <Button 
            key="print" 
            icon={<PrinterOutlined />}
            type="primary"
            onClick={() => selectedSubRecipe && printNutritionLabel(selectedSubRecipe)}
          >
            Generar PDF Etiqueta
          </Button>,
          <Button key="close" onClick={() => setNutritionModalVisible(false)}>
            Cerrar
          </Button>
        ]}
        width={600}
      >
        {selectedSubRecipe?.nutritionInfo && (
          <div>
            <Descriptions title="Información General" bordered size="small">
              <Descriptions.Item label="Producto" span={3}>
                {selectedSubRecipe.name}
              </Descriptions.Item>
              <Descriptions.Item label="Peso Total">
                {selectedSubRecipe.nutritionInfo.total_weight_grams} g
              </Descriptions.Item>
              <Descriptions.Item label="Última Actualización" span={2}>
                {new Date(selectedSubRecipe.nutritionInfo.last_calculation).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Información Nutricional por 100g</Divider>

            <Row gutter={16}>
              {Object.entries(selectedSubRecipe.nutritionInfo.nutrition_per_100g).map(([key, value]) => (
                <Col span={12} key={key} style={{ marginBottom: 8 }}>
                  <Statistic
                    title={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={value}
                    precision={2}
                    suffix={key.includes('_mg') ? 'mg' : key.includes('_g') ? 'g' : key.includes('kcal') ? 'kcal' : ''}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default SubRecipes