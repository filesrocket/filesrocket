import { Request, Response, NextFunction } from "express";

import { PROPERTY_UPLOADED, RocketMethods } from "./declarations";
import { Middleware } from "./index";

export interface MethodsHook<T = void> {
  create: Middleware<T>[];
  list: Middleware<T>[];
  remove: Middleware<T>[];
}

export interface Hooks {
  after: Partial<MethodsHook>;
  before: Partial<MethodsHook>;
}

function formatter(length: number): Middleware<void> {
  return (req: Request, res: Response, next: NextFunction) => {
    length > 0 ? next() : res.status(200).json((req as any)[PROPERTY_UPLOADED]);
  }
}

export interface HandlerOptions {
  method: keyof MethodsHook;
  hooks?: Partial<Hooks>;
  controller: RocketMethods;
}

export function serviceHandler(options: HandlerOptions): Middleware<void>[] {
  const { hooks = {}, method, controller } = options;
  const beforeHook: Partial<MethodsHook> = hooks.before || {};
  const afterHook: Partial<MethodsHook> = hooks.after || {};

  const before = beforeHook[method] || [];
  const after = afterHook[method] || [];

  return [
    ...before,
    controller[method](),
    formatter(after.length),
    ...after,
    formatter(0)
  ];
}
