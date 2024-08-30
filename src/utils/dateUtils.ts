import dayjs from 'dayjs';

export const formatDate = (originalDate: string, formatType = 'MM/DD/YYYY') => {
  const intSecs = parseInt(originalDate || '0');
  const secDate = new Date(0).setUTCSeconds(intSecs);
  const formattedCrDate = originalDate ? dayjs(secDate).format(formatType) : '';

  return formattedCrDate;
};
