import { ExecutionResult } from '@/data/protocols/utils/job/execute-job';
import { spawn } from 'child_process';
import parser, { CronExpression } from 'cron-parser';

import { isAfter as dateIsAfter } from '../date';

const BRAZILIAN_DATE_TIME_FORMAT =
  /^((([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d) ([012]{0,1}[0-9]:[0-6][0-9])$/;
const INTERNATIONAL_DATE_FORMAT =
  /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/;

export const executeJob = async (
  command: string,
  args: string[]
): Promise<ExecutionResult> => {
  return new Promise(function (response, reject) {
    const errors: string[] = [];
    const process = spawn(command, args);
    process.stderr.on('data', (data) => {
      errors.push(data.toString());
    });
    process.on('close', (code) => {
      if (code !== 0) reject(new Error(errors[0]));
      response({
        execCode: Number(code),
      });
    });
  });
};

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
    const generatedCron = getCronExpressionFromString(originalExpression);

    if (generatedCron)
      return {
        date: getCronNextExecutionDate(generatedCron),
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

export const getCronNextExecutionDate = (cron: CronExpression) => {
  return cron.next().toDate();
};

export const getCronExpressionFromString = (cronStr: string) => {
  return parser.parseString(cronStr).expressions[0];
};
