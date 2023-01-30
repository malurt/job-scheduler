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
  export enum Exceptions {}
}
