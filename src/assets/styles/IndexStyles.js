import { css } from "@emotion/react";

/**
 * Estilos globales base para la app.
 * Define reglas para body, fuentes y código fuente.
 * Se aplica a toda la aplicación como baseline.
 */
export const IndexStyle = css`
  html,
  body,
  #root {
    height: 100%;
    min-height: 100%;
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", "Lato", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body.theme-dark {
    background-color: #1f1f1f;
  }
  body.theme-light {
    background-color: #f0f2f2;
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`;
