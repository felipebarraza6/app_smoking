/** @jsxImportSource @emotion/react */
import React, { useContext, useState, useRef } from "react";
import { 
  Row, 
  Col, 
  Card, 
  InputNumber, 
  Button, 
  Upload, 
  Input,
  Space,
  Statistic,
  Alert,
  Tag,
  Divider,
  Image
} from "antd";
import { 
  CameraOutlined, 
  EnvironmentOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

import { MeasurementsContext } from "../../../containers/Measurements";

const { TextArea } = Input;

/**
 * Paso 2: Tomar Lectura del Medidor
 * Permite ingresar la lectura actual, tomar fotos y agregar notas
 */

const TakeReading = () => {
  const { state, dispatch } = useContext(MeasurementsContext);
  const { readings, clients, locations, settings } = state;
  const [photoLoading, setPhotoLoading] = useState(false);
  const cameraInputRef = useRef(null);

  // Manejar cambio de lectura actual
  const handleReadingChange = (value) => {
    const previousReading = clients.selected?.last_reading_value || 0;
    const unitPrice = clients.selected?.service_rate || 1500; // Precio por m³

    dispatch({
      type: "SET_CURRENT_READING",
      payload: {
        current_reading: value,
        previous_reading: previousReading,
        unit_price: unitPrice
      }
    });
  };

  // Tomar foto con cámara
  const handleTakePhoto = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Manejar foto capturada
  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoLoading(true);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = {
          id: Date.now(),
          file: file,
          preview: e.target.result,
          timestamp: new Date().toISOString(),
          location: locations.current_position
        };
        
        dispatch({ type: "ADD_READING_PHOTO", payload: photoData });
        setPhotoLoading(false);
      };
      reader.readAsDataURL(file);
      
      // Reset input
      event.target.value = "";
    }
  };

  // Eliminar foto
  const handleRemovePhoto = (index) => {
    dispatch({ type: "REMOVE_READING_PHOTO", payload: index });
  };

  // Actualizar GPS
  const updateGPS = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        dispatch({
          type: "SET_CURRENT_LOCATION",
          payload: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          }
        });
      },
      (error) => {
        dispatch({
          type: "SET_GPS_ERROR",
          payload: "No se pudo obtener la ubicación GPS"
        });
      }
    );
  };

  // Validar si se puede proceder
  const canProceed = () => {
    const hasReading = !!readings.current_reading;
    const hasPhotos = !settings.require_photos || readings.photos.length > 0;
    const hasGPS = !settings.gps_required || !!locations.current_position;
    
    return hasReading && hasPhotos && hasGPS;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Row gutter={[16, 16]}>
        {/* Información del cliente */}
        <Col span={24}>
          <Card size="small" title="Información del Servicio">
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Cliente"
                  value={clients.selected?.name}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Última Lectura"
                  value={clients.selected?.last_reading_value || 0}
                  suffix="m³"
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="Fecha Anterior"
                  value={clients.selected?.last_reading_date || "N/A"}
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Ingreso de lectura */}
        <Col xs={24} md={12}>
          <Card title="Lectura Actual" size="small">
            <Space direction="vertical" style={{ width: "100%" }}>
              <InputNumber
                placeholder="Ingrese la lectura del medidor"
                style={{ width: "100%", height: 50, fontSize: 18 }}
                min={readings.previous_reading || 0}
                precision={2}
                value={readings.current_reading}
                onChange={handleReadingChange}
                addonAfter="m³"
                size="large"
              />
              
              {readings.current_reading && (
                <Alert
                  message={`Consumo: ${readings.consumption?.toFixed(2) || 0} m³`}
                  description={`Total a facturar: $${readings.total_amount?.toLocaleString('es-CL') || 0}`}
                  type="info"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />
              )}
            </Space>
          </Card>
        </Col>

        {/* Ubicación GPS */}
        <Col xs={24} md={12}>
          <Card 
            title="Ubicación GPS" 
            size="small"
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={updateGPS}
                size="small"
              >
                Actualizar
              </Button>
            }
          >
            {locations.current_position ? (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Tag icon={<EnvironmentOutlined />} color="green">
                  GPS Activo
                </Tag>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Lat: {locations.current_position.latitude?.toFixed(6)}<br/>
                  Lng: {locations.current_position.longitude?.toFixed(6)}
                </div>
              </Space>
            ) : (
              <Alert
                message="GPS no disponible"
                description="No se pudo obtener la ubicación"
                type="warning"
                showIcon
              />
            )}
          </Card>
        </Col>

        {/* Captura de fotos */}
        <Col span={24}>
          <Card 
            title={`Fotografías del Medidor ${settings.require_photos ? "(Obligatorio)" : ""}`}
            size="small"
            extra={
              <Button 
                type="primary"
                icon={<CameraOutlined />}
                onClick={handleTakePhoto}
                loading={photoLoading}
              >
                Tomar Foto
              </Button>
            }
          >
            {/* Input oculto para cámara */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={handlePhotoCapture}
            />

            {/* Galería de fotos */}
            {readings.photos.length > 0 ? (
              <Row gutter={[8, 8]}>
                {readings.photos.map((photo, index) => (
                  <Col xs={12} sm={8} md={6} key={photo.id}>
                    <div style={{ position: "relative" }}>
                      <Image
                        src={photo.preview}
                        alt={`Foto ${index + 1}`}
                        style={{ width: "100%", borderRadius: 4 }}
                        preview={{
                          mask: "Ver foto"
                        }}
                      />
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{ 
                          position: "absolute",
                          top: 4,
                          right: 4
                        }}
                        onClick={() => handleRemovePhoto(index)}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: 40, 
                color: "#999",
                border: "2px dashed #d9d9d9",
                borderRadius: 4
              }}>
                <CameraOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>No hay fotos capturadas</p>
                <Button 
                  type="primary"
                  icon={<CameraOutlined />}
                  onClick={handleTakePhoto}
                >
                  Tomar Primera Foto
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Notas adicionales */}
        <Col span={24}>
          <Card title="Observaciones" size="small">
            <TextArea
              placeholder="Agregar notas, observaciones o comentarios sobre la medición..."
              rows={3}
              value={readings.notes}
              onChange={(e) => dispatch({ 
                type: "UPDATE_READING_NOTES", 
                payload: e.target.value 
              })}
            />
          </Card>
        </Col>

        {/* Resumen antes de continuar */}
        {canProceed() && (
          <Col span={24}>
            <Card 
              title="Resumen de la Medición"
              size="small"
              style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f" }}
            >
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Lectura Anterior"
                    value={readings.previous_reading}
                    suffix="m³"
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Lectura Actual"
                    value={readings.current_reading}
                    suffix="m³"
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Consumo"
                    value={readings.consumption}
                    suffix="m³"
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total"
                    value={`$${readings.total_amount?.toLocaleString('es-CL')}`}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </motion.div>
  );
};

export default TakeReading;