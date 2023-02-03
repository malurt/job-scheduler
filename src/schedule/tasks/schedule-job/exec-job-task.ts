import { Logger } from '@/data/protocols/utils';
import { ErrorHandler, ExecJob } from '@/domain/usecases';
import { Task } from '@/schedule/protocols';

export class ExecJobsTask implements Task {
  constructor(
    private readonly logger: Logger,
    private readonly execJob: ExecJob,
    private readonly errorHandler: ErrorHandler
  ) {}
  async handle([state]: Task.State, next: Task.Next): Task.Result {
    try {
      const { jobsToBeDone } = state.searchNextJobs;

      if (jobsToBeDone.length >= 1) await this.execJob.exec(jobsToBeDone);
      this.logger.log({
        level: 'info',
        message: `Total of ${jobsToBeDone.length} job(s) executed!`,
      });

      next();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }
}
