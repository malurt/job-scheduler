import { Logger } from '@/data/protocols/utils';
import { ErrorHandler, SearchNextJobs } from '@/domain/usecases';
import { Task } from '@/schedule/protocols';

export class SearchNextJobsTask implements Task {
  constructor(
    private readonly logger: Logger,
    private readonly searchNextJobs: SearchNextJobs,
    private readonly errorHandler: ErrorHandler
  ) {}
  async handle([, setState]: Task.State, next: Task.Next): Task.Result {
    try {
      const jobsToBeDone = await this.searchNextJobs.search();

      setState({ searchNextJobs: { jobsToBeDone } });

      this.logger.log({
        level: 'info',
        message: "Hello! I'm supposed to look for the jobs to be done!!! :)",
      });

      next();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }
}
