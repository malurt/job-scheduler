import { sqlConnection } from '@/infra/db/mssql/util';
import { logger, MONGO, Scheduler } from '@/util';
import mongoose from 'mongoose';

import { schedulerSetup } from './configs/scheduler';

const scheduler = new Scheduler();

(async () => {
  try {
    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGO.URL(), {
      dbName: MONGO.NAME,
      authSource: MONGO.AUTH_SOURCE,
      authMechanism: 'SCRAM-SHA-1',
    });

    await sqlConnection.raw('SELECT 1');
  } catch (error) {
    logger.log(error);
  }
})();

logger.log({ level: 'info', message: 'Scheduler started!' });
schedulerSetup(scheduler);
