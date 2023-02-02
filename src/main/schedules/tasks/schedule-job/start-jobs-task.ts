import { taskAdapter } from '@/main/adapters/task-adapter';
import { makeSearchNextJobsTask } from '@/main/factories/tasks';

import { Options } from '../../protocols';

export const searchNextJobsTask: Options = {
  enabled: true,
  cron: '0/10 * * * * *',
  handler: taskAdapter(makeSearchNextJobsTask()),
};
