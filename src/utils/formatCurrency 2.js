export const formatCurrency = (num) => {
  return num.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
};
