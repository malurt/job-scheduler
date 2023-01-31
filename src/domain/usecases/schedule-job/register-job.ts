import { Wrapper } from '@/domain/models/transaction';
import { JOB_TYPES } from '@/util/constants/schedule-job';

export interface RegisterJob {
  register: (params: RegisterJob.Params) => RegisterJob.Result;
}

export namespace RegisterJob {
  export type Params = {
    executionRule: string;
    filename: string;
    jobType: keyof typeof JOB_TYPES;
  };
  export type Result = Promise<Wrapper<void>>;
  export enum Exceptions {
    INVALID_EXECUTION_RULE_FORMAT = 'Invalid executionRule format! Try using Brazilian date format (dd/mm/yyyy hh:MM) or cron pattern',
    INVALID_EXECUTION_DATE = 'Invalid executionRule date! Execution must happen in a future date',
  }
}
