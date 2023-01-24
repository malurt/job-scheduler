import { Controller, Middleware } from '@/presentation/protocols';
import {
  IRouter,
  IRouterHandler,
  IRouterMatcher,
  NextFunction,
  Request,
  Response,
} from 'express';

import { Route as RouteClass } from './route';

export type Callback = () => unknown | Promise<unknown>;

export type ExpressRoute = IRouterMatcher<IRouter> & IRouterHandler<IRouter>;

export type DefaultExpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type CallbackWithStateHook = (
  req: Request,
  res: Response,
  next: NextFunction,
  stateHook: [Record<string, unknown>, Function]
) => void;

export type RouteMiddleware =
  | Controller
  | Middleware
  | CallbackWithStateHook
  | Function;

export type Route = RouteClass;
