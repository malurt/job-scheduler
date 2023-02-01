import { SearchJobsTask } from '@/schedule';
import { Task } from '@/schedule/protocols';
import { logger } from '@/util';

import { makeErrorHandler } from '../../usecases';

export const makeSearchJobsTask = (): Task => {
  return new SearchJobsTask(logger, makeErrorHandler());
};
