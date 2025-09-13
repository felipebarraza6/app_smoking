import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  List,
  Tag,
  Spin,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import api from "../../api/endpoints";

const { Title, Text } = Typography;

const DriverProfileTest = () => {
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState(null);
  const [error, setError] = useState(null);

  // Probar endpoint de lista de drivers
  const testDriverList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.drivers.list(1, {});
      console.log("📋 Driver List Response:", response);
      setDrivers(response.results || []);
    } catch (err) {
      console.error("❌ Error fetching drivers:", err);
      setError(`Error fetching drivers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Probar endpoint de drivers disponibles
  const testAvailableDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.drivers.get_available_drivers(2); // Branch ID 2
      console.log("🚗 Available Drivers Response:", response);
      setAvailableDrivers(response || []);
    } catch (err) {
      console.error("❌ Error fetching available drivers:", err);
      setError(`Error fetching available drivers: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Probar cálculo de costo de entrega
  const testDeliveryCost = async () => {
    setLoading(true);
    setError(null);
    try {
      const testData = {
        branch_id: 2,
        distance_km: 5.5,
        zone: "centro",
        delivery_type: "normal",
        weight_category: "medium",
      };

      const response = await api.drivers.calculate_delivery_cost(testData);
      console.log("💰 Delivery Cost Response:", response);
      setDeliveryCost(response);
    } catch (err) {
      console.error("❌ Error calculating delivery cost:", err);
      setError(`Error calculating delivery cost: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <Title level={2}>🧪 Driver Profile API Test</Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      )}

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Botones de prueba */}
        <Card title="🔧 API Tests">
          <Space wrap>
            <Button
              type="primary"
              onClick={testDriverList}
              loading={loading}
              icon={<UserOutlined />}
            >
              Test Driver List
            </Button>
            <Button
              onClick={testAvailableDrivers}
              loading={loading}
              icon={<CarOutlined />}
            >
              Test Available Drivers
            </Button>
            <Button
              onClick={testDeliveryCost}
              loading={loading}
              icon={<DollarOutlined />}
            >
              Test Delivery Cost
            </Button>
          </Space>
        </Card>

        {/* Resultados de Driver List */}
        {drivers.length > 0 && (
          <Card title={`📋 Driver Profiles (${drivers.length})`}>
            <List
              dataSource={drivers}
              renderItem={(driver) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserOutlined style={{ fontSize: "24px" }} />}
                    title={`${driver.user?.first_name} ${driver.user?.last_name}`}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>📧 {driver.user?.email}</Text>
                        <Text>
                          🚗 {driver.vehicle_plate} - {driver.vehicle_model}
                        </Text>
                        <Text>💰 Base Fee: ${driver.base_delivery_fee}</Text>
                        <Space>
                          <Tag color={driver.is_available ? "green" : "red"}>
                            {driver.is_available
                              ? "Disponible"
                              : "No Disponible"}
                          </Tag>
                          <Tag color="blue">
                            Sucursal: {driver.branch?.business_name}
                          </Tag>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Resultados de Available Drivers */}
        {availableDrivers.length > 0 && (
          <Card title={`🚗 Available Drivers (${availableDrivers.length})`}>
            <List
              dataSource={availableDrivers}
              renderItem={(driver) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <CheckCircleOutlined
                        style={{ fontSize: "24px", color: "#52c41a" }}
                      />
                    }
                    title={`${driver.user?.first_name} ${driver.user?.last_name}`}
                    description={
                      <Space direction="vertical" size="small">
                        <Text>📧 {driver.user?.email}</Text>
                        <Text>
                          🚗 {driver.vehicle_plate} - {driver.vehicle_model}
                        </Text>
                        <Text>💰 Base Fee: ${driver.base_delivery_fee}</Text>
                        <Text>
                          ⭐ Rating: {driver.customer_rating || "N/A"}
                        </Text>
                        <Text>📊 Deliveries: {driver.total_deliveries}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Resultados de Delivery Cost */}
        {deliveryCost && (
          <Card title="💰 Delivery Cost Calculation">
            <Space direction="vertical" size="middle">
              <div>
                <Text strong>Distance:</Text> {deliveryCost.distance_km} km
              </div>
              <div>
                <Text strong>Zone:</Text> {deliveryCost.zone}
              </div>
              <div>
                <Text strong>Delivery Type:</Text> {deliveryCost.delivery_type}
              </div>
              <div>
                <Text strong>Weight Category:</Text>{" "}
                {deliveryCost.weight_category}
              </div>
              <Divider />
              <div>
                <Text strong style={{ fontSize: "18px", color: "#52c41a" }}>
                  Total Cost: ${deliveryCost.total_cost}
                </Text>
              </div>
              {deliveryCost.recommended_driver && (
                <div>
                  <Text strong>Recommended Driver:</Text>{" "}
                  {deliveryCost.recommended_driver.user?.first_name}{" "}
                  {deliveryCost.recommended_driver.user?.last_name}
                </div>
              )}
            </Space>
          </Card>
        )}

        {/* Estado de carga */}
        {loading && (
          <Card>
            <div style={{ textAlign: "center" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>
                <Text>Testing API endpoints...</Text>
              </div>
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default DriverProfileTest;
