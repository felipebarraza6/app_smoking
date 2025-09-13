import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Card,
  Space,
  Typography,
} from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  MailOutlined,
  IdcardOutlined,
  ProfileOutlined,
  ShopOutlined,
  UserOutlined,
  LockOutlined,
  CrownOutlined,
  SafetyOutlined,
  TeamOutlined,
  CarOutlined,
  EyeOutlined,
  DollarOutlined,
  CalculatorOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { MdOutlinePassword } from "react-icons/md";
import { UsersContext } from "../../../containers/Users";
import { controller } from "../../../controllers/users";
import api from "../../../api/endpoints";

import RUT from "rut-chile";

const { Text } = Typography;

const ROLES = [
  {
    value: "OWNER",
    label: "Propietario",
    icon: <CrownOutlined />,
    color: "#faad14",
  },
  {
    value: "ADMIN_LOCAL",
    label: "Administrador Local",
    icon: <SafetyOutlined />,
    color: "#ff4d4f",
  },
  {
    value: "MANAGER",
    label: "Gerente",
    icon: <TeamOutlined />,
    color: "#1890ff",
  },
  {
    value: "EMPLOYEE",
    label: "Empleado",
    icon: <UserOutlined />,
    color: "#52c41a",
  },
  {
    value: "CAJERO",
    label: "Cajero",
    icon: <DollarOutlined />,
    color: "#13c2c2",
  },
  {
    value: "METER",
    label: "Medidor",
    icon: <CalculatorOutlined />,
    color: "#eb2f96",
  },
  {
    value: "RECEIVER",
    label: "Recepcionista",
    icon: <PhoneOutlined />,
    color: "#722ed1",
  },
  {
    value: "DRIVER",
    label: "Conductor",
    icon: <CarOutlined />,
    color: "#fa8c16",
  },
  {
    value: "VIEWER",
    label: "Solo Lectura",
    icon: <EyeOutlined />,
    color: "#8c8c8c",
  },
];

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(UsersContext);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const rules_items = rules(state);

  const loadAvailableBranches = async () => {
    setLoadingBranches(true);
    try {
      const response = await api.branchs.my_branches();
      const branches = response.data || [];

      setAvailableBranches(branches);
    } catch (error) {
      message.error("Error al cargar sucursales disponibles");
      setAvailableBranches([]);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (!state.select_to_edit) {
      loadAvailableBranches();
    }
  }, [state.select_to_edit]);

  const onChangeDni = (e) => {
    let rut = RUT.format(e.target.value);
    form.setFieldsValue({ dni: rut });
    if (!RUT.validate(rut)) {
      form.setFields([{ name: "dni", errors: ["Rut invalido"] }]);
    }
  };

  const iconBtnLeft = state.select_to_edit ? (
    <RetweetOutlined />
  ) : (
    <PlusCircleFilled />
  );

  const iconBtnRight = state.select_to_edit ? (
    <ArrowLeftOutlined />
  ) : (
    <ClearOutlined />
  );

  const onClickCreateOrClear = () => {
    controller.create_update_form.create_or_clear({ state, dispatch, form });
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* Configuración de Acceso */}
      <Card
        title={
          <Space>
            <LockOutlined style={{ color: "#52c41a" }} />
            <Text strong>Configuración de Acceso</Text>
          </Space>
        }
        size="small"
      >
        {/* Solo mostrar el select de sucursal al crear, no al editar */}
        {!state.select_to_edit && (
          <Form.Item
            name="branch_id"
            label="Sucursal"
            rules={[{ required: true, message: "Selecciona una sucursal" }]}
          >
            <Select
              placeholder="Seleccionar sucursal"
              suffixIcon={<ShopOutlined />}
              loading={loadingBranches}
              optionLabelProp="label"
            >
              {(availableBranches || []).map((b) => (
                <Select.Option
                  key={b.branch?.id || b.id}
                  value={b.branch?.id || b.id}
                  label={
                    <Space>
                      <ShopOutlined style={{ color: "#1890ff" }} />
                      {b.branch?.business_name || b.business_name}
                    </Space>
                  }
                >
                  <Space>
                    <ShopOutlined style={{ color: "#1890ff" }} />
                    {b.branch?.business_name || b.business_name}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Select de rol al crear */}
        {!state.select_to_edit && (
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Selecciona un rol" }]}
          >
            <Select
              placeholder="Seleccionar rol"
              optionLabelProp="label"
            >
              {ROLES.map((role) => (
                <Select.Option
                  key={role.value}
                  value={role.value}
                  label={
                    <Space>
                      <span style={{ color: role.color }}>{role.icon}</span>
                      {role.label}
                    </Space>
                  }
                >
                  <Space>
                    <span style={{ color: role.color }}>{role.icon}</span>
                    {role.label}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Card>

      {/* Información Personal */}
      <Card
        title={
          <Space>
            <UserOutlined style={{ color: "#1890ff" }} />
            <Text strong>Información Personal</Text>
          </Space>
        }
        size="small"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="Nombre"
              rules={rules_items.first_name}
            >
              <Input
                placeholder="Nombre del usuario"
                prefix={<IdcardOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Apellido"
              rules={rules_items.last_name}
            >
              <Input
                placeholder="Apellido del usuario"
                prefix={<IdcardOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={rules_items.email}>
              <Input
                placeholder="email@ejemplo.com"
                prefix={<MailOutlined />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dni" label="RUT" rules={rules.dni}>
              <Input
                maxLength={12}
                placeholder="12.345.678-9"
                onChange={onChangeDni}
                prefix={<ProfileOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Contraseñas */}
      <Card
        title={
          <Space>
            <MdOutlinePassword style={{ color: "#faad14" }} />
            <Text strong>Contraseña</Text>
          </Space>
        }
        size="small"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={rules_items.password}
            >
              <Input
                placeholder={
                  state.select_to_edit
                    ? "Nueva contraseña"
                    : "Mínimo 8 caracteres"
                }
                type="password"
                prefix={<MdOutlinePassword />}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password_confirmation"
              label="Confirmar Contraseña"
              rules={rules_items.password_confirmation}
            >
              <Input
                placeholder="Repetir contraseña"
                type="password"
                prefix={<MdOutlinePassword />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Botones de Acción */}
      <Card
        size="small"
      >
        <Row justify="space-between" align="middle">
          <Col>
            {state.select_to_edit && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() =>
                  controller.create_update_form.clear_selection(dispatch)
                }
              >
                Cancelar Edición
              </Button>
            )}
          </Col>
          <Col>
            <Space>
              <Button
                onClick={onClickCreateOrClear}
                icon={iconBtnRight}
              >
                {state.select_to_edit ? "Crear" : "Limpiar"}
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                icon={iconBtnLeft}
              >
                {state.select_to_edit ? "Actualizar" : "Crear"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default FieldsForm;
