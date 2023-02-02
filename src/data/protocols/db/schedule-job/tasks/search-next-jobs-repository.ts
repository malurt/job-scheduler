import { JobToBeDone } from '@/domain/models';

export interface SearchNextJobsRepository {
  search(
    currentDate: SearchNextJobsRepository.Params
  ): SearchNextJobsRepository.Result;
}

export namespace SearchNextJobsRepository {
  export type Params = Date;
  export type Result = Promise<JobToBeDone[]>;
}
