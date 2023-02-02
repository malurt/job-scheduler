import { JobToBeDone } from '@/domain/models';

export type SharedState = {
  searchNextJobs: { jobsToBeDone: JobToBeDone[] };
};
