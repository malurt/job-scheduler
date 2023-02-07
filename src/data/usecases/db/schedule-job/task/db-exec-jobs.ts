/* eslint-disable no-console */
import {
  RegisterJobExecutionRepository,
  RegisterJobNextExecutionRepository,
} from '@/data/protocols/db';
import {
  ExecuteJob,
  GetCronExpression,
  GetCronNextExecution,
} from '@/data/protocols/utils';
import { ExecJob } from '@/domain/usecases';
import { resolve } from 'path';

export class DbExecJob implements ExecJob {
  constructor(
    private readonly registerJobExecutionRepository: RegisterJobExecutionRepository,
    private readonly registerJobNextExecutionRepository: RegisterJobNextExecutionRepository,
    private readonly getCronExpression: GetCronExpression,
    private readonly getCronNextExecution: GetCronNextExecution,
    private readonly executeJob: ExecuteJob
  ) {}

  async exec(jobs: ExecJob.Params): ExecJob.Result {
    const promises = jobs.map(async (job) => {
      // Exec job
      try {
        const filepath = resolve(
          __dirname,
          '../../../../../../',
          'uploads',
          job.jobFilepath
        );
        await this.executeJob('node', [filepath]);

        // Register job execution
        const jobFinished = job.idJobType === 2; // Is the job specific(2)? If so, it's already finished. If not, it is recurring and has not been finished
        await this.registerJobExecutionRepository.registerExecution({
          executionDatetime: new Date(),
          idJob: job.idJob,
          jobFinished,
        });
        // Register job next execution (if necessary)
        if (!jobFinished) {
          const cron = this.getCronExpression(job.jobExecutionRule);
          const nextDate = this.getCronNextExecution(cron);

          await this.registerJobNextExecutionRepository.registerNext({
            jobNextExecution: nextDate,
            idJob: job.idJob,
          });
        }
      } catch (error) {
        console.log('ERROR => ', error);
        // TODO: Register execution failure on db
      }
    });
  }
}
