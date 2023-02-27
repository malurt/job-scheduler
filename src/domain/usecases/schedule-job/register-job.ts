import { Wrapper } from '@/domain/models/transaction';

export interface RegisterJob {
  register: (params: RegisterJob.Params) => RegisterJob.Result;
}

export namespace RegisterJob {
  export type Params = {
    executionRule: string;
    filename: string;
  };
  export type Result = Promise<Wrapper<void>>;
  export enum Exceptions {
    INVALID_EXECUTION_RULE_FORMAT = 'Invalid executionRule format! Try using Brazilian date format (yyyy-MM-dd hh:mm) or cron pattern',
    INVALID_EXECUTION_DATE = 'Invalid executionRule date! Execution must happen in a future date',
  }
}
