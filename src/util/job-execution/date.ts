import parser, { CronExpression } from 'cron-parser';

export const getDateFromBrazilianString = (brazilianDateString: string) => {
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
