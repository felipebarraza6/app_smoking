import { notification } from "antd";
import {
  renderName,
  renderPriceCost,
  renderInventory,
  renderButtons,
  renderNameForShort,
} from "./columns/render_columns";

export const defaultColumn = (dispatch, notification) => [
  {
    title: "Nombre",
    render: renderName,
  },
  {
    title: "Valores/Costos",
    render: renderPriceCost,
  },
  {
    title: "Categoría",
    dataIndex: "category",
    render: (x) => {
      return x.name.toLowerCase();
    },
  },
  {
    title: "Inventario",
    width: "20%",
    render: (x) => renderInventory(x, dispatch),
  },
  {
    render: (x) => renderButtons(x, dispatch, notification),
  },
];

export const shortColumn = (dispatch) => [
  {
    title: "Nombre",
    render: (x) => renderNameForShort(x, dispatch),
  },
  {
    render: (x) => renderButtons(x, dispatch, notification),
  },
];
