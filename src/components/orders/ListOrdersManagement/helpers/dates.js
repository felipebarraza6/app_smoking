export const formatDateTime = (date, withTime = false) => {
  if (!date) return "-";
  const options = withTime
    ? {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    : { year: "2-digit", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleString("es-CL", options);
};
