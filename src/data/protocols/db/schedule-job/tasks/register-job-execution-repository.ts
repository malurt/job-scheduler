export interface RegisterJobExecutionRepository {
  registerExecution(
    executionData: RegisterJobExecutionRepository.Params
  ): RegisterJobExecutionRepository.Result;
}

export namespace RegisterJobExecutionRepository {
  export type Params = {
    executionDatetime: Date;
    idJob: number;
    jobFinished: boolean;
  };
  export type Result = Promise<void>;
}
