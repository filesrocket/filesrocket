import { Request, Response, NextFunction } from "express";

import { ControllerMethods, Middleware, ROCKET_RESULT } from "./declarations";
import { Query } from "./index";

export interface HooksMethods {
  create: Middleware[];
  list: Middleware[];
  remove: Middleware[];
}

export interface Hooks {
  before?: Partial<HooksMethods>;
  after?: Partial<HooksMethods>;
}

function formatter(length: number): Middleware {
  return (req: Request, res: Response, next: NextFunction) => {
    if (length > 0) return next();
    res.status(200).json((req as any)[ROCKET_RESULT]);
  }
}

export interface Handler {
  controller: ControllerMethods;
  method: keyof HooksMethods;
  query?: Query;
  hooks?: Partial<Hooks>;
}

export function serviceHandler(options: Handler): Middleware[] {
  const { hooks = {}, method, controller, query } = options;
  const beforeHook: Partial<HooksMethods> = hooks.before || {};
  const afterHook: Partial<HooksMethods> = hooks.after || {};

  const before = beforeHook[method] || [];
  const after = afterHook[method] || [];

  return [
    ...before,
    controller[options.method](query),
    formatter(after.length),
    ...after,
    formatter(0)
  ];
}
