import { ControllerMethods, Middleware, PROPERTY_UPLOADED } from "./declarations";
import { Request, Response, NextFunction } from "express";

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
    res.status(200).json((req as any)[PROPERTY_UPLOADED]);
  }
}

export function serviceHandler(
  rocket: ControllerMethods,
  method: keyof HooksMethods,
  hooks: Partial<Hooks> = {}
): Middleware[] {
  const beforeHook: Partial<HooksMethods> = hooks.before || {};
  const afterHook: Partial<HooksMethods> = hooks.after || {};

  const before = beforeHook[method] || [];
  const after = afterHook[method] || [];

  return [
    ...before,
    rocket[method](),
    formatter(after.length),
    ...after,
    formatter(0)
  ];
}
