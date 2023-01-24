import { EsUpdateEvent } from '@/data/usecases/elasticsearch';
import { Elasticsearch } from '@/infra/service';
import { formatDate, getAPMTransactionIds, merge } from '@/util';

export const updateEventStatusToError = async () => {
  const elasticsearch = new Elasticsearch();
  const esUpdateEvent = new EsUpdateEvent(
    elasticsearch,
    elasticsearch,
    getAPMTransactionIds,
    merge,
    formatDate
  );

  await esUpdateEvent.update({ status: 'ERROR' });
};
