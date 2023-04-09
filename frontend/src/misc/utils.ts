export function getExpiryDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().substring(0, 10);
}

export function getDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}
