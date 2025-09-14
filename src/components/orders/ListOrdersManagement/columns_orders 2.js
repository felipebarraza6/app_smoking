import React from "react";
import { Tag, Flex, Button, Popconfirm } from "antd";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaTruckFast } from "react-icons/fa6";
import { PiFilesBold } from "react-icons/pi";

import { FiLoader } from "react-icons/fi";

import { IoIosCloseCircle } from "react-icons/io";
import { TruckFilled } from "@ant-design/icons";
import { formatDateTime } from "./helpers/dates";
import { FaStopCircle } from "react-icons/fa";

import { PhoneFilled, UserOutlined } from "@ant-design/icons";
import {
  getProductCount,
  getOrderTotal,
  isNullOrder,
  inRouteOrder,
} from "./helpers/products";
import ReceiptModal from "./ReceiptModal";

export const columns = (
  message,
  modal,
  notification,
  app,
  setUpdate,
  update,
  onShowReceipt
) => {
  return [
    {
      title: "ID",
      key: "id",
      align: "center",
      render: (order) =>
        !order.is_null ? (
          <strong>#{String(order.id).slice(-6)}</strong>
        ) : (
          <s style={{ color: "grey" }}>#{String(order.id).slice(-6)}</s>
        ),
    },
    {
      title: "Cliente",
      key: "cliente",
      align: "left",
      render: (record) => (
        <Flex gap="small" vertical>
          <Tag icon={<UserOutlined />} color="blue">
            {record.client?.name || "Sin cliente"}
          </Tag>
          <Tag color="green" icon={<PhoneFilled />}>
            {record.client?.phone_number || "Sin teléfono"}
          </Tag>
        </Flex>
      ),
    },
    {
      title: "Fechas",
      key: "fechas",
      align: "left",
      render: (record) => (
        <Flex gap="small" vertical>
          <Tag
            style={{ padding: "5px 10px" }}
            icon={<FaRegCalendarAlt style={{ marginRight: "5px" }} />}
            color="orange"
          >
            {formatDateTime(record.created, true)}
          </Tag>
          <Tag
            style={{ padding: "5px 10px" }}
            icon={<FaRegCalendarAlt style={{ marginRight: "5px" }} />}
            color="blue"
          >
            <strong>Pedido:</strong> {formatDateTime(record.date)}
          </Tag>
        </Flex>
      ),
    },
    {
      title: "Estado",
      align: "center",
      key: "status",
      render: (record) => {
        let label, color, icon;
        if (record.is_null) {
          label = "Anulado";
          color = "red";
          icon = <IoIosCloseCircle style={{ marginRight: "5px" }} />;
        } else if (!record.is_pay) {
          label = "Pagos Pendientes";
          color = "orange";
          icon = <FiLoader style={{ marginRight: "5px" }} />;
        } else if (record.is_pay) {
          label = "Completado";
          color = "green";
          icon = <IoCheckmarkDoneOutline style={{ marginRight: "5px" }} />;
        } else {
          label = "En Preparación";
          color = "default";
          icon = <FiLoader style={{ marginRight: "5px" }} />;
        }
        return (
          <Flex gap="small" vertical align="center">
            <Tag color={color} style={{ padding: "3px 10px" }} icon={icon}>
              {label}
            </Tag>
            {record.is_delivery && record.in_route && (
              <Tag
                icon={<FaStopCircle style={{ marginRight: "10px" }} />}
                color="red"
                style={{ padding: "5px 8px 3px" }}
              >
                En Ruta
              </Tag>
            )}
            {record.is_delivery && record.is_pay && (
              <>
                <Tag
                  icon={<TruckFilled style={{ marginRight: "10px" }} />}
                  color="blue"
                  style={{ padding: "5px 8px 3px" }}
                >
                  Entregado
                </Tag>
              </>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Resumen",
      key: "status",
      align: "center",
      render: (record) => (
        <Flex gap={"small"} vertical>
          <Tag>
            {getOrderTotal(record).toLocaleString("es-CL", {
              style: "currency",
              currency: "CLP",
            })}
          </Tag>
          <Tag>
            {getProductCount(record.registers)}
            {getProductCount(record.registers) > 1 ? " productos" : " producto"}
          </Tag>
          {record.is_delivery && (
            <Tag icon={<TruckFilled />} color="blue">
              Entrega
            </Tag>
          )}
          {record.is_takeaway && <Tag color="green">Retiro</Tag>}
        </Flex>
      ),
    },
    {
      key: "actions",
      align: "center",
      render: (order) => (
        <Flex gap="small" justify="space-between" align="center" vertical>
          <Button
            icon={<PiFilesBold />}
            size="small"
            type="default"
            block
            onClick={() => onShowReceipt(order)}
          >
            Ficha
          </Button>
          {!order.is_null && order.is_delivery && (
            <Button
              icon={order.in_route ? <FaStopCircle /> : <TruckFilled />}
              size="small"
              type="primary"
              block
              onClick={() => inRouteOrder(order, message, setUpdate, update)}
            >
              {!order.in_route ? "Iniciar Ruta" : "Finalizar Ruta"}
            </Button>
          )}
          {!order.is_null && (
            <Popconfirm
              title="Estas seguro de anular este pedido?"
              description="Esta acción no se puede deshacer."
              onConfirm={() => isNullOrder(order, message, setUpdate, update)}
            >
              <Button
                danger
                icon={<IoIosCloseCircle />}
                size="small"
                type="primary"
                block
              >
                Anular
              </Button>
            </Popconfirm>
          )}
        </Flex>
      ),
    },
  ];
};
