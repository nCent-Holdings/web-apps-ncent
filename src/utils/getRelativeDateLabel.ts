import dayjs from 'dayjs';

type Dayjs = dayjs.Dayjs;

export default function getRelativeDateLabel(dateFrom: Dayjs, diff?: { days?: number }): string {
  let dateTo = dateFrom.clone();

  if (diff?.days) {
    dateTo = dateTo.add(diff.days, 'days');
  }

  const monthsDiff = dateTo.diff(dateFrom, 'months');

  if (monthsDiff > 0) {
    return pluralize(monthsDiff, 'month');
  }

  const weeksDiff = dateTo.diff(dateFrom, 'weeks');

  if (weeksDiff > 0) {
    return pluralize(weeksDiff, 'week');
  }

  const daysDiff = dateTo.diff(dateFrom, 'days');

  if (daysDiff > 0) {
    return pluralize(daysDiff, 'day');
  }

  return 'unknown';
}

function pluralize(num: number, str: string): string {
  if (num === 1) {
    return `${num} ${str}`;
  }

  return `${num} ${str}s`;
}
