export const toSentenceCase = (string: string) => {
  if (!string) return '';
  const newString = string
    .toLowerCase()
    // eslint-disable-next-line no-useless-escape
    .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
      return c.toUpperCase();
    });
  return newString;
};

export const capitalize = (string: string) => {
  if (!string) return '';
  const newString = string
    // eslint-disable-next-line no-useless-escape
    .replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
      return c.toUpperCase();
    });
  return newString;
};
