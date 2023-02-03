/* eslint-disable no-console */
import {
  RegisterJobExecutionRepository,
  RegisterJobNextExecutionRepository,
  RegisterJobRepository,
  SearchNextJobsRepository,
} from '@/data/protocols/db';
import { Repository, SCHEDULE_JOB_DB } from '@/infra/db/mssql/util';
import { convertSnakeCaseKeysToCamelCase, sumMinutes } from '@/util';
import { formateCamelCaseKeysForSnakeCase } from '@badass-team-code/formatted-cases-words';

const {
  JOB: { JOB },
} = SCHEDULE_JOB_DB;

export class JobMsSQLRepository
  extends Repository
  implements
    RegisterJobRepository,
    SearchNextJobsRepository,
    RegisterJobExecutionRepository,
    RegisterJobNextExecutionRepository
{
  async register(
    params: RegisterJobRepository.Params
  ): RegisterJobRepository.Result {
    const connection = await this.getConnection();

    const [record] = await connection(JOB.TABLE)
      .insert(formateCamelCaseKeysForSnakeCase(params))
      .returning('*');

    return {
      record,
      transaction: this.transactionAdapter(connection),
    };
  }

  async search(
    currentDate: SearchNextJobsRepository.Params
  ): SearchNextJobsRepository.Result {
    const from = currentDate;
    const to = sumMinutes(currentDate, 2);

    const jobs = await this.connection(JOB.TABLE)
      .select('*')
      .whereBetween(JOB.COLUMNS.JOB_NEXT_EXECUTION, [from, to]);

    return convertSnakeCaseKeysToCamelCase(jobs);
  }

  async registerNext(
    nextExecutionData: RegisterJobNextExecutionRepository.Params
  ): RegisterJobNextExecutionRepository.Result {
    console.log('Registering next execution of job', nextExecutionData.idJob);
  }

  async registerExecution(
    executedJobData: RegisterJobExecutionRepository.Params
  ): RegisterJobExecutionRepository.Result {
    console.log('Registering execution of job', executedJobData.idJob);
  }
}
