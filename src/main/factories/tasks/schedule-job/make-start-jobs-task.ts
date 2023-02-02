import { SearchNextJobsTask } from '@/schedule';
import { Task } from '@/schedule/protocols';
import { logger } from '@/util';

import { makeErrorHandler } from '../../usecases';

export const makeSearchNextJobsTask = (): Task => {
  return new SearchNextJobsTask(logger, makeErrorHandler());
};
