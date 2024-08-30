export function formatUnits(units?: string): string {
  if (!units) return '';

  if (units === 'ug/m3') return 'µg/m³';

  return units;
}
