import { JobToBeDone } from '@/domain/models';

export interface ExecJob {
  exec: (jobs: ExecJob.Params) => ExecJob.Result;
}

export namespace ExecJob {
  export type Params = JobToBeDone[];
  export type Result = Promise<void>;
  export enum Exceptions {}
}
