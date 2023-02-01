import { taskAdapter } from '@/main/adapters/task-adapter';
import { makeSearchJobsTask } from '@/main/factories/tasks';

import { Options } from '../../protocols';

export const searchJobsTask: Options = {
  enabled: true,
  cron: '0/10 * * * * *',
  handler: taskAdapter(makeSearchJobsTask()),
};
