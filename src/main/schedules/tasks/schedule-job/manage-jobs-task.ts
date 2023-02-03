import { taskAdapter } from '@/main/adapters/task-adapter';
import { makeSearchNextJobsTask } from '@/main/factories/tasks';
import { makeExecJobsTask } from '@/main/factories/tasks/schedule-job/make-exec-jobs-task';

import { Options } from '../../protocols';

export const manageJobsTask: Options = {
  enabled: true,
  cron: '0/10 * * * * *',
  handler: taskAdapter(makeSearchNextJobsTask(), makeExecJobsTask()),
};
