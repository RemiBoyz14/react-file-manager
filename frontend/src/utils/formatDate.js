import { DateTime } from "luxon";

export const formatDate = (date) => {
  if (!date) return "";

  return DateTime.fromISO(date, { zone: "utc" })
    .setZone("America/Toronto")
    .toFormat("yyyy-MM-dd HH:mm");
};