/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Descriptions,
  Image,
  Space,
  Alert,
  Modal,
  Spin
} from "antd";
import { 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

import { MeasurementsContext } from "../../../containers/Measurements";
import api from "../../../api/endpoints";

/**
 * Paso 3: Confirmar Medición
 * Muestra resumen completo y permite confirmar la medición para generar el documento
 */

const ConfirmMeasurement = () => {
  const { state, dispatch } = useContext(MeasurementsContext);
  const { readings, clients, locations, workflow } = state;
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Confirmar medición y crear orden
  const handleConfirmMeasurement = () => {
    Modal.confirm({
      title: "Confirmar Medición",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>¿Está seguro de confirmar esta medición?</p>
          <p><strong>Cliente:</strong> {clients.selected?.name}</p>
          <p><strong>Consumo:</strong> {readings.consumption?.toFixed(2)} m³</p>
          <p><strong>Total:</strong> ${readings.total_amount?.toLocaleString('es-CL')}</p>
          <Alert
            message="Una vez confirmada, se creará la orden y se podrá generar el documento tributario."
            type="info"
            style={{ marginTop: 16 }}
          />
        </div>
      ),
      onOk: async () => {
        await confirmMeasurement();
      },
      okText: "Confirmar",
      cancelText: "Cancelar",
      okButtonProps: { loading: confirmLoading }
    });
  };

  // Procesar confirmación
  const confirmMeasurement = async () => {
    setConfirmLoading(true);
    dispatch({ type: "SET_WORKFLOW_LOADING", payload: true });

    try {
      // 1. Crear la orden (measurement)
      const orderData = {
        client: clients.selected.id,
        order_type: "ORDER", // Tipo orden para mediciones
        status: "COMPLETED", // Ya completada porque tomamos la medición
        payment_status: "PENDING",
        total_amount: readings.total_amount,
        observation: readings.notes,
        // Datos específicos de medición
        latitude: locations.current_position?.latitude,
        longitude: locations.current_position?.longitude,
        address: clients.selected.address
      };

      const orderResponse = await api.orders.create(orderData);
      
      if (orderResponse.status === 201) {
        const order = orderResponse.data;

        // 2. Crear el producto/item de la medición
        const measurementProductData = {
          order: order.id,
          product: clients.selected.service_product_id || 1, // ID del producto "Medición de Agua"
          quantity: readings.consumption,
          unit_price: readings.unit_price,
          total_price: readings.total_amount,
          notes: `Lectura anterior: ${readings.previous_reading} m³, Lectura actual: ${readings.current_reading} m³`
        };

        await api.orders.register_products.create(measurementProductData);

        // 3. Actualizar estado y avanzar al paso final
        dispatch({
          type: "CREATE_MEASUREMENT_SUCCESS",
          payload: order
        });

        dispatch({ type: "NEXT_WORKFLOW_STEP" });

      } else {
        throw new Error("Error al crear la orden");
      }

    } catch (error) {
      console.error("Error confirmando medición:", error);
      dispatch({
        type: "SET_WORKFLOW_ERROR",
        payload: "Error al confirmar la medición. Intente nuevamente."
      });
    } finally {
      setConfirmLoading(false);
      dispatch({ type: "SET_WORKFLOW_LOADING", payload: false });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Row gutter={[16, 16]}>
        {/* Resumen de la medición */}
        <Col span={24}>
          <Card 
            title={
              <Space>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                Confirmar Medición
              </Space>
            }
            size="small"
          >
            <Alert
              message="Revise cuidadosamente los datos antes de confirmar"
              description="Una vez confirmada, se creará la orden en el sistema y se podrá generar el documento tributario."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Card>
        </Col>

        {/* Información del cliente */}
        <Col xs={24} lg={12}>
          <Card title="Información del Cliente" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Nombre">
                {clients.selected?.name}
              </Descriptions.Item>
              <Descriptions.Item label="RUT">
                {clients.selected?.rut || clients.selected?.dni}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {clients.selected?.address}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo de Servicio">
                {clients.selected?.service_type === "WATER" ? "Agua" :
                 clients.selected?.service_type === "GAS" ? "Gas" :
                 clients.selected?.service_type === "ELECTRICITY" ? "Electricidad" : "Otro"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Detalles de la medición */}
        <Col xs={24} lg={12}>
          <Card title="Detalles de la Medición" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Lectura Anterior">
                {readings.previous_reading?.toFixed(2)} m³
              </Descriptions.Item>
              <Descriptions.Item label="Lectura Actual">
                <strong style={{ color: "#1890ff" }}>
                  {readings.current_reading?.toFixed(2)} m³
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Consumo">
                <strong style={{ color: "#52c41a" }}>
                  {readings.consumption?.toFixed(2)} m³
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Precio Unitario">
                ${readings.unit_price?.toLocaleString('es-CL')} por m³
              </Descriptions.Item>
              <Descriptions.Item label="Total a Facturar">
                <strong style={{ color: "#fa541c", fontSize: "16px" }}>
                  ${readings.total_amount?.toLocaleString('es-CL')}
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Ubicación GPS */}
        {locations.current_position && (
          <Col xs={24} lg={12}>
            <Card title="Ubicación GPS" size="small">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Latitud">
                  {locations.current_position.latitude?.toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label="Longitud">
                  {locations.current_position.longitude?.toFixed(6)}
                </Descriptions.Item>
                <Descriptions.Item label="Timestamp">
                  {new Date(locations.current_position.timestamp).toLocaleString('es-CL')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Observaciones */}
        {readings.notes && (
          <Col xs={24} lg={12}>
            <Card title="Observaciones" size="small">
              <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {readings.notes}
              </p>
            </Card>
          </Col>
        )}

        {/* Fotografías */}
        {readings.photos.length > 0 && (
          <Col span={24}>
            <Card title={`Fotografías (${readings.photos.length})`} size="small">
              <Row gutter={[8, 8]}>
                {readings.photos.map((photo, index) => (
                  <Col xs={12} sm={8} md={6} lg={4} key={photo.id}>
                    <Image
                      src={photo.preview}
                      alt={`Foto ${index + 1}`}
                      style={{ 
                        width: "100%", 
                        borderRadius: 4,
                        border: "1px solid #d9d9d9"
                      }}
                      preview={{
                        mask: `Foto ${index + 1}`
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        )}

        {/* Botón de confirmación */}
        <Col span={24}>
          <Card size="small">
            <div style={{ textAlign: "center" }}>
              <Space direction="vertical" size="large">
                <div>
                  <h3 style={{ margin: 0, color: "#1890ff" }}>
                    Total de la Medición: ${readings.total_amount?.toLocaleString('es-CL')}
                  </h3>
                  <p style={{ margin: 0, color: "#666" }}>
                    {readings.consumption?.toFixed(2)} m³ × ${readings.unit_price?.toLocaleString('es-CL')}/m³
                  </p>
                </div>
                
                <Button
                  type="primary"
                  size="large"
                  icon={confirmLoading ? <Spin /> : <FileTextOutlined />}
                  loading={confirmLoading || workflow.loading}
                  onClick={handleConfirmMeasurement}
                  style={{ minWidth: 200 }}
                >
                  Confirmar y Crear Orden
                </Button>
                
                <p style={{ margin: 0, fontSize: 12, color: "#999" }}>
                  Al confirmar se creará la orden en estado COMPLETADO y estará lista para facturar
                </p>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default ConfirmMeasurement;