export function getExpiryDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().substring(0, 10);
}

export function getDate(date: string, display: boolean = true) {
  const _ = new Date(date);
  if (display)
    return _.toLocaleString("en-GB", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  else return _.toISOString().substring(0, 10);
}
