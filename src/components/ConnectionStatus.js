import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Alert, Button, Space } from "antd";
import {
  WifiOutlined,
  DisconnectOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { PING } from "../api/config";

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState("online");
  const [lastCheck, setLastCheck] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const checkServerStatus = useCallback(async () => {
    if (isChecking) return;

    // Cancelar verificación anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsChecking(true);
    setServerStatus("checking");

    try {
      abortControllerRef.current = new AbortController();
      timeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 5000);

      const response = await PING();

      clearTimeout(timeoutRef.current);

      if (response.status === 200 || response.status === 304) {
        setServerStatus("online");
      } else {
        setServerStatus("offline");
      }
    } catch (error) {
      clearTimeout(timeoutRef.current);
      // Solo marcar como offline si no es un error de aborto
      if (error.name !== "AbortError") {
        setServerStatus("offline");
      }
    } finally {
      setIsChecking(false);
      setLastCheck(new Date());
      setHasInitialized(true);
      abortControllerRef.current = null;
    }
  }, [isChecking]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Verificar servidor cuando se recupera la conexión
      setTimeout(() => {
        checkServerStatus();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar estado del servidor al montar con un delay más largo
    const initialCheck = setTimeout(() => {
      checkServerStatus();
    }, 2000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearTimeout(initialCheck);
    };
  }, [checkServerStatus]);

  // Memoizar el estado de visibilidad para evitar re-renderizados
  const shouldShow = useMemo(() => {
    // No mostrar nada hasta que se haya inicializado
    if (!hasInitialized) {
      return false;
    }

    // No mostrar si todo está bien
    if (isOnline && serverStatus === "online") {
      return false;
    }

    // Mostrar si hay problemas
    return !isOnline || serverStatus === "offline";
  }, [isOnline, serverStatus, hasInitialized]);

  // Memoizar el mensaje y descripción
  const alertContent = useMemo(() => {
    const message = (
      <Space>
        {!isOnline ? <DisconnectOutlined /> : <WifiOutlined />}
        {!isOnline ? "Sin conexión a internet" : "Problema con el servidor"}
      </Space>
    );

    const description = (
      <div>
        {!isOnline && <p>Verifica tu conexión a internet</p>}
        {serverStatus === "offline" && (
          <p>
            El servidor no responde. Verifica que esté ejecutándose y accesible.
          </p>
        )}
        {lastCheck && (
          <small>Última verificación: {lastCheck.toLocaleTimeString()}</small>
        )}
      </div>
    );

    return { message, description };
  }, [isOnline, serverStatus, lastCheck]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        maxWidth: "300px",
        zIndex: 1000,
      }}
    >
      <Alert
        message={alertContent.message}
        description={alertContent.description}
        type="warning"
        showIcon
        action={
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={checkServerStatus}
            loading={serverStatus === "checking"}
            disabled={isChecking || !isOnline}
          >
            Verificar
          </Button>
        }
        closable
      />
    </div>
  );
};

export default React.memo(ConnectionStatus);
