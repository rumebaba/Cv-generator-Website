export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + '-01').toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateRange(
  startDate: string | undefined,
  endDate: string | undefined,
  current?: boolean
): string {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
}
