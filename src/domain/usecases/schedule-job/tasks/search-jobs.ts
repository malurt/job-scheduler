import { JobToBeDone } from '@/domain/models';

export interface SearchNextJobs {
  search: () => SearchNextJobs.Result;
}

export namespace SearchNextJobs {
  export type Params = void;
  export type Result = Promise<JobToBeDone[]>;
  export enum Exceptions {}
}
