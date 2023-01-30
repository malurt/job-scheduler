import { RegisterJobRepository } from '@/data/protocols/db';
import { ConvertToTimestamp } from '@/data/protocols/utils';
import { RegisterJob } from '@/domain/usecases';
import { JOB_TYPES } from '@/util';

export class DbRegisterJob implements RegisterJob {
  constructor(
    private readonly convertToTimestamp: ConvertToTimestamp,
    private readonly registerJobRepository: RegisterJobRepository
  ) {}

  async register(jobData: RegisterJob.Params): RegisterJob.Result {
    const taskType = JOB_TYPES[jobData.jobType];

    const taskNextExecution = this.convertToTimestamp(
      jobData.executionRule,
      taskType
    );

    const task = {
      filepath: jobData.filename,
      taskNextExecution,
      executionRule: jobData.executionRule,
      taskType,
    };

    return this.registerJobRepository.register(task);
  }
}
