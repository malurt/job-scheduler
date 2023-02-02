import {
  RegisterJobRepository,
  SearchNextJobsRepository,
} from '@/data/protocols/db';
import { JobToBeDone } from '@/domain/models';
import { Repository, SCHEDULE_JOB_DB } from '@/infra/db/mssql/util';
import { formateCamelCaseKeysForSnakeCase } from '@badass-team-code/formatted-cases-words';

const {
  JOB: { JOB },
} = SCHEDULE_JOB_DB;

export class JobMsSQLRepository
  extends Repository
  implements RegisterJobRepository, SearchNextJobsRepository
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
    _currentDate: SearchNextJobsRepository.Params
  ): SearchNextJobsRepository.Result {
    return new Promise<JobToBeDone[]>((resolve, _reject) => {
      resolve([
        {
          jobNextExecution: 1,
          IdJob: 1,
          IdJobType: 1,
          jobFilepath: 'string',
          jobExecutionRule: 'string',
        },
      ]);
    });
  }
}
