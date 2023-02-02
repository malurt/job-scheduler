export type ConvertToTimestamp = (originalExpression: string) => {
  timestamp: Date;
  originalExpressionType: 'CRON' | 'DATE';
};
