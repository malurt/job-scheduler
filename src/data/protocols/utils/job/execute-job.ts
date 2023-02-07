export type ExecuteJob = (
  command: string,
  args: string[]
) => Promise<ExecutionResult>;

export type ExecutionResult = {
  execCode: number;
  output?: string;
};
