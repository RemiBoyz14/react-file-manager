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

  const formatted = new Intl.DateTimeFormat("fr-CA", options).format(new Date(date));

  const [day, month, year] = formatted.split(',')[0].split('/');
  const time = formatted.split(',')[1].trim();

  return `${year}-${month}-${day} ${time}`;
};