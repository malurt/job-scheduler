import parser from 'cron-parser';
import { isAfter as dateIsAfter } from 'date-fns';

import {} from './date';

const BRAZILIAN_DATE_TIME_FORMAT =
  /^((([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d) ([012]{0,1}[0-9]:[0-6][0-9])$/gm;
const INTERNATIONAL_DATE_FORMAT =
  /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/gm;

export const convertToTimestamp = (originalExpression: string) => {
  // get a timestamp
  const finalTimestamp = (() => {
    // check if its a date
    const timestampFromDate = (() => {
      if (INTERNATIONAL_DATE_FORMAT.test(originalExpression))
        return new Date(originalExpression);

      if (BRAZILIAN_DATE_TIME_FORMAT.test(originalExpression)) {
        return getDateFromBrazilianString(originalExpression);
      }
    })();
    if (timestampFromDate)
      return {
        timestamp: timestampFromDate,
        originalExpressionType: 'DATE' as const,
      };

    // check if is a cron
    const [cron] = parser.parseString(originalExpression).expressions;

    if (cron)
      return {
        timestamp: cron.next().toDate(),
        originalExpressionType: 'CRON' as const,
      };

    // throw error because it's not and date or and cron
    throw new Error(
      'Invalid executionRule format! Try using Brazilian date format (dd/mm/yyyy hh:MM) or cron pattern'
    );
  })();

  // verify if it's a future date
  const currentTimestamp = new Date();
  if (dateIsAfter(currentTimestamp, finalTimestamp.timestamp))
    // Invalid Date - The first date is after the second one?
    throw new Error(
      'Invalid executionRule date! Execution must happen in a future date'
    );

  return {
    timestamp: finalTimestamp.timestamp,
    originalExpressionType: finalTimestamp.originalExpressionType,
  };
};

const getDateFromBrazilianString = (brazilianDateString: string) => {
  const dateAndTime = brazilianDateString.split(' ');
  const [day, month, year] = dateAndTime[0]
    .split('/')
    .map((value) => Number(value));
  const [hours, minutes] = dateAndTime[1]
    .split(':')
    .map((value) => Number(value));
  return new Date(year, month - 1, day, hours, minutes);
};
