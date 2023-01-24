import { Route } from '@/infra/http/utils/http-server/types';

export default function (route: Route) {
  route.post('/schedule', (_, res) => {
    res.status(200).json({ message: 'The scheduling service is online!' });
  });
}
