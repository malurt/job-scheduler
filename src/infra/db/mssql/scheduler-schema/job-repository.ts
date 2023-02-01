import { RegisterJobRepository } from '@/data/protocols/db';
import { Repository, SCHEDULE_JOB_DB } from '@/infra/db/mssql/util';
import { formateCamelCaseKeysForSnakeCase } from '@badass-team-code/formatted-cases-words';

const {
  JOB: { JOB },
} = SCHEDULE_JOB_DB;

export class JobMsSQLRepository
  extends Repository
  implements RegisterJobRepository
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
}
