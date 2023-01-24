import { httpServer } from '@/infra/http/utils/http-server';
import { httpLoggerAdapter } from '@/main/adapters';
import { elasticAPM } from '@/util';
import { SERVER } from '@/util/constants';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import { createHttpRequestLog } from './facades';

elasticAPM();

const application = httpServer();

application.use(cors({ exposedHeaders: 'X-Total-Count' }));
application.use(helmet());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(httpLoggerAdapter(createHttpRequestLog));

application.setSharedState({});

application.setBaseUrl(SERVER.BASE_URI);

const routesFolder = path.resolve(__dirname, 'routes');
const publicRoutesFolder = path.resolve(routesFolder, 'public');
const privateRoutesFolder = path.resolve(routesFolder, 'private');

application.routesDirectory(publicRoutesFolder);
application.routesDirectory(privateRoutesFolder);

export { application };
