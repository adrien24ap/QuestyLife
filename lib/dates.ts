export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00`));
}

export function sortByDateDesc<T extends { date: string }>(items: T[]) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function recentDays(count: number) {
  const today = new Date();
  return Array.from({ length: count }, (_item, index) => toIsoDate(addDays(today, index - count + 1)));
}
