import { Request, Response, NextFunction } from 'express'

import { ControllerMethods, Middleware, ROCKET_RESULT } from './declarations'
import { Query } from './index'

export interface HooksMethods {
  create: Middleware[];
  list: Middleware[];
  remove: Middleware[];
}

export interface ObjectHooks {
  before?: Partial<HooksMethods>;
  after?: Partial<HooksMethods>;
}

export type Hook = Middleware;

export interface Hooks {
  before: Hook[];
  after: Hook[];
}

function formatter (length: number): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    if (length > 0) return next()
    res.status(200).json((req as any)[ROCKET_RESULT])
  }
}

export interface Handler {
  controller: ControllerMethods;
  method: keyof HooksMethods;
  query?: Query;
  hooks?: Partial<Hooks>;
}

export function serviceHandler (options: Handler): Middleware[] {
  const { hooks = {}, controller, query } = options
  const { before = [], after = [] } = hooks

  return [
    ...before,
    controller[options.method](query),
    formatter(after.length),
    ...after,
    formatter(0)
  ]
}
