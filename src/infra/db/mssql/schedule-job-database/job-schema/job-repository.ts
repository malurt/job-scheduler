import {
  RegisterJobExecutionFailureRepository,
  RegisterJobExecutionRepository,
  RegisterJobNextExecutionRepository,
  RegisterJobRepository,
  SearchNextJobsRepository,
} from '@/data/protocols/db';
import { Repository, SCHEDULE_JOB_DB } from '@/infra/db/mssql/util';
import { convertSnakeCaseKeysToCamelCase, sumMinutes } from '@/util';
import { JOB_STATUS } from '@/util/constants';
import { formateCamelCaseKeysForSnakeCase } from '@badass-team-code/formatted-cases-words';

const {
  JOB: { JOB, JOB_EXECUTION },
} = SCHEDULE_JOB_DB;

export class JobMsSQLRepository
  extends Repository
  implements
    RegisterJobRepository,
    SearchNextJobsRepository,
    RegisterJobExecutionRepository,
    RegisterJobNextExecutionRepository,
    RegisterJobExecutionFailureRepository
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
    // Disconsider seconds and milliseconds
    const from = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getUTCDate(),
      currentDate.getHours(),
      currentDate.getMinutes()
    );
    const to = sumMinutes(from, 1);

    const jobs = await this.connection(JOB.TABLE)
      .select('*')
      .whereBetween(JOB.COLUMNS.JOB_NEXT_EXECUTION, [from, to])
      .andWhere(JOB.COLUMNS.ID_JOB_STATUS, 1);

    return convertSnakeCaseKeysToCamelCase(jobs);
  }

  async registerNext(
    nextExecutionData: RegisterJobNextExecutionRepository.Params
  ): RegisterJobNextExecutionRepository.Result {
    const connection = await this.getConnection();

    await connection(JOB.TABLE)
      .where(JOB.COLUMNS.ID_JOB, nextExecutionData.idJob)
      .update(
        JOB.COLUMNS.JOB_NEXT_EXECUTION,
        nextExecutionData.jobNextExecution
      );
  }

  async registerExecution(
    executedJobData: RegisterJobExecutionRepository.Params
  ): RegisterJobExecutionRepository.Result {
    const connection = await this.getConnection();

    const executionData = (({ executionDatetime, idJob }) => ({
      executionDatetime,
      idJob,
    }))(executedJobData);

    await connection(JOB_EXECUTION.TABLE)
      .insert(formateCamelCaseKeysForSnakeCase(executionData))
      .returning('*');

    if (executedJobData.jobStatus !== JOB_STATUS.ACTIVE)
      await connection(JOB.TABLE)
        .where(JOB.COLUMNS.ID_JOB, executedJobData.idJob)
        .update(JOB.COLUMNS.ID_JOB_STATUS, executedJobData.jobStatus);
  }

  async registerFailure(
    executionData: RegisterJobExecutionFailureRepository.Params
  ): RegisterJobExecutionFailureRepository.Result {
    // eslint-disable-next-line no-console
    console.log('Registrando Erro no banco', executionData);
  }
}
