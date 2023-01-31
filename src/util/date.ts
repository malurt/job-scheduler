import parser from 'cron-parser';
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
  const BRAZILIAN_DATE_TIME_FORMAT =
    /^((([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d) ([012]{0,1}[0-9]:[0-6][0-9])$/gm;
  const INTERNATIONAL_DATE_FORMAT =
    /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/gm;

  const finalTimestamp = (() => {
    // check if its a date
    if (INTERNATIONAL_DATE_FORMAT.test(originalExpression)) {
      return convertDateToUnix(new Date(originalExpression));
    }
    if (BRAZILIAN_DATE_TIME_FORMAT.test(originalExpression)) {
      const dateParts = originalExpression.split(' ');
      const [day, month, year] = dateParts[0]
        .split('/')
        .map((value) => Number(value));
      const [hours, minutes] = dateParts[1]
        .split(':')
        .map((value) => Number(value));

      return convertDateToUnix(new Date(year, month - 1, day, hours, minutes));
    }

    // check if is a cron
    const cron = parser.parseString(originalExpression);
    if (cron.expressions.length >= 1) {
      return convertDateToUnix(new Date(cron.expressions[0].next().toDate()));
    }

    throw new Error(
      'Invalid executionRule format! Try using Brazilian date format (dd/mm/yyyy hh:MM) or cron pattern'
    );
  })();

  const currentTimestamp = convertDateToUnix(new Date());
  if (dateIsAfter(currentTimestamp, finalTimestamp)) {
    // Invalid Date - The first date is after the second one?
    throw new Error(
      'Invalid executionRule date! Execution must happen in a future date'
    );
  }

  return finalTimestamp;
};

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
