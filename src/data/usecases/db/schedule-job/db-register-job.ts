import {
  GetJobTypesRepository,
  RegisterJobRepository,
} from '@/data/protocols/db';
import { ConvertToTimestamp } from '@/data/protocols/utils';
import { RegisterJob } from '@/domain/usecases';

export class DbRegisterJob implements RegisterJob {
  constructor(
    private readonly getJobTypesRepository: GetJobTypesRepository,
    private readonly convertToTimestamp: ConvertToTimestamp,
    private readonly registerJobRepository: RegisterJobRepository
  ) {}

  async register(jobData: RegisterJob.Params): RegisterJob.Result {
    const taskType = await (async () => {
      const result = await this.getJobTypesRepository.get();

      return result[0].typeId;
    })();

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
