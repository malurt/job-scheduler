import {
  RegisterJobExecutionRepository,
  RegisterJobNextExecutionRepository,
} from '@/data/protocols/db';
import { ExecJob } from '@/domain/usecases';

export class DbExecJob implements ExecJob {
  constructor(
    private readonly registerJobExecutionRepository: RegisterJobExecutionRepository,
    private readonly registerJobNextExecutionRepository: RegisterJobNextExecutionRepository
  ) {}

  async exec(jobs: ExecJob.Params): ExecJob.Result {
    jobs.map(async (job) => {
      // Exec job

      // Register job execution
      await this.registerJobExecutionRepository.registerExecution({
        executionDatetime: new Date(),
        idJob: job.idJob,
        jobFinished: false,
      });
      // Register job next execution
      await this.registerJobNextExecutionRepository.registerNext({
        jobNextExecution: new Date(),
        idJob: job.idJob,
      });
    });
  }
}
