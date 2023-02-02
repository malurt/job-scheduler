import { DbSearchNextJobs } from '@/data/usecases/db/schedule-job/task';
import { JobMsSQLRepository } from '@/infra/db/mssql/scheduler-schema';
import { SearchNextJobsTask } from '@/schedule';
import { Task } from '@/schedule/protocols';
import { logger } from '@/util';

import { makeErrorHandler } from '../../usecases';

export const makeSearchNextJobsTask = (): Task => {
  const jobRepository = new JobMsSQLRepository();
  const dbSearchNextJobs = new DbSearchNextJobs(jobRepository);
  return new SearchNextJobsTask(logger, dbSearchNextJobs, makeErrorHandler());
};
