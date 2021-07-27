import { date } from 'quasar'
import dayjs from 'dayjs';

export const formatDate = (timestamp: number): string => {
  return date.formatDate(timestamp, 'DD-MM-YYYY HH:mm:ss');
};

export const formatOnlyDate = (timestamp: number): string => {
  return date.formatDate(timestamp, 'DD-MM-YYYY');
};

export const formatOnlyTime = (timestamp: number): string => {
  return date.formatDate(timestamp, 'HH:mm:ss');
};

export const addDaysToDate = (timestamp: number, days: number): number => {
  const currentDate = new Date(timestamp);
  return date.addToDate(currentDate, { days }).getTime();
};

export const addMonthsToDate = (date: number, months: number): number => {
  return dayjs(date).add(months, 'month').valueOf();
};

export const getDaysBetweenTwoDates = (date: number, date2: number): number => {
  return dayjs(date).diff(dayjs(date2), 'day');
};

export const isDateExpired = (date: number): boolean => {
  return dayjs(date).isBefore(dayjs());
};
