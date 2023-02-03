import { DbExecJob } from '@/data/usecases/db/schedule-job/task';
import { JobMsSQLRepository } from '@/infra/db/mssql/scheduler-schema';
import { ExecJobsTask } from '@/schedule';
import { Task } from '@/schedule/protocols';
import { logger } from '@/util';

import { makeErrorHandler } from '../../usecases';

export const makeExecJobsTask = (): Task => {
  const jobRepository = new JobMsSQLRepository();
  const dbExecJob = new DbExecJob(jobRepository, jobRepository);
  return new ExecJobsTask(logger, dbExecJob, makeErrorHandler());
};
