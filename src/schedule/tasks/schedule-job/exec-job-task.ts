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
      await this.execJob.exec(state.searchNextJobs.jobsToBeDone);
      this.logger.log({
        level: 'info',
        message: "Hello! I'm supposed to exec the jobs!!! :)",
      });

      next();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }
}
