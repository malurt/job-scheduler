import {
  HttpClient,
  HttpRequest,
  HttpResponse,
} from '@/data/protocols/http/adapters';
import { apmSpan } from '@/util/observability/apm';
import {
  datoraHttpLogger,
  logger,
} from '@/util/observability/loggers/decorators';
import Agent from 'agentkeepalive';
import { AxiosInstance } from 'axios';
import FormData from 'form-data';

const decorators = {
  options: { subType: 'http', name: 'Http Request' },
  params: {
    'request-body': 'body',
    'request-headers': 'headers',
    'request-url': 'url',
  },
  result: {
    'response-body': 'body',
    'response-status-code': 'statusCode',
    'response-headers': 'headers',
  },
};

const AgentOptions = {
  keepAlive: true,
  maxSockets: 100,
  maxFreeSockets: 10,
  timeout: 60000,
  freeSocketTimeout: 30000,
};

export class FormDataRequestAdapter implements HttpClient {
  constructor(private readonly axios: AxiosInstance) {
    this.axios.defaults.httpAgent = new Agent(AgentOptions);
    this.axios.defaults.httpsAgent = new Agent.HttpsAgent(AgentOptions);
    this.axios.interceptors.response.use(undefined, (error) => error.response);
  }

  @datoraHttpLogger()
  @logger({
    options: decorators.options,
    input: decorators.params,
    output: decorators.result,
  })
  @apmSpan({
    options: decorators.options,
    params: decorators.params,
    result: decorators.result,
  })
  async request(data: HttpRequest): Promise<HttpResponse> {
    const formData = new FormData();

    Object.entries(data.body).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
        return;
      }
      formData.append(key, value);
    });

    const axiosResponse = await this.axios({
      ...data,
      data: formData,
      headers: { ...data.headers, ...formData.getHeaders() },
    });

    if (!axiosResponse) throw new Error('REQUEST_ERROR');

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
      headers: axiosResponse.headers,
    };
  }
}
