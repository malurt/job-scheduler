export interface RegisterJobNextExecutionRepository {
  registerNext(
    executionData: RegisterJobNextExecutionRepository.Params
  ): RegisterJobNextExecutionRepository.Result;
}

export namespace RegisterJobNextExecutionRepository {
  export type Params = {
    jobNextExecution: Date;
    idJob: number;
  };
  export type Result = Promise<void>;
}
