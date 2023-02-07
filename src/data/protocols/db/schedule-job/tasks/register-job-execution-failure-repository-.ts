export interface RegisterJobExecutionFailureRepository {
  registerFailure(
    failedExecutionData: RegisterJobExecutionFailureRepository.Params
  ): RegisterJobExecutionFailureRepository.Result;
}

export namespace RegisterJobExecutionFailureRepository {
  export type Params = {
    executionAttemptDatetime: Date;
    idJob: number;
  };
  export type Result = Promise<void>;
}
