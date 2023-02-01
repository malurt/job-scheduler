import { Wrapper } from '@/domain/models/transaction';

export interface RegisterJobRepository {
  register(params: RegisterJobRepository.Params): RegisterJobRepository.Result;
}

export namespace RegisterJobRepository {
  export type Params = {
    jobFilepath: string;
    jobExecutionRule: string;
    jobNextExecution: number;
    idJobType: number;
  };

  export type Result = Promise<Wrapper<void>>;
}
