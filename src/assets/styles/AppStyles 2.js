import "@theme-toggles/react/css/Expand.css";
import { Statistic, theme } from "antd";
import { magenta, purple } from "@ant-design/colors";
import esES from "antd/lib/locale/es_ES";

/**
 * Estilos globales y configuración de tokens de diseño para toda la app.
 * Define el tema, colores, bordes, fuentes y overrides de componentes de Ant Design.
 * @param {object} state - Estado global de la app (incluye algorithm para dark/light)
 * @returns {object} Configuración para el ConfigProvider de Ant Design
 */
export const configProvider = (state) => ({
  locale: esES,
  theme: {
    algorithm:
      state.algorithm === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: state.algorithm === "dark" ? magenta[6] : purple[7],
      colorBgLayout: state.algorithm === "dark" ? "#1f1f1f" : "#F0F2F2",
      borderRadius: "5px",
      borderColor: magenta[0],
    },
    components: {
      Modal: {},
      Image: {
        motionDurationSlow: "0.1s",
      },
      Statistic: {
        colorTextHeading: state.algorithm === "dark" ? "white" : "black",
        colorText: state.algorithm === "dark" ? "white" : "black",
        colorTitle: state.algorithm === "dark" ? "white" : "black",
        colorNumber: state.algorithm === "dark" ? "white" : "black",
        colorTextDescription: state.algorithm === "dark" ? "white" : "black",
        colorTextSecondary: state.algorithm === "dark" ? "white" : "black",
      },

      Tabs: {
        //cardBg: "white",
        inkBarColor: state.algorithm === "dark" ? magenta[2] : purple[2],
        itemActiveColor: state.algorithm === "dark" ? magenta[2] : purple[2],
        itemColor: "white",
        itemSelectedColor: state.algorithm === "dark" ? magenta[1] : purple[9],
        itemHoverColor: "white",
        colorBorderSecondary: "white",
        motionDurationMid: "0.1s",
        motionDurationSlow: "0.1s",
      },
      Drawer: {
        motionDurationSlow: "0.2s",
      },
      Form: {
        motionDurationMid: "0.0s",
        motionDurationFast: "0.0s",
      },
      Input: {
        motionDurationSlow: "0.0s",
      },
      Badge: {
        colorInfo: state.algorithm === "dark" ? magenta[6] : purple[7],
      },
      Switch: {
        motionDurationMid: "0.2s",
      },
      Notification: {
        colorBgElevated: state.algorithm === "dark" ? magenta[1] : purple[6],
        colorText: state.algorithm === "dark" ? "black" : "white",
        colorTextHeading: state.algorithm === "dark" ? "black" : "white",
        colorInfo: "rgb(255,255,255)",
        colorSuccess: state.algorithm === "dark" ? purple[9] : "white",
        colorIcon: state.algorithm === "dark" ? "black" : "white",
        colorIconHover: state.algorithm === "dark" ? magenta[9] : purple[1],
      },
      Message: {
        colorBgElevated: state.algorithm === "dark" ? magenta[1] : purple[6],
        colorText: state.algorithm === "dark" ? "black" : "white",
        colorTextHeading: state.algorithm === "dark" ? "black" : "white",
        colorInfo: state.algorithm === "dark" ? "black" : "white",
        colorSuccess: state.algorithm === "dark" ? purple[9] : "white",
        colorIcon: state.algorithm === "dark" ? "black" : "white",
        colorIconHover: state.algorithm === "dark" ? magenta[9] : purple[1],
        colorWarning: state.algorithm === "dark" ? magenta[9] : purple[1],
      },

      Tag: {
        defaultColor: "white",
        colorBorder: state.algorithm === "dark" ? magenta[9] : purple[9],
        defaultBg: state.algorithm === "dark" ? "dark" : purple[9],
      },
      Menu: {
        activeBarBorderWidth: 0,
        itemBg: state.algorithm === "dark" ? "#262626" : undefined,
        subMenuItemBg: state.algorithm === "dark" ? "#262626" : undefined,
        itemSelectedColor: state.algorithm === "dark" ? "white" : undefined,
        itemHoverBg: state.algorithm === "dark" ? magenta[6] : "#d9d9d9",
        itemSelectedBg: state.algorithm === "dark" ? magenta[6] : "#d9d9d9",
        motionDurationSlow: "0.0s",
        motionDurationMid: "0.5s",
        motionDurationFast: "0.0s",
      },
      Table: {
        motionDurationMid: "0.0s",
        motionDurationSlow: "0.5s",
        opacityLoading: 0.75,
        colorPrimary: state.algorithm === "dark" ? magenta[5] : purple[6],
        colorLinkHover: state.algorithm === "dark" ? magenta[5] : purple[6],
      },
      Layout: {
        headerBg: state.algorithm === "dark" ? magenta[8] : purple[9],
        siderBg: state.algorithm === "dark" ? "#262626" : "#F2F2F0",
      },
      Button: {
        colorLink: "white",
        motionDurationMid: "0.3s",
        motionDurationSlow: "0.0s",
        colorText: state.algorithm === "dark" ? "white" : "black",
        colorLinkHover: state.algorithm === "dark" ? "white" : "#262626",
        colorBgContainerDisabled:
          state.algorithm === "dark" ? "#262626" : "white",
        colorTextDisabled: state.algorithm === "dark" ? "white" : "black",
      },
      Card: {
        headerBg: state.algorithm === "dark" ? magenta[8] : purple[9],
        extraColor: "white",
        colorTextHeading: "white",
      },
    },
    typography: {
      fontFamily: "Lato",
    },
  },
});
