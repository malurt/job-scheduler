import { RegisterJobRepository } from '@/data/protocols/db';
import { Repository } from '@/infra/db/mssql/util';

export class JobMsSQLRepository
  extends Repository
  implements RegisterJobRepository
{
  register(
    _params: RegisterJobRepository.Params
  ): RegisterJobRepository.Result {
    return new Promise<any>((resolve, _reject) => {
      resolve(null);
    });
  }
}
