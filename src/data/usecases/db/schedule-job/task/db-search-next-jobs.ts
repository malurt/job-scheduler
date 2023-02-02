import { SearchNextJobsRepository } from '@/data/protocols/db';
import { SearchNextJobs } from '@/domain/usecases';

export class DbSearchNextJobs implements SearchNextJobs {
  constructor(
    private readonly searchNextJobsRepository: SearchNextJobsRepository
  ) {}

  async search(): SearchNextJobs.Result {
    return this.searchNextJobsRepository.search(new Date());
  }
}
