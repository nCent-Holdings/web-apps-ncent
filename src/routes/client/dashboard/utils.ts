// utils.ts

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    // For numbers >= 1 million, format as 'X.XM' or 'XM'
    const rounded = Math.round(num / 1000000) / 10; // Round to nearest tenth of a million
    return rounded % 1 === 0 ? `${rounded}M` : `${rounded.toFixed(1)}M`;
  } else if (num >= 1000) {
    // For numbers >= 1 thousand, format as 'XK'
    return `${Math.round(num / 1000)}K`;
  }
  return num.toString(); // For numbers < 1000, return as is
};
