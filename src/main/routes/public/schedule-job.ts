import { Route } from '@/infra/http/utils/http-server/types';
import { fileUploaderAdapter } from '@/main/adapters';
import { makeScheduleJobController } from '@/main/factories/controllers';

const uploadOptions = {
  filter: {
    filterEnabled: true,
    validTypes: ['text/javascript', 'application/javascript'],
  },
  storage: {
    folderName: 'uploads',
    keepOriginalFilename: true,
  },
};
export default function (route: Route) {
  route.post(
    '/schedule',
    fileUploaderAdapter(uploadOptions).single('file'),
    makeScheduleJobController()
  );
}
