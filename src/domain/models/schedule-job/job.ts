export interface JobToBeDone {
  jobNextExecution: number;
  idJob: number;
  idJobType: number;
  jobFilepath: string;
  jobExecutionRule: string;
}
