export const FULL_DATE_FORMAT = 'dddd, MMM D - h:mm A';
export const LONG_DATE_FORMAT = 'MMM D, YYYY - h:mma';
export const SHORT_DATE_FORMAT = 'MMM D - h:mm A';

export const PM25_THRESHOLDS = [
  {
    start: 0,
    end: 15,
    color: '#00B047',
  },
  {
    start: 15,
    end: 55,
    color: '#FFC045',
  },
  {
    start: 55,
    end: 999999999,
    color: '#D33F00',
  },
];

export const CO2_THRESHOLDS = [
  {
    start: 0,
    end: 1000,
    color: '#00B047',
  },
  {
    start: 1000,
    end: 10000,
    color: '#FFC045',
  },
  {
    start: 10000,
    end: 999999999,
    color: '#D33F00',
  },
];

export const TVOC_THRESHOLDS = [
  {
    start: 0,
    end: 1000,
    color: '#00B047',
  },
  {
    start: 1000,
    end: 2000,
    color: '#FFC045',
  },
  {
    start: 2000,
    end: 999999999,
    color: '#D33F00',
  },
];

export const POLLUTANT_THRESHOLDS = {
  pm25: PM25_THRESHOLDS,
  co2: CO2_THRESHOLDS,
  tvoc: TVOC_THRESHOLDS,
};
