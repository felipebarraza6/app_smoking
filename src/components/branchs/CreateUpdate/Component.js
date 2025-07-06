/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect } from "react";
import { controller } from "../../../controllers/branchs";
import { Card, Form, Row, Col, App } from "antd";
import { css } from "@emotion/react";
import { BranchsContext } from "../../../containers/Branchs";
import { AppContext } from "../../../App";
import { ShopFilled, ShopOutlined } from "@ant-design/icons";
import FieldsForm from "./FieldsForm";

const CreateUpdate = () => {
  const { state, dispatch } = useContext(BranchsContext);
  const { state: appState } = useContext(AppContext);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const currentUser = appState.user;
  const isSystemAdmin = currentUser?.type_user === "ADM";

  useEffect(() => {
    if (state.select_to_edit) {
      form.setFieldsValue(state.select_to_edit);
    }
  }, [state.select_to_edit, form]);

  // Verificar si el usuario puede editar la sucursal seleccionada
  const canEditSelectedBranch = () => {
    // Los administradores del sistema siempre pueden editar
    if (isSystemAdmin) return true;

    // Si no hay sucursal seleccionada, verificar si puede crear
    if (!state.select_to_edit) {
      // Verificar si tiene algún rol de gestión en alguna sucursal
      const branches = appState.branches || [];
      return branches.some((branchAccess) =>
        ["OWNER", "ADMIN", "MANAGER"].includes(branchAccess.role)
      );
    }

    // Si hay sucursal seleccionada, verificar si puede editar esa específica
    const branches = appState.branches || [];
    const branchAccess = branches.find(
      (ba) => ba.branch?.id === state.select_to_edit.id
    );

    if (!branchAccess) return false;

    // Solo OWNER, ADMIN, MANAGER pueden editar
    return ["OWNER", "ADMIN", "MANAGER"].includes(branchAccess.role);
  };

  // Si no puede editar, no mostrar el componente
  if (!canEditSelectedBranch()) {
    return null;
  }

  const iconStyle = css({
    fontSize: "20px",
  });

  const gutterRow = [{ xl: 12, lg: 12 }, { xs: 24 }];

  function createOrUpdate(values) {
    if (state.select_to_edit) {
      controller.update(values, state, dispatch, form, notification);
    } else {
      controller.create(values, dispatch, form, notification);
    }
  }

  const formStyled = css({
    padding: "10px 10px",
  });

  const titleCard = state.select_to_edit ? (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <ShopFilled css={iconStyle} />
      </Col>
      <Col>{state.select_to_edit.business_name.slice(0, 15)}...</Col>
    </Row>
  ) : (
    <Row justify={"start"} gutter={gutterRow}>
      <Col>
        <ShopOutlined css={iconStyle} />
      </Col>
      <Col>Crear Tienda</Col>
    </Row>
  );

  return (
    <Card hoverable title={titleCard} size="small">
      <Form form={form} onFinish={createOrUpdate} css={formStyled}>
        <FieldsForm form={form} />
      </Form>
    </Card>
  );
};

export default CreateUpdate;
