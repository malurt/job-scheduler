import parser from 'cron-parser';

import { isAfter as dateIsAfter } from './date';

const BRAZILIAN_DATE_TIME_FORMAT =
  /^((([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d) ([012]{0,1}[0-9]:[0-6][0-9])$/;
const INTERNATIONAL_DATE_FORMAT =
  /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/;

export const getJobExecutionData = (originalExpression: string) => {
  // get a date
  const finalDate = (() => {
    // check if its a date
    const dateFromDateString = (() => {
      if (INTERNATIONAL_DATE_FORMAT.test(originalExpression))
        return new Date(originalExpression);

      if (BRAZILIAN_DATE_TIME_FORMAT.test(originalExpression))
        return getDateFromBrazilianString(originalExpression);
    })();

    if (dateFromDateString)
      return {
        date: dateFromDateString,
        originalExpressionType: 'DATE' as const,
      };

    // check if is a cron
    const cronDate = getCronNextExecutionDate(originalExpression);

    if (cronDate)
      return {
        date: cronDate,
        originalExpressionType: 'CRON' as const,
      };

    // throw error because it's not and date or and cron
    throw new Error(
      'Invalid executionRule format! Try using Brazilian date format (dd/mm/yyyy hh:MM) or cron pattern'
    );
  })();

  // verify if it's a future date
  const currentDate = new Date();
  if (dateIsAfter(currentDate, finalDate.date))
    // Invalid Date - The first date is after the second one?
    throw new Error(
      'Invalid executionRule date! Execution must happen in a future date'
    );

  return {
    nextExecution: finalDate.date,
    originalExpressionType: finalDate.originalExpressionType,
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

export const getCronNextExecutionDate = (cron: string) => {
  const [generatedCron] = parser.parseString(cron).expressions;

  if (generatedCron) return generatedCron.next().toDate();
};
