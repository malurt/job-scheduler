import { makeTableBuilder } from '../../schema';

const builder = makeTableBuilder({
  database: 'ScheduleJob',
  tablePrefix: 'tb_',
});

export const SCHEDULE_JOB_DB = {
  JOB: {
    JOB: builder({
      table: '[job].[tb_job]',
      columns: <const>[
        'id_job',
        'job_external_id',
        'created_at',
        'job_filepath',
        'job_execution_rule',
        'job_next_execution',
        'id_job_status',
        'id_job_type',
      ],
    }),
    JOB_TYPE: builder({
      table: '[job].[tb_job_type]',
      columns: <const>['id_job_type', 'job_type'],
    }),
    JOB_STATUS: builder({
      table: '[job].[tb_job_status]',
      columns: <const>['id_job_status', 'job_status'],
    }),
    JOB_EXECUTION: builder({
      table: '[job].[tb_job_execution]',
      columns: <const>['id_job_execution', 'execution_datetime', 'id_job'],
    }),
  },
};
