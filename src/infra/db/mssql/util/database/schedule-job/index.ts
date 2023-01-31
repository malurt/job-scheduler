import { makeTableBuilder } from '../../schema';

const builder = makeTableBuilder({
  database: 'ScheduleJob',
  tablePrefix: 'tb_',
});

export const SCHEDULE_JOB_DB = {
  JOBS: {
    JOB: builder({
      table: '[jobs].[tb_job]',
      columns: <const>[
        'id_job',
        'job_external_id',
        'created_at',
        'job_filepath',
        'job_execution_rule',
        'job_next_execution',
        'job_finished',
        'id_job_type',
      ],
    }),
    JOB_TYPE: builder({
      table: '[jobs].[tb_job_type]',
      columns: <const>['id_job_type', 'job_type'],
    }),
    JOB_execution: builder({
      table: '[jobs].[tb_job_execution]',
      columns: <const>['id_job_execution', 'execution_datetime', 'id_job'],
    }),
  },
};
