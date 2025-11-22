import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Input,
  InputNumber,
  Select,
  Button,
  Table,
  Typography,
  Divider,
  Space,
  Alert,
  Statistic,
  Tag,
  Progress,
  message,
  Form,
  Modal,
  Descriptions,
  Flex
} from 'antd'
import {
  CalculatorOutlined,
  ExperimentOutlined,
  PrinterOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons'
import { recipesAPI } from '../../api/endpoints/recipes'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const NutritionCalculator = () => {
  const [ingredients, setIngredients] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [calculatedNutrition, setCalculatedNutrition] = useState(null)
  const [totalWeight, setTotalWeight] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchAvailableIngredients()
  }, [])

  /**
   * Obtiene los ingredientes nutricionales disponibles desde la API
   * Maneja errores y asegura que siempre sea un array
   */
  const fetchAvailableIngredients = async () => {
    try {
      const response = await recipesAPI.getNutritionalIngredients()
      // Validar que response.data sea un array
      const ingredients = Array.isArray(response.data) ? response.data : []
      setAvailableIngredients(ingredients)
    } catch (error) {
      console.error('Error al cargar ingredientes disponibles:', error)
      message.error('Error al cargar ingredientes disponibles')
      setAvailableIngredients([]) // Asegurar que siempre sea un array
    }
  }

  const addIngredient = (values) => {
    const selectedIngredient = availableIngredients.find(ing => ing.id === values.ingredient_id)
    if (!selectedIngredient) {
      message.error('Ingrediente no encontrado')
      return
    }

    const newIngredient = {
      id: Date.now(), // ID temporal para el frontend
      ingredient: selectedIngredient,
      quantity: values.quantity,
      unit: values.unit,
      weight_grams: convertToGrams(values.quantity, values.unit, selectedIngredient)
    }

    setIngredients([...ingredients, newIngredient])
    form.resetFields()
    setModalVisible(false)
    calculateNutrition([...ingredients, newIngredient])
  }

  const removeIngredient = (id) => {
    const newIngredients = ingredients.filter(ing => ing.id !== id)
    setIngredients(newIngredients)
    calculateNutrition(newIngredients)
  }

  const updateIngredientQuantity = (id, quantity, unit) => {
    const newIngredients = ingredients.map(ing => {
      if (ing.id === id) {
        return {
          ...ing,
          quantity,
          unit,
          weight_grams: convertToGrams(quantity, unit, ing.ingredient)
        }
      }
      return ing
    })
    
    setIngredients(newIngredients)
    calculateNutrition(newIngredients)
  }

  const convertToGrams = (quantity, unit, ingredient = null) => {
    const conversions = {
      'g': 1,
      'kg': 1000,
      'ml': 1, // Para líquidos, asumimos densidad ~1
      'l': 1000,
      'unidad': ingredient?.average_weight_grams || 100
    }
    
    return quantity * (conversions[unit] || 1)
  }

  const calculateNutrition = (ingredientsList) => {
    if (ingredientsList.length === 0) {
      setCalculatedNutrition(null)
      setTotalWeight(0)
      return
    }

    let total_weight = 0
    const nutrition_totals = {
      energy_kcal: 0,
      proteins_g: 0,
      total_fats_g: 0,
      saturated_fats_g: 0,
      monounsaturated_fats_g: 0,
      polyunsaturated_fats_g: 0,
      cholesterol_mg: 0,
      carbohydrates_g: 0,
      total_sugars_g: 0,
      sodium_mg: 0,
      fiber_g: 0
    }

    // Calcular aportes nutricionales de cada ingrediente
    ingredientsList.forEach(item => {
      const weightGrams = item.weight_grams
      total_weight += weightGrams

      // Aplicar fórmula: (valor_por_100g * cantidad_en_gramos) / 100
      Object.keys(nutrition_totals).forEach(field => {
        const ingredientValue = item.ingredient[field]
        if (ingredientValue && weightGrams) {
          nutrition_totals[field] += (ingredientValue * weightGrams) / 100
        }
      })
    })

    // Convertir a valores por 100g del producto final
    const nutrition_per_100g = {}
    if (total_weight > 0) {
      Object.keys(nutrition_totals).forEach(field => {
        nutrition_per_100g[field] = (nutrition_totals[field] / total_weight) * 100
      })
    } else {
      Object.keys(nutrition_totals).forEach(field => {
        nutrition_per_100g[field] = 0
      })
    }

    setCalculatedNutrition({
      totals: nutrition_totals,
      per_100g: nutrition_per_100g,
      total_weight_grams: total_weight
    })
    setTotalWeight(total_weight)
  }

  const exportNutritionLabel = () => {
    if (!calculatedNutrition) {
      message.error('No hay datos nutricionales para exportar')
      return
    }

    // Aquí podrías implementar la generación de PDF con jsPDF
    // que ya tienes instalado en tu proyecto
    const nutritionData = {
      product_name: "Producto Personalizado",
      total_weight_grams: calculatedNutrition.total_weight_grams,
      nutrition_per_100g: calculatedNutrition.per_100g,
      ingredients_list: ingredients.map(ing => ({
        name: ing.ingredient.name,
        quantity: ing.quantity,
        unit: ing.unit,
        supplier: ing.ingredient.supplier_company
      }))
    }

    console.log('Datos para exportar:', nutritionData)
    message.success('Funcionalidad de exportación en desarrollo')
  }

  const resetCalculator = () => {
    setIngredients([])
    setCalculatedNutrition(null)
    setTotalWeight(0)
    form.resetFields()
  }

  const ingredientsColumns = [
    {
      title: 'Ingrediente',
      dataIndex: ['ingredient', 'name'],
      key: 'ingredient_name',
      width: 200
    },
    {
      title: 'Empresa',
      dataIndex: ['ingredient', 'supplier_company'],
      key: 'supplier',
      width: 150,
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Cantidad',
      key: 'quantity',
      width: 150,
      render: (_, record) => (
        <Input.Group compact>
          <InputNumber
            style={{ width: '60%' }}
            value={record.quantity}
            onChange={(value) => updateIngredientQuantity(record.id, value, record.unit)}
            min={0}
            step={0.01}
            precision={2}
          />
          <Select
            style={{ width: '40%' }}
            value={record.unit}
            onChange={(value) => updateIngredientQuantity(record.id, record.quantity, value)}
          >
            <Option value="g">g</Option>
            <Option value="kg">kg</Option>
            <Option value="ml">ml</Option>
            <Option value="l">l</Option>
            <Option value="unidad">unidad</Option>
          </Select>
        </Input.Group>
      )
    },
    {
      title: 'Peso (g)',
      dataIndex: 'weight_grams',
      key: 'weight_grams',
      width: 100,
      render: (weight) => `${weight.toFixed(2)} g`
    },
    {
      title: 'Energía Aporte',
      key: 'energy_contribution',
      width: 120,
      render: (_, record) => {
        const contribution = record.ingredient.energy_kcal ? 
          (record.ingredient.energy_kcal * record.weight_grams) / 100 : 0
        return `${contribution.toFixed(1)} kcal`
      }
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeIngredient(record.id)}
        />
      )
    }
  ]

  const nutritionFields = [
    { key: 'energy_kcal', label: 'Energía', unit: 'kcal', color: '#1890ff' },
    { key: 'proteins_g', label: 'Proteínas', unit: 'g', color: '#52c41a' },
    { key: 'total_fats_g', label: 'Grasas Totales', unit: 'g', color: '#fa8c16' },
    { key: 'saturated_fats_g', label: 'Grasas Saturadas', unit: 'g', color: '#eb2f96' },
    { key: 'monounsaturated_fats_g', label: 'Grasas Monoinsaturadas', unit: 'g', color: '#722ed1' },
    { key: 'polyunsaturated_fats_g', label: 'Grasas Poliinsaturadas', unit: 'g', color: '#13c2c2' },
    { key: 'cholesterol_mg', label: 'Colesterol', unit: 'mg', color: '#f5222d' },
    { key: 'carbohydrates_g', label: 'Carbohidratos', unit: 'g', color: '#fadb14' },
    { key: 'total_sugars_g', label: 'Azúcares Totales', unit: 'g', color: '#fa541c' },
    { key: 'sodium_mg', label: 'Sodio', unit: 'mg', color: '#2f54eb' },
    { key: 'fiber_g', label: 'Fibra Dietética', unit: 'g', color: '#389e0d' }
  ]

  return (
    <div>
      <Row gutter={16}>
        {/* Panel de ingredientes */}
        <Col span={14}>
          <Card
            title={
              <Space>
                <ExperimentOutlined />
                Calculadora Nutricional
              </Space>
            }
            extra={
              <Flex gap="small" align="center">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  Agregar Ingrediente
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={resetCalculator}
                  disabled={ingredients.length === 0}
                >
                  Limpiar
                </Button>
              </Flex>
            }
          >
            {ingredients.length === 0 ? (
              <Alert
                message="No hay ingredientes agregados"
                description="Agregue ingredientes para comenzar el cálculo nutricional"
                type="info"
                showIcon
              />
            ) : (
              <div>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Statistic
                      title="Ingredientes"
                      value={ingredients.length}
                      prefix={<ExperimentOutlined />}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Peso Total"
                      value={totalWeight.toFixed(2)}
                      suffix="g"
                    />
                  </Col>
                  <Col span={8}>
                    {calculatedNutrition && (
                      <Statistic
                        title="Energía Total"
                        value={calculatedNutrition.totals.energy_kcal.toFixed(1)}
                        suffix="kcal"
                      />
                    )}
                  </Col>
                </Row>

                <Table
                  columns={ingredientsColumns}
                  dataSource={ingredients}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                  scroll={{ x: true }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* Panel de resultados nutricionales */}
        <Col span={10}>
          <Card
            title={
              <Space>
                <CalculatorOutlined />
                Información Nutricional (por 100g)
              </Space>
            }
            extra={
              calculatedNutrition && (
                <Space>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={exportNutritionLabel}
                  >
                    Exportar Etiqueta
                  </Button>
                </Space>
              )
            }
          >
            {!calculatedNutrition ? (
              <Alert
                message="Agregue ingredientes para ver los resultados"
                type="info"
                showIcon
              />
            ) : (
              <div>
                <Descriptions
                  size="small"
                  bordered
                  column={1}
                  style={{ marginBottom: 16 }}
                >
                  <Descriptions.Item label="Peso Total del Producto">
                    <Text strong>{calculatedNutrition.total_weight_grams.toFixed(2)} gramos</Text>
                  </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">Valores por 100g</Divider>

                <Row gutter={[8, 8]}>
                  {nutritionFields.map(field => (
                    <Col span={24} key={field.key}>
                      <Card
                        size="small"
                        style={{
                          borderLeft: `4px solid ${field.color}`,
                          marginBottom: 4
                        }}
                      >
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text strong>{field.label}</Text>
                          </Col>
                          <Col>
                            <Text style={{ fontSize: '16px', color: field.color }}>
                              {calculatedNutrition.per_100g[field.key].toFixed(2)} {field.unit}
                            </Text>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Divider />

                <Alert
                  message="Ejemplo de Uso"
                  description={
                    <div>
                      <p>Con estos datos puede crear etiquetas nutricionales para productos de <strong>{calculatedNutrition.total_weight_grams.toFixed(0)}g</strong> siguiendo las normativas MINSAL Chile.</p>
                      <p>Los valores mostrados corresponden a la porción estándar de 100g.</p>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal para agregar ingrediente */}
      <Modal
        title="Agregar Ingrediente"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={addIngredient}
          requiredMark={false}
        >
          <Form.Item
            name="ingredient_id"
            label="Ingrediente"
            rules={[{ required: true, message: 'Seleccione un ingrediente' }]}
          >
            <Select
              showSearch
              placeholder="Buscar ingrediente..."
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {availableIngredients.map(ingredient => (
                <Option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} - {ingredient.supplier_company}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Cantidad"
                rules={[
                  { required: true, message: 'Ingrese la cantidad' },
                  { type: 'number', min: 0.01, message: 'Debe ser mayor a 0' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="5000"
                  min={0.01}
                  step={0.01}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unit"
                label="Unidad"
                rules={[{ required: true, message: 'Seleccione la unidad' }]}
              >
                <Select placeholder="Seleccione unidad">
                  <Option value="g">Gramos (g)</Option>
                  <Option value="kg">Kilogramos (kg)</Option>
                  <Option value="ml">Mililitros (ml)</Option>
                  <Option value="l">Litros (l)</Option>
                  <Option value="unidad">Unidad</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end" style={{ marginTop: 16 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Agregar Ingrediente
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default NutritionCalculator