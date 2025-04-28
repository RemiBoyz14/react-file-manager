export const formatDate = (date) => {
  if (!date || isNaN(Date.parse(date))) return "";

  date = new Date(date);
  let hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
