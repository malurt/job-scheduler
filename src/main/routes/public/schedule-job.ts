import { Route } from '@/infra/http/utils/http-server/types';
import { makeScheduleJobController } from '@/main/factories/controllers';

export default function (route: Route) {
  route.post('/schedule', makeScheduleJobController());
}
