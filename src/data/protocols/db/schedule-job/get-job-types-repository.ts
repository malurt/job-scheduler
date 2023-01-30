import { JobType } from '@/domain/models';

export interface GetJobTypesRepository {
  get(): GetJobTypesRepository.Result;
}

export namespace GetJobTypesRepository {
  export type Params = void;
  export type Result = Promise<JobType[]>;
}
