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
    const timestampResult = this.convertToTimestamp(jobData.executionRule);
    const jobNextExecution = timestampResult.timestamp;
    const idJobType = JOB_TYPES[timestampResult.originalExpressionType];

    const job = {
      jobFilepath: jobData.filename,
      jobNextExecution,
      jobExecutionRule: jobData.executionRule,
      idJobType,
    };

    return this.registerJobRepository.register(job);
  }
}
