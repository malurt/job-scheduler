export type GetJobExecutionData = (originalExpression: string) => {
  nextExecution: Date;
  originalExpressionType: 'CRON' | 'DATE';
};
