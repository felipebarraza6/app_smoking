import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FcShop,
  FcDoughnutChart,
  FcManager,
  FcAutomatic,
  FcPackage,
  FcContacts,
  FcCurrencyExchange,
  FcAcceptDatabase,
  FcMoneyTransfer,
  FcCustomerSupport,
  FcInTransit,
  FcRules,
  FcBullish,
  FcCalculator,
  FcInfo,
  FcReading,
  FcServices,
} from "react-icons/fc";

const MenuRouters = ({ onOptionClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Memoizar los items del menú para evitar re-creaciones
  const menuItems = useMemo(
    () => [
      {
        label: "Resumen",
        key: "/app/",
        icon: <FcDoughnutChart />,
      },
      {
        label: "Ventas",
        icon: <FcBullish />,
        key: "/app/sales-management",
      },
      {
        label: "Pedidos",
        icon: <FcAcceptDatabase />,
        key: "/app/orders-management",
      },
      {
        label: "Atención al cliente",
        key: "sub2",
        icon: <FcCustomerSupport />,
        children: [
          {
            key: "/app/sale",
            label: "POS",
            icon: <FcCalculator />,
          },
          { key: "/app/orders-create", label: "Pedidos", icon: <FcRules /> },
        ],
      },
      {
        label: "Recetas y Nutrición",
        icon: <FcServices />,
        key: "sub3",
        children: [
          {
            key: "/app/recipes",
            icon: <FcReading />,
            label: "Gestión de Recetas",
          },
          {
            key: "/app/nutrition-calculator",
            icon: <FcCalculator />,
            label: "Calculadora Nutricional",
          },
          {
            key: "/app/nutrition-dashboard",
            icon: <FcDoughnutChart />,
            label: "Dashboard Nutricional",
          },
          {
            key: "/app/nutritional-ingredients",
            icon: <FcPackage />,
            label: "Ingredientes Nutricionales",
          },
        ],
      },
      {
        label: "Administración",
        icon: <FcAutomatic />,
        key: "sub1",
        children: [
          { key: "/app/users", icon: <FcManager />, label: "Usuarios" },
          { key: "/app/branchs", icon: <FcShop />, label: "Tiendas" },
          {
            key: "/app/products",
            icon: <FcPackage />,
            label: "Productos e inventario",
          },
          {
            key: "/app/clients",
            icon: <FcContacts />,
            label: "Clientes/contactos",
          },
          {
            key: "/app/drivers",
            icon: <FcInTransit />,
            label: "Repartidores",
          },
          {
            key: "/app/type-payments",
            icon: <FcCurrencyExchange />,
            label: "Métodos de pago",
          },
        ],
      },
    ],
    []
  );

  // Memoizar la función para obtener openKeys
  const getOpenKeys = useCallback((pathname) => {
    const openKeys = ["sub1"]; // Administración siempre abierto

    // Atención al cliente solo abierto en rutas específicas
    if (pathname === "/app/sale" || pathname === "/app/orders-create") {
      openKeys.push("sub2");
    }

    // Recetas y Nutrición solo abierto en rutas específicas
    if (pathname.startsWith("/app/recipes") || 
        pathname.startsWith("/app/nutrition") || 
        pathname === "/app/nutritional-ingredients") {
      openKeys.push("sub3");
    }

    return openKeys;
  }, []);

  const [openKeys, setOpenKeys] = useState(() =>
    getOpenKeys(location.pathname)
  );

  // Optimizar useEffect con dependencias correctas
  useEffect(() => {
    const newOpenKeys = getOpenKeys(location.pathname);
    setOpenKeys(newOpenKeys);
  }, [location.pathname, getOpenKeys]);

  // Memoizar handlers para evitar re-creaciones
  const handleOption = useCallback(
    (option) => {
      navigate(option.keyPath[0]);
      if (onOptionClick) onOptionClick();
    },
    [navigate, onOptionClick]
  );

  const handleOpenChange = useCallback((keys) => {
    setOpenKeys(keys);
  }, []);

  return (
    <Menu
      items={menuItems}
      mode="inline"
      onClick={handleOption}
      selectedKeys={[location.pathname]}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
      key="menu"
    />
  );
};

export default MenuRouters;
