import { Logger } from '@/data/protocols/utils';
import { ErrorHandler, RegisterJob } from '@/domain/usecases';
import { Middleware } from '@/presentation/protocols/middleware';
import { badRequest, serverError } from '@/presentation/utils';

export class RegisterJobMiddleware implements Middleware {
  constructor(
    private readonly registerJob: RegisterJob,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler
  ) {}

  async handle(
    httpRequest: Middleware.HttpRequest,
    [,]: Middleware.State,
    next: Middleware.Next
  ): Middleware.Result {
    try {
      const { executionRule } = httpRequest.body;
      const jobType = httpRequest.body.jobType.toUpperCase();
      const filename = httpRequest.file?.filename ?? 'maria';

      await this.registerJob.register({
        executionRule,
        filename,
        jobType,
      });

      this.logger.log({
        level: 'info',
        message: `[JOB-SCHEDULING] - JOB REGISTRATION COMPLETED `,
      });

      return next();
    } catch (error) {
      await this.errorHandler.handle(error);
      switch (error.message) {
        case RegisterJob.Exceptions.INVALID_EXECUTION_DATE:
          return badRequest({
            message: error.message,
            payload: {},
          });
        default:
          return serverError(error);
      }
    }
  }
}
