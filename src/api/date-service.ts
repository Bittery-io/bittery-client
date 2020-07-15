import { date } from 'quasar'

export const formatDate = (timestamp: number): string => {
  return date.formatDate(timestamp, 'DD-MM-YYYY HH:mm:ss');
};

export const addDaysToDate = (timestamp: number, days: number): number => {
  const currentDate = new Date(timestamp);
  return date.addToDate(currentDate, { days }).getTime();
};

