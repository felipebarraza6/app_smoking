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
  Divider
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { recipesAPI } from '../../api/endpoints/recipes'
import { Axios } from '../../api/config'

const { Option } = Select

const NutritionalIngredients = () => {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchIngredients()
  }, [])

  /**
   * Obtiene los ingredientes nutricionales desde la API
   * Maneja errores y asegura que siempre sea un array
   */
  const fetchIngredients = async () => {
    setLoading(true)
    try {
      const response = await recipesAPI.getNutritionalIngredients()
      // Validar que response.data sea un array
      const ingredients = Array.isArray(response.data) ? response.data : []
      setIngredients(ingredients)
    } catch (error) {
      console.error('Error al cargar insumos nutricionales:', error)
      message.error('Error al cargar insumos nutricionales')
      setIngredients([]) // Asegurar que siempre sea un array
    } finally {
      setLoading(false)
    }
  }

  const handleAddIngredient = () => {
    form.resetFields()
    setEditingIngredient(null)
    setModalVisible(true)
  }

  const handleEditIngredient = (ingredient) => {
    setEditingIngredient(ingredient)
    form.setFieldsValue({
      name: ingredient.name,
      supplier_company: ingredient.supplier_company,
      unit_measure: ingredient.measurement_unit || ingredient.unit_measure, // ✅ Compatibilidad con ambos nombres
      energy_kcal: ingredient.energy_kcal,
      proteins_g: ingredient.proteins_g,
      total_fats_g: ingredient.total_fats_g,
      saturated_fats_g: ingredient.saturated_fats_g,
      monounsaturated_fats_g: ingredient.monounsaturated_fats_g,
      polyunsaturated_fats_g: ingredient.polyunsaturated_fats_g,
      cholesterol_mg: ingredient.cholesterol_mg,
      carbohydrates_g: ingredient.carbohydrates_g,
      total_sugars_g: ingredient.total_sugars_g,
      sodium_mg: ingredient.sodium_mg,
      fiber_g: ingredient.fiber_g
    })
    setModalVisible(true)
  }

  /**
   * Guarda o actualiza un insumo nutricional
   * Los insumos nutricionales son Product, no RecipeIngredient
   * Por lo tanto, usamos el endpoint de productos de inventory
   */
  const handleSubmit = async (values) => {
    try {
      // Preparar datos del producto/insumo nutricional
      const productData = {
        name: values.name,
        supplier_company: values.supplier_company,
        measurement_unit: values.unit_measure || values.measurement_unit,
        is_nutritional_ingredient: true,
        product_type: 'RAW_MATERIAL', // Tipo correcto para ingredientes base
        // Campos nutricionales
        energy_kcal: values.energy_kcal || null,
        proteins_g: values.proteins_g || null,
        total_fats_g: values.total_fats_g || null,
        saturated_fats_g: values.saturated_fats_g || null,
        monounsaturated_fats_g: values.monounsaturated_fats_g || null,
        polyunsaturated_fats_g: values.polyunsaturated_fats_g || null,
        cholesterol_mg: values.cholesterol_mg || null,
        carbohydrates_g: values.carbohydrates_g || null,
        total_sugars_g: values.total_sugars_g || null,
        sodium_mg: values.sodium_mg || null,
        fiber_g: values.fiber_g || null,
        // Configuración básica
        is_for_sale: false, // Los insumos nutricionales no se venden directamente
        is_for_internal_use: true, // Son para uso interno en recetas
        tracks_inventory: true, // Pueden llevar control de inventario
        tracks_measurements: false,
        has_recipes: false
      }

      if (editingIngredient) {
        // Actualizar producto existente usando endpoint de inventory
        await Axios.patch(`inventory/products/${editingIngredient.id}/`, productData)
        message.success('Insumo actualizado exitosamente')
      } else {
        // Crear nuevo producto usando endpoint de inventory
        await Axios.post('inventory/products/', productData)
        message.success('Insumo creado exitosamente')
      }

      setModalVisible(false)
      fetchIngredients()
    } catch (error) {
      console.error('Error al guardar el insumo:', error)
      const errorMessage = error.response?.data?.error || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          'Error al guardar el insumo'
      message.error(errorMessage)
    }
  }

  /**
   * Elimina un insumo nutricional
   * Usa el endpoint de productos de inventory
   */
  const handleDeleteIngredient = async (id) => {
    try {
      await Axios.delete(`inventory/products/${id}/`)
      message.success('Insumo eliminado exitosamente')
      fetchIngredients()
    } catch (error) {
      console.error('Error al eliminar el insumo:', error)
      message.error('Error al eliminar el insumo')
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
      title: 'Empresa',
      dataIndex: 'supplier_company',
      key: 'supplier_company',
      width: 150
    },
    {
      title: 'Unidad',
      dataIndex: 'measurement_unit',
      key: 'measurement_unit',
      width: 80,
      render: (unit, record) => <Tag color="blue">{unit || record.unit_measure || '-'}</Tag> // ✅ Compatibilidad con ambos nombres
    },
    {
      title: 'Energía (kcal)',
      dataIndex: 'energy_kcal',
      key: 'energy_kcal',
      width: 120,
      render: (value) => value ? `${value}/100g` : '-'
    },
    {
      title: 'Proteínas (g)',
      dataIndex: 'proteins_g', 
      key: 'proteins_g',
      width: 120,
      render: (value) => value ? `${value}/100g` : '-'
    },
    {
      title: 'Grasas Totales (g)',
      dataIndex: 'total_fats_g',
      key: 'total_fats_g', 
      width: 140,
      render: (value) => value ? `${value}/100g` : '-'
    },
    {
      title: 'Carbohidratos (g)',
      dataIndex: 'carbohydrates_g',
      key: 'carbohydrates_g',
      width: 140,
      render: (value) => value ? `${value}/100g` : '-'
    },
    {
      title: 'Sodio (mg)',
      dataIndex: 'sodium_mg',
      key: 'sodium_mg',
      width: 120,
      render: (value) => value ? `${value}/100g` : '-'
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditIngredient(record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este insumo?"
            onConfirm={() => handleDeleteIngredient(record.id)}
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

  const nutritionFields = [
    { name: 'energy_kcal', label: 'Energía (kcal)', placeholder: 'Ej: 150' },
    { name: 'proteins_g', label: 'Proteínas (g)', placeholder: 'Ej: 8.5' },
    { name: 'total_fats_g', label: 'Grasas Totales (g)', placeholder: 'Ej: 12.3' },
    { name: 'saturated_fats_g', label: 'Grasas Saturadas (g)', placeholder: 'Ej: 3.2' },
    { name: 'monounsaturated_fats_g', label: 'Grasas Monoinsaturadas (g)', placeholder: 'Ej: 4.1' },
    { name: 'polyunsaturated_fats_g', label: 'Grasas Poliinsaturadas (g)', placeholder: 'Ej: 1.8' },
    { name: 'cholesterol_mg', label: 'Colesterol (mg)', placeholder: 'Ej: 25' },
    { name: 'carbohydrates_g', label: 'Hidratos de Carbono (g)', placeholder: 'Ej: 15.2' },
    { name: 'total_sugars_g', label: 'Azúcares Totales (g)', placeholder: 'Ej: 8.7' },
    { name: 'sodium_mg', label: 'Sodio (mg)', placeholder: 'Ej: 120' },
    { name: 'fiber_g', label: 'Fibra Dietética (g)', placeholder: 'Ej: 2.5' }
  ]

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined />
          Gestión de Insumos Nutricionales
        </Space>
      }
      extra={
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddIngredient}
          >
            Agregar Insumo
          </Button>
        </Space>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic
            title="Total Insumos"
            value={ingredients.length}
            prefix={<ExperimentOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Con Información Nutricional"
            value={ingredients.filter(i => i.energy_kcal).length}
            prefix={<InfoCircleOutlined />}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={ingredients}
        rowKey="id"
        loading={loading}
        scroll={{ x: 1200 }}
        size="middle"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} insumos`
        }}
      />

      <Modal
        title={editingIngredient ? 'Editar Insumo' : 'Nuevo Insumo Nutricional'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
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
                label="Nombre del Insumo"
                rules={[{ required: true, message: 'Ingrese el nombre' }]}
              >
                <Input placeholder="Ej: Leche Entera" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="supplier_company"
                label="Empresa de Origen"
                rules={[{ required: true, message: 'Ingrese la empresa' }]}
              >
                <Input placeholder="Ej: Soprole" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unit_measure"
                label="Unidad de Medida"
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

          <Divider orientation="left">
            <Space>
              <ExperimentOutlined />
              Información Nutricional (por 100g)
            </Space>
          </Divider>

          <Row gutter={16}>
            {nutritionFields.map((field, index) => (
              <Col span={12} key={field.name}>
                <Form.Item
                  name={field.name}
                  label={field.label}
                  rules={[
                    { type: 'number', min: 0, message: 'Debe ser un número positivo' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder={field.placeholder}
                    step={0.01}
                    precision={2}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Row justify="end" style={{ marginTop: 24 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingIngredient ? 'Actualizar' : 'Crear'} Insumo
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </Card>
  )
}

export default NutritionalIngredients