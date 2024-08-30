export const calculatePercentage = (
  {
    minRaw,
    maxRaw,
    minPct = 0,
    maxPct = 100,
    targetMin,
    targetMax,
    targetVal,
  }: {
    minRaw: number;
    maxRaw: number;
    minPct?: number;
    maxPct?: number;
    targetMin: number;
    targetMax: number;
    targetVal: number;
  },
  rawVal: number,
) => {
  // Linear scaling and offset
  let mappedValue;
  if (rawVal < targetMin) {
    mappedValue = ((rawVal - minRaw) / (targetMin - minRaw)) * targetVal;
  } else if (rawVal > targetMax) {
    mappedValue = targetVal + ((rawVal - targetMax) / (maxRaw - targetMax)) * (maxPct - targetVal);
  } else {
    mappedValue = targetVal;
  }

  // Ensure the mapped value is within [0, 100]
  return Math.max(minPct, Math.min(mappedValue, maxPct));
};
