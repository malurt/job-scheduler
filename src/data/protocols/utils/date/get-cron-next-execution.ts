import { CronExpression } from 'cron-parser';

export type GetCronNextExecution = (cron: CronExpression) => Date;
