import React from "react";
import { Row, Col, Tag, Button, Popconfirm } from "antd";
import { DeleteFilled, EditFilled, PoweroffOutlined } from "@ant-design/icons";
import { controller } from "../../../controllers/type_payments";
import { FaMoneyCheck, FaMoneyBills } from "react-icons/fa6";
import { BiTransferAlt } from "react-icons/bi";
import { RiBankLine } from "react-icons/ri";

export const defaultColumn = (dispatch, notification) => [
  {
    title: "Nombre",
    width: 200,
    render: (x) => (
      <Row justify={"space-between"}>
        <Col>{x.name.toUpperCase()}</Col>
        <Col>
          {x.name === "efectivo" && <FaMoneyBills />}{" "}
          {x.name === "credito" && <FaMoneyCheck />}
          {x.name === "debito" && <FaMoneyCheck />}
          {x.name === "transferencia" && <BiTransferAlt />}
          {x.name === "deposito" && <RiBankLine />}
        </Col>
      </Row>
    ),
  },

  {
    render: (x) => (
      <Row justify={"space-evenly"} align={"middle"}>
        <Col>
          <Popconfirm
            title={"Estas seguro de desactivar el método de pago? "}
            description={"Se eliminaran los registros asociados."}
            onConfirm={() => controller.delete(x, dispatch, notification)}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              type="primary"
              icon={<PoweroffOutlined />}
              shape="round"
              size="small"
            >
              Desactivar
            </Button>{" "}
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];

export const shortColumn = (dispatch, notification) => [
  {
    title: "Nombre",

    render: (x) => (
      <Row gutter={[{ xs: 5 }, { xs: 5 }]}>
        <Col span={24}>{x.name}</Col>

        <Col>
          <Button
            size="small"
            shape="circle"
            onClick={() =>
              controller.create_update_form.select_to_edit(x, dispatch)
            }
            icon={<EditFilled />}
          ></Button>
        </Col>
        <Col>
          <Popconfirm
            title={"Estas seguro de eliminar el tipo de pago?"}
            onConfirm={() => controller.delete(x, dispatch, notification)}
            cancelButtonProps={{ type: "primary" }}
          >
            <Button
              danger
              icon={<DeleteFilled />}
              size="small"
              shape={"circle"}
            />
          </Popconfirm>
        </Col>
      </Row>
    ),
  },
];
