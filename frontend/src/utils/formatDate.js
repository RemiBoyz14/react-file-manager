export const formatDate = (date) => {
  if (!date || isNaN(Date.parse(date))) return "";

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Toronto",
  };

  const formatted = new Intl.DateTimeFormat("en-CA", options).format(new Date(date));

  return formatted.replace(",", "");
};