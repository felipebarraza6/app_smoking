import api from "../../../../api/endpoints";

// helper para obtener geolocalización de forma asíncrona
const formatCoord = (coord, decimalPlaces = 6) =>
  parseFloat(coord.toFixed(decimalPlaces));

const getCurrentPositionAsync = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalización no soportada"));
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({
          ...pos,
          coords: {
            ...pos.coords,
            latitude: formatCoord(latitude),
            longitude: formatCoord(longitude),
          },
        });
      }, reject);
    }
  });

export const getProductCount = (registers) => {
  if (!Array.isArray(registers)) return 0;
  return registers.filter((r) => r.product).length;
};

export const getOrderTotal = (record) => {
  let total = record.total_amount || 0;
  if (
    record.is_delivery &&
    record.driver &&
    typeof record.driver.amount === "number"
  ) {
    total += record.driver.amount;
  }
  return total;
};

export const isNullOrder = async (record, message, setUpdate, update) => {
  const response = await api.orders.update(record.id, {
    is_null: true,
    is_pay: false,
    latitude: null,
    longitude: null,
  });
  message.success("Pedido anulado correctamente");
  // Refresh orders list after nulling
  setUpdate(update + 1);
  return response;
};

export const inRouteOrder = async (record, message, setUpdate, update) => {
  let latitude, longitude;

  try {
    const pos = await getCurrentPositionAsync();
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
  } catch (error) {

    // If location fails, null the order and trigger refresh
    await isNullOrder(record, message, setUpdate, update);
    return;
  }

  try {
    const payload = {
      in_route: !record.in_route,
      latitude,
      longitude,
    };
    await api.orders.update(record.id, payload);
    const text = record.in_route
      ? "Envío cancelado correctamente"
      : "Pedido marcado en ruta";
    message.success(text);
    // Trigger list refresh
    setUpdate(update + 1);
  } catch (error) {

  }
};
