/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Result,
  Space,
  Descriptions,
  Tag,
  Modal,
  Input,
  Select,
  Alert,
  Divider
} from "antd";
import { 
  CheckCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  PrinterOutlined,
  ReloadOutlined,
  CopyOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

import { MeasurementsContext } from "../../../containers/Measurements";

const { Option } = Select;

/**
 * Paso 4: Medición Completada
 * Muestra el resultado exitoso y permite generar documentos tributarios
 */

const CompletedMeasurement = () => {
  const { state, dispatch } = useContext(MeasurementsContext);
  const { measurements, clients, readings } = state;
  
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    document_type: "39", // Boleta por defecto
    customer_rut: clients.selected?.rut || clients.selected?.dni || "",
    customer_name: clients.selected?.name || "",
    customer_address: clients.selected?.address || "",
    customer_commune: "",
    customer_city: "",
    notes: ""
  });

  // Abrir modal para generar documento
  const handleGenerateDocument = () => {
    setDocumentModalVisible(true);
  };

  // Generar documento tributario
  const handleCreateDocument = async () => {
    setDocumentLoading(true);
    
    try {
      // Llamar API para generar documento desde la orden
      const documentData = {
        order_id: measurements.current?.id,
        ...documentForm
      };

      // Simular llamada API (reemplazar con la real)
      console.log("Generando documento:", documentData);
      
      // Aquí iría la llamada a la API del backend Django
      // const response = await api.finance.tax_documents.generate_from_order(documentData);
      
      // Simular éxito
      setTimeout(() => {
        setDocumentLoading(false);
        setDocumentModalVisible(false);
        
        Modal.success({
          title: "Documento Generado",
          content: (
            <div>
              <p>El documento tributario ha sido generado exitosamente.</p>
              <p><strong>Tipo:</strong> {documentForm.document_type === "39" ? "Boleta Electrónica" : "Factura Electrónica"}</p>
              <p><strong>Cliente:</strong> {documentForm.customer_name}</p>
              <p><strong>Monto:</strong> ${readings.total_amount?.toLocaleString('es-CL')}</p>
            </div>
          ),
        });
      }, 2000);
      
    } catch (error) {
      console.error("Error generando documento:", error);
      setDocumentLoading(false);
      Modal.error({
        title: "Error",
        content: "No se pudo generar el documento. Intente nuevamente.",
      });
    }
  };

  // Copiar información de la medición
  const copyMeasurementInfo = () => {
    const info = `
Medición Completada
Cliente: ${clients.selected?.name}
RUT: ${clients.selected?.rut || clients.selected?.dni}
Lectura Anterior: ${readings.previous_reading} m³
Lectura Actual: ${readings.current_reading} m³
Consumo: ${readings.consumption?.toFixed(2)} m³
Total: $${readings.total_amount?.toLocaleString('es-CL')}
Orden ID: ${measurements.current?.id}
Fecha: ${new Date().toLocaleString('es-CL')}
    `.trim();
    
    navigator.clipboard.writeText(info);
    Modal.success({
      title: "Copiado",
      content: "La información de la medición ha sido copiada al portapapeles.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Row gutter={[16, 16]}>
        {/* Resultado exitoso */}
        <Col span={24}>
          <Result
            status="success"
            title="¡Medición Completada Exitosamente!"
            subTitle={`Orden #${measurements.current?.id} creada y lista para facturar`}
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            extra={[
              <Button 
                type="primary" 
                key="generate-document"
                icon={<FileTextOutlined />}
                size="large"
                onClick={handleGenerateDocument}
              >
                Generar Documento
              </Button>,
              <Button 
                key="new-measurement"
                icon={<ReloadOutlined />}
                size="large"
                onClick={() => dispatch({ type: "RESET_MEASUREMENT_FORM" })}
              >
                Nueva Medición
              </Button>
            ]}
          />
        </Col>

        {/* Resumen de la orden creada */}
        <Col xs={24} lg={12}>
          <Card 
            title="Orden Creada" 
            size="small"
            extra={
              <Tag color="green" icon={<CheckCircleOutlined />}>
                COMPLETADA
              </Tag>
            }
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ID de Orden">
                <code>{measurements.current?.id}</code>
              </Descriptions.Item>
              <Descriptions.Item label="Cliente">
                {clients.selected?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha">
                {new Date().toLocaleString('es-CL')}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color="blue">COMPLETADA</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Estado de Pago">
                <Tag color="orange">PENDIENTE</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total">
                <strong style={{ fontSize: "16px", color: "#52c41a" }}>
                  ${readings.total_amount?.toLocaleString('es-CL')}
                </strong>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Detalles de la medición */}
        <Col xs={24} lg={12}>
          <Card title="Detalles de Consumo" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Lectura Anterior">
                {readings.previous_reading?.toFixed(2)} m³
              </Descriptions.Item>
              <Descriptions.Item label="Lectura Actual">
                {readings.current_reading?.toFixed(2)} m³
              </Descriptions.Item>
              <Descriptions.Item label="Consumo Total">
                <strong>{readings.consumption?.toFixed(2)} m³</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Precio por m³">
                ${readings.unit_price?.toLocaleString('es-CL')}
              </Descriptions.Item>
              <Descriptions.Item label="Fotos Capturadas">
                {readings.photos.length} imagen(es)
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Acciones adicionales */}
        <Col span={24}>
          <Card title="Acciones Disponibles" size="small">
            <Space wrap>
              <Button 
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleGenerateDocument}
              >
                Generar Boleta/Factura
              </Button>
              
              <Button 
                icon={<DollarOutlined />}
                onClick={() => console.log("Ir a pagos")}
              >
                Gestionar Pago
              </Button>
              
              <Button 
                icon={<PrinterOutlined />}
                onClick={() => console.log("Imprimir")}
              >
                Imprimir Resumen
              </Button>
              
              <Button 
                icon={<CopyOutlined />}
                onClick={copyMeasurementInfo}
              >
                Copiar Información
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modal para generar documento */}
      <Modal
        title="Generar Documento Tributario"
        visible={documentModalVisible}
        onCancel={() => setDocumentModalVisible(false)}
        onOk={handleCreateDocument}
        confirmLoading={documentLoading}
        width={600}
        okText="Generar Documento"
        cancelText="Cancelar"
      >
        <Alert
          message="Documento Tributario"
          description={`Se generará el documento para la orden #${measurements.current?.id} por $${readings.total_amount?.toLocaleString('es-CL')}`}
          type="info"
          style={{ marginBottom: 16 }}
        />

        <Row gutter={16}>
          <Col span={24}>
            <label>Tipo de Documento:</label>
            <Select
              style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
              value={documentForm.document_type}
              onChange={(value) => setDocumentForm({...documentForm, document_type: value})}
            >
              <Option value="39">Boleta Electrónica</Option>
              <Option value="33">Factura Electrónica</Option>
            </Select>
          </Col>

          <Col span={12}>
            <label>RUT del Cliente:</label>
            <Input
              style={{ marginTop: 4, marginBottom: 16 }}
              value={documentForm.customer_rut}
              onChange={(e) => setDocumentForm({...documentForm, customer_rut: e.target.value})}
              placeholder="12345678-9"
            />
          </Col>

          <Col span={12}>
            <label>Nombre del Cliente:</label>
            <Input
              style={{ marginTop: 4, marginBottom: 16 }}
              value={documentForm.customer_name}
              onChange={(e) => setDocumentForm({...documentForm, customer_name: e.target.value})}
              placeholder="Nombre completo"
            />
          </Col>

          <Col span={24}>
            <label>Dirección:</label>
            <Input
              style={{ marginTop: 4, marginBottom: 16 }}
              value={documentForm.customer_address}
              onChange={(e) => setDocumentForm({...documentForm, customer_address: e.target.value})}
              placeholder="Dirección completa"
            />
          </Col>

          <Col span={12}>
            <label>Comuna:</label>
            <Input
              style={{ marginTop: 4, marginBottom: 16 }}
              value={documentForm.customer_commune}
              onChange={(e) => setDocumentForm({...documentForm, customer_commune: e.target.value})}
              placeholder="Comuna"
            />
          </Col>

          <Col span={12}>
            <label>Ciudad:</label>
            <Input
              style={{ marginTop: 4, marginBottom: 16 }}
              value={documentForm.customer_city}
              onChange={(e) => setDocumentForm({...documentForm, customer_city: e.target.value})}
              placeholder="Ciudad"
            />
          </Col>

          <Col span={24}>
            <label>Observaciones:</label>
            <Input.TextArea
              style={{ marginTop: 4 }}
              rows={3}
              value={documentForm.notes}
              onChange={(e) => setDocumentForm({...documentForm, notes: e.target.value})}
              placeholder={`Medición de ${clients.selected?.service_type === "WATER" ? "agua" : "servicio"} - ${readings.consumption?.toFixed(2)} m³`}
            />
          </Col>
        </Row>
      </Modal>
    </motion.div>
  );
};

export default CompletedMeasurement;