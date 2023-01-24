import { Job } from '@/consumer/protocols';
import { Logger } from '@/data/protocols/utils';
import { EsUpdateEvent } from '@/data/usecases/elasticsearch';
import { ErrorHandler } from '@/domain/usecases';
import { ELASTICSEARCH } from '@/util';

export class UpdateEventJob implements Job {
  constructor(
    private updateEvent: EsUpdateEvent,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler
  ) {}
  async handle(
    _payload: Job.Payload,
    _state: Job.State,
    next: Job.Next
  ): Job.Result {
    try {
      if (!ELASTICSEARCH.ENABLED) return await next();

      const event = await this.updateEvent.update({
        status: 'SUCCESS',
      });

      this.logger.log({
        level: 'debug',
        message: 'UPDATE EVENT',
        payload: event,
      });

      return next();
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }
}
