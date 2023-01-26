import { Controller } from '@/presentation/protocols';
import { badRequest, created } from '@/presentation/utils';
import { DICTIONARY, template } from '@/util';

export class ScheduleJobController implements Controller {
  async handle(
    httpRequest: Controller.HttpRequest,
    [,]: Controller.State
  ): Controller.Result {
    return created(
      template(DICTIONARY.RESPONSE.MESSAGE.OK, 'Job scheduled'),
      {}
    );
  }
}
