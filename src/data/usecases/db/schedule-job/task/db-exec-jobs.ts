/* eslint-disable no-console */
import {
  RegisterJobExecutionFailureRepository,
  RegisterJobExecutionRepository,
  RegisterJobNextExecutionRepository,
} from '@/data/protocols/db';
import {
  ExecuteJob,
  GetCronExpression,
  GetCronNextExecution,
} from '@/data/protocols/utils';
import { ExecJob } from '@/domain/usecases';
import { JOB_STATUS } from '@/util/constants';
import { resolve } from 'path';

export class DbExecJob implements ExecJob {
  constructor(
    private readonly registerJobExecutionRepository: RegisterJobExecutionRepository,
    private readonly registerJobNextExecutionRepository: RegisterJobNextExecutionRepository,
    private readonly getCronExpression: GetCronExpression,
    private readonly getCronNextExecution: GetCronNextExecution,
    private readonly executeJob: ExecuteJob,
    private readonly registerJobExecutionFailureRepository: RegisterJobExecutionFailureRepository
  ) {}

  async exec(jobs: ExecJob.Params): ExecJob.Result {
    const promises = jobs.map(async (job) => {
      // Exec job
      try {
        const filepath = resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          '..',
          'uploads',
          job.jobFilepath
        );
        await this.executeJob('node', [filepath]);

        // Register job execution
        const jobStatus =
          job.idJobType === 2 ? JOB_STATUS.FINISHED : JOB_STATUS.ACTIVE; // Is the job specific(2)? If so, it's already finished. If not, it is recurring and has not been finished
        await this.registerJobExecutionRepository.registerExecution({
          executionDatetime: new Date(),
          idJob: job.idJob,
          jobStatus,
        });
        // Register job next execution (if necessary)
        if (jobStatus === JOB_STATUS.ACTIVE) {
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
        this.registerJobExecutionFailureRepository.registerFailure({
          executionAttemptDatetime: new Date(),
          idJob: job.idJob,
        });
      }
    });
  }
}
