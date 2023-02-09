export interface RegisterJobExecutionRepository {
  registerExecution(
    executionData: RegisterJobExecutionRepository.Params
  ): RegisterJobExecutionRepository.Result;
}

export namespace RegisterJobExecutionRepository {
  export type Params = {
    executionDatetime: Date;
    executionConsoleOutput?: string;
    idJob: number;
    idExecutionResult: number;
    jobStatus: number;
  };
  export type Result = Promise<void>;
}
