import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Select, Button, Row, message, Divider } from "antd";
import { rules } from "./rules_form";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  MailOutlined,
  IdcardOutlined,
  UserOutlined,
  ProfileOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { MdOutlinePassword } from "react-icons/md";
import { UsersContext } from "../../../containers/Users";
import { AppContext } from "../../../App";
import { controller } from "../../../controllers/users";
import api from "../../../api/endpoints";

import RUT from "rut-chile";

const USER_TYPES = [
  { value: "ADM", label: "Administrador del Sistema" },
  { value: "CL", label: "Cliente" },
];

const ROLES = [
  { value: "OWNER", label: "Propietario" },
  { value: "ADMIN", label: "Administrador" },
  { value: "MANAGER", label: "Gerente" },
  { value: "EMPLOYEE", label: "Empleado" },
  { value: "VIEWER", label: "Solo Lectura" },
];

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(UsersContext);
  const { state: appState } = useContext(AppContext);
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
    <>
      {/* Solo mostrar el select de sucursal al crear, no al editar */}
      {!state.select_to_edit && (
        <Form.Item
          name="branch_id"
          rules={[{ required: true, message: "Selecciona una tienda" }]}
        >
          <Select
            placeholder="Selecciona una tienda"
            suffixIcon={<ShopOutlined />}
            loading={loadingBranches}
            options={(availableBranches || []).map((b) => ({
              value: b.branch?.id || b.id,
              label: b.branch?.business_name || b.business_name,
            }))}
          />
        </Form.Item>
      )}
      {/* Select de rol al crear */}
      {!state.select_to_edit && (
        <Form.Item
          name="role"
          rules={[{ required: true, message: "Selecciona un rol" }]}
        >
          <Select placeholder="Selecciona un rol" options={ROLES} />
        </Form.Item>
      )}
      <Divider children="Datos del usuario" />
      <Form.Item name="first_name" rules={rules_items.first_name}>
        <Input placeholder="Nombre" prefix={<IdcardOutlined />} />
      </Form.Item>
      <Form.Item name="last_name" rules={rules_items.last_name}>
        <Input placeholder="Apellido" prefix={<IdcardOutlined />} />
      </Form.Item>
      <Form.Item name="email" rules={rules_items.email}>
        <Input placeholder="Email" prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item name="dni" rules={rules.dni}>
        <Input
          maxLength={12}
          placeholder="Rut"
          onChange={onChangeDni}
          prefix={<ProfileOutlined />}
        />
      </Form.Item>

      <Form.Item
        name="type_user"
        rules={[{ required: true, message: "Selecciona un tipo de usuario" }]}
      >
        <Select placeholder="Tipo de usuario" options={USER_TYPES} />
      </Form.Item>

      <Form.Item name="password" rules={rules_items.password}>
        <Input
          placeholder={state.select_to_edit ? "Nueva contraseña" : "Contraseña"}
          type="password"
          prefix={<MdOutlinePassword />}
        />
      </Form.Item>
      <Form.Item
        name="password_confirmation"
        rules={rules_items.password_confirmation}
      >
        <Input
          placeholder={"Confirmación de contraseña"}
          type="password"
          prefix={<MdOutlinePassword />}
        />
      </Form.Item>
      <Form.Item>
        <Row justify={"space-evenly"} gutter={[{ xs: 12, xl: 12 }, {}]}>
          <Button htmlType="submit" type={"primary"} icon={iconBtnLeft}>
            {state.select_to_edit ? "Actualizar" : "Crear"}
          </Button>
          <Button onClick={onClickCreateOrClear} icon={iconBtnRight}>
            {state.select_to_edit ? "Crear" : "Limpiar"}
          </Button>
        </Row>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
