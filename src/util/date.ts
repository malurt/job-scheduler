import {
  addBusinessDays,
  addDays,
  addMinutes,
  format,
  fromUnixTime,
  getUnixTime,
  isAfter as dateIsAfter,
  subBusinessDays as dateFnsSubBusinessDays,
  subDays as dateFnsSubDays,
} from 'date-fns';

export const convertToTimestamp = (originalExpression: string) => {
  const currentTimestamp = convertDateToUnix(new Date());
  const jobExecutionTimestamp = convertDateToUnix(new Date(originalExpression));

  if (isTimestamp(jobExecutionTimestamp)) {
    // Valid timestamp (valid date format )

    if (dateIsAfter(currentTimestamp, jobExecutionTimestamp)) {
      // Invalid Date - The first date is after the second one?
      throw new Error(
        'Invalid executionRule date! Execution must happen in a future date'
      );
    }
    return jobExecutionTimestamp;
  }
  // Not an date, possibly a cron or an invalid value
  return currentTimestamp;
};

const isTimestamp = (possibleTimestamp: number) =>
  !Number.isNaN(possibleTimestamp);

export const convertUnixToDate = (unixTime: number): Date => {
  return fromUnixTime(unixTime);
};

export const convertDateToUnix = (date: Date): number => {
  return getUnixTime(date);
};

export const isAfter = (after: Date, before: Date): boolean => {
  return dateIsAfter(after, before);
};

export const sumDays = (date: Date, days: number) => {
  return addDays(date, days);
};

export const subDays = (date: Date, days: number) => {
  return dateFnsSubDays(date, days);
};

export const sumMinutes = (date: Date, days: number) => {
  return addMinutes(date, days);
};

export const formatDate = (date: Date, design: string) => {
  return format(date, design);
};

export const formatToMilliseconds = (date: Date) => {
  return date.getTime();
};

export const sumBusinessDays = (date: Date, num: number) => {
  return addBusinessDays(date, num);
};

export const subBusinessDays = (date: Date, num: number) => {
  return dateFnsSubBusinessDays(date, num);
};
