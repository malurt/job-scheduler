export type ConvertToTimestamp = (originalExpression: string) => {
  timestamp: number;
  originalExpressionType: 'CRON' | 'DATE';
};
