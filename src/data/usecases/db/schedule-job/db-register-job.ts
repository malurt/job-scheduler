import { RegisterJobRepository } from '@/data/protocols/db';
import { GetJobExecutionData } from '@/data/protocols/utils';
import { RegisterJob } from '@/domain/usecases';
import { JOB_TYPES } from '@/util';

export class DbRegisterJob implements RegisterJob {
  constructor(
    private readonly getJobExecutionData: GetJobExecutionData,
    private readonly registerJobRepository: RegisterJobRepository
  ) {}

  async register(jobData: RegisterJob.Params): RegisterJob.Result {
    const executionData = this.getJobExecutionData(jobData.executionRule);
    const jobNextExecution = executionData.nextExecution;
    const idJobType = JOB_TYPES[executionData.originalExpressionType];

    const job = {
      jobFilepath: jobData.filename,
      jobNextExecution,
      jobExecutionRule: jobData.executionRule,
      idJobType,
    };

    return this.registerJobRepository.register(job);
  }
}
