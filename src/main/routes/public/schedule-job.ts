import { Route } from '@/infra/http/utils/http-server/types';
import { fileUploaderAdapter } from '@/main/adapters';
import { makeScheduleJobController } from '@/main/factories/controllers';
import { makeRegisterJobMiddleware } from '@/main/factories/middlewares/';
import { uploadOptions } from '@/util';

export default function (route: Route) {
  route.post(
    '/schedule',
    fileUploaderAdapter(uploadOptions),
    makeRegisterJobMiddleware(),
    makeScheduleJobController()
  );
}
