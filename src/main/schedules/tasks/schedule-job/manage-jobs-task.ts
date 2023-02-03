import { taskAdapter } from '@/main/adapters/task-adapter';
import { makeSearchNextJobsTask } from '@/main/factories/tasks';
import { makeExecJobsTask } from '@/main/factories/tasks/schedule-job/make-exec-jobs-task';

import { Options } from '../../protocols';

export const manageJobsTask: Options = {
  enabled: true,
  cron: '* * * * *',
  handler: taskAdapter(makeSearchNextJobsTask(), makeExecJobsTask()),
};
