import { PublishInExchangeService } from '@/data/protocols/mq/publish-in-exchange';
import { PublishInQueueService } from '@/data/protocols/mq/publish-in-queue';
import { SendReprocessing } from '@/domain/usecases';

export class MqSendReprocessing implements SendReprocessing {
  constructor(
    private readonly publishInExchangeService: PublishInExchangeService,
    private readonly publishInQueueService: PublishInQueueService,
    private readonly queueOptions: {
      queue: string;
      exchange?: string;
      routingKey?: string;
    },
    private readonly maxTries: number,
    private readonly delays: number[]
  ) {}

  reprocess({
    data: {
      payload,
      state: { reprocessing, ...state },
    },
    middleware,
    progress,
    ...params
  }: SendReprocessing.Params): SendReprocessing.Result {
    const TRIES_SCALE = 1;
    const MINIMUM_DELAY_MULTIPLIER = 2;
    const MAX_TRIES = +this.maxTries;
    const DELAYS = this.delays;

    if (DELAYS.length < MAX_TRIES)
      for (let index = 0; DELAYS.length < MAX_TRIES; index += 1) {
        const newDelay = DELAYS[DELAYS.length - 1] * MINIMUM_DELAY_MULTIPLIER;
        DELAYS.push(newDelay);
      }

    const tries = params.tries ?? {
      current: 1,
      max: MAX_TRIES,
      delays: DELAYS,
    };

    const newPayload = {
      reprocessing: {
        middleware,
        progress,
        tries,
        data: { payload, state },
      },
    };

    if (!reprocessing.tries) {
      const [delay] = DELAYS;

      if (!this.queueOptions.exchange) {
        this.publishInQueueService.publishInQueue(
          this.queueOptions.queue,
          newPayload,
          {
            ...payload.headers,
          }
        );
        return;
      }

      this.publishInExchangeService.publishInExchange(
        this.queueOptions.exchange,
        newPayload,
        this.queueOptions.routingKey ?? '',
        {
          ...payload.headers,
          'x-delay': delay,
        }
      );
      return;
    }

    tries.current += TRIES_SCALE;

    if (tries.current > tries.max) return;

    if (!this.queueOptions.exchange) {
      this.publishInQueueService.publishInQueue(
        this.queueOptions.queue,
        newPayload,
        {
          ...payload.headers,
        }
      );
      return;
    }

    this.publishInExchangeService.publishInExchange(
      this.queueOptions.exchange,
      newPayload,
      this.queueOptions.routingKey ?? '',
      {
        ...payload.headers,
        'x-delay': tries.delays[tries.current - 1],
      }
    );
  }
}
