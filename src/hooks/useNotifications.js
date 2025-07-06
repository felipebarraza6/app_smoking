import { useCallback } from "react";
import { App } from "antd";

/**
 * Hook personalizado para manejar notificaciones
 * Centraliza la lógica de notificaciones en toda la app
 */
export const useNotifications = () => {
  const { notification } = App.useApp();

  const showSuccess = useCallback(
    (message, description = null) => {
      notification.success({
        message,
        description,
        placement: "topRight",
        duration: 3,
      });
    },
    [notification]
  );

  const showError = useCallback(
    (message, description = null) => {
      notification.error({
        message,
        description,
        placement: "topRight",
        duration: 5,
      });
    },
    [notification]
  );

  const showWarning = useCallback(
    (message, description = null) => {
      notification.warning({
        message,
        description,
        placement: "topRight",
        duration: 4,
      });
    },
    [notification]
  );

  const showInfo = useCallback(
    (message, description = null) => {
      notification.info({
        message,
        description,
        placement: "topRight",
        duration: 3,
      });
    },
    [notification]
  );

  // Función para manejar resultados de operaciones
  const handleOperationResult = useCallback(
    (result) => {
      if (result.success) {
        showSuccess(result.message, result.details);
      } else {
        showError(result.message, result.details);
      }
      return result.success;
    },
    [showSuccess, showError]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleOperationResult,
  };
};

export default useNotifications;
