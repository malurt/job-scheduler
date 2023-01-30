import { Wrapper } from '@/domain/models/transaction';

export interface RegisterJobRepository {
  register(params: RegisterJobRepository.Params): RegisterJobRepository.Result;
}

export namespace RegisterJobRepository {
  export type Params = {
    filepath: string;
    executionRule: string;
    taskNextExecution: string;
    taskType: number;
  };

  export type Result = Promise<Wrapper<void>>;
}
