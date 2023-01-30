import {
  GetJobTypesRepository,
  RegisterJobRepository,
} from '@/data/protocols/db';
import { Repository } from '@/infra/db/mssql/util';

export class JobMsSQLRepository
  extends Repository
  implements GetJobTypesRepository, RegisterJobRepository
{
  register(
    _params: RegisterJobRepository.Params
  ): RegisterJobRepository.Result {
    return new Promise<any>((resolve, _reject) => {
      resolve(null);
    });
  }
  get(): GetJobTypesRepository.Result {
    return new Promise<any>((resolve, _reject) => {
      resolve([
        {
          typeId: 12,
          jobType: 'string',
        },
      ]);
    });
  }
}
