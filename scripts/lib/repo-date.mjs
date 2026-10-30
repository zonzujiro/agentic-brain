// Human-facing dates use DD.MM.YYYY; machine timestamps have separate contracts.
export function normalizeRepoDate(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.getUTCDate() === Number(day) &&
    date.getUTCMonth() + 1 === Number(month) && date.getUTCFullYear() === Number(year)
    ? value : null;
}
