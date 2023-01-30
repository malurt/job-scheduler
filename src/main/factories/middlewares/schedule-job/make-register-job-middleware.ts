import { DbRegisterJob } from '@/data/usecases/db/schedule-job/db-register-job';
import { JobMsSQLRepository } from '@/infra/db/mssql/scheduler-schema';
import { RegisterJobMiddleware } from '@/presentation/middlewares';
import { convertToTimestamp, logger, rollbackAll } from '@/util';

import { makeErrorHandler } from '../../usecases';

type Params = { useTransaction: boolean };

export const makeRegisterJobMiddleware = (
  { useTransaction }: Params = { useTransaction: false }
) => {
  const jobRepository = new JobMsSQLRepository(useTransaction);
  const dbRegisterJob = new DbRegisterJob(convertToTimestamp, jobRepository);
  return new RegisterJobMiddleware(
    dbRegisterJob,
    logger,
    makeErrorHandler([
      async (_error, transactions) => {
        if (!transactions) return;
        await rollbackAll(transactions);
      },
    ])
  );
};
