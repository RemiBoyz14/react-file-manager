export const formatDate = (date) => {
  if (!date || isNaN(Date.parse(date))) return "";

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Canada/Eastern",
  };

  const formatted = new Intl.DateTimeFormat("fr-CA", options).format(new Date(date));

  return formatted.replace(",", "");
};