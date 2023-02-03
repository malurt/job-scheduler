import { CronExpression } from 'cron-parser';

export type GetCronExpression = (cron: string) => CronExpression;
