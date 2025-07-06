import React, { useContext, useState } from "react";
import { Form, Button, Row } from "antd";
import {
  PlusCircleFilled,
  ArrowLeftOutlined,
  ClearOutlined,
  RetweetOutlined,
  MinusCircleFilled,
} from "@ant-design/icons";
import { ProductsContext } from "../../../containers/Products";
import { controller } from "../../../controllers/products";
import FormCreateUpdate from "./fields/FormCreateUpdate";
import FormAddRestInventory from "./fields/FormAddRestInventory";

const FieldsForm = ({ form }) => {
  const { dispatch, state } = useContext(ProductsContext);
  const [isStock, setIsStock] = useState(false);

  const iconBtnRight = state.select_to_edit ? (
    <ArrowLeftOutlined />
  ) : (
    <ClearOutlined />
  );

  const onClickCreateOrClear = () => {
    controller.create_update_form.create_or_clear({
      state,
      dispatch,
      form,
      setIsStock,
    });
  };

  const getButtonText = (state) => {
    if (state.select_to_edit) {
      if (state.add_quantity) {
        return "Agregar";
      } else if (state.sus_quantity) {
        return "Retirar";
      } else {
        return "Actualizar";
      }
    } else {
      return "Crear";
    }
  };

  const getButtonIcon = (state) => {
    if (state.select_to_edit) {
      if (state.add_quantity) {
        return <PlusCircleFilled />;
      } else if (state.sus_quantity) {
        return <MinusCircleFilled />;
      } else {
        return <RetweetOutlined />;
      }
    } else {
      return <PlusCircleFilled />;
    }
  };

  return (
    <>
      {state.add_quantity || state.sus_quantity ? (
        <FormAddRestInventory form={form} />
      ) : (
        <FormCreateUpdate
          form={form}
          isStock={isStock}
          setIsStock={setIsStock}
        />
      )}
      <Form.Item>
        <Row justify={"space-evenly"} gutter={[{ xs: 12, xl: 12 }, {}]}>
          <Button
            htmlType="submit"
            type={"primary"}
            icon={getButtonIcon(state)}
          >
            {getButtonText(state)}
          </Button>
          {state.add_quantity || state.sus_quantity ? (
            <Button onClick={onClickCreateOrClear} icon={iconBtnRight}>
              Volver
            </Button>
          ) : (
            <Button onClick={onClickCreateOrClear} icon={iconBtnRight}>
              {state.select_to_edit ? "Crear" : "Limpiar"}
            </Button>
          )}
        </Row>
      </Form.Item>
    </>
  );
};

export default FieldsForm;
