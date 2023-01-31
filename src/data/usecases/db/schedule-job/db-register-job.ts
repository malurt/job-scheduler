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
    const jobType = JOB_TYPES[jobData.jobType];

    const jobNextExecution = this.convertToTimestamp(jobData.executionRule);

    const job = {
      filepath: jobData.filename,
      jobNextExecution,
      executionRule: jobData.executionRule,
      jobType,
    };

    return this.registerJobRepository.register(job);
  }
}
