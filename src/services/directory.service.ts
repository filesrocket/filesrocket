import { NextFunction, Request, Response } from "express";

import { Middleware, DataResult, DataDir, PROPERTY_UPLOADED } from "../index";
import { handlerPromise } from "../utils";
import { RocketBase } from "../base";

export class DirectoryService extends RocketBase<DataDir, DataResult> {
  constructor(path: string) {
    super(path);
    this.type = "Directories";
  }

  create(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const serviceName = req.params.service;

      const service = this.getService(serviceName);

      if (!service) {
        return next(new Error(`The ${ serviceName } rocket not register`));
      }

      if (typeof service?.create !== "function") {
        return next(new Error("Create method not supported."));
      }

      const [entity, err] = await handlerPromise(service.create(req.body, req.query));
      if (!entity || err) next(err);

      Object.defineProperty(req, PROPERTY_UPLOADED, { value: entity });
      next();
    }
  }

  list(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const serviceName = req.params.service;

      const service = this.getService(serviceName);

      if (!service) {
        return next(new Error(`The ${ serviceName } rocket not register`));
      }

      if (typeof service?.list !== "function") {
        return next(new Error("List method not supported."));
      }

      const [entities, err] = await handlerPromise(service.list(req.query));
      if (!entities || err) next(err);

      Object.defineProperty(req, PROPERTY_UPLOADED, { value: entities });
      next();
    }
  }

  remove(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const serviceName = req.params.service;

      const service = this.getService(serviceName);

      if (!service) {
        return next(new Error(`The ${ serviceName } rocket not register`));
      }

      if (typeof service?.remove !== "function") {
        return next(new Error("Remove method not supported."));
      }

      const { path = "" } = req.query;
      const [entity, err] = await handlerPromise(service.remove(path as string, req.query));
      if (!entity || err) next(new Error(err));

      Object.defineProperty(req, PROPERTY_UPLOADED, { value: entity });
      next();
    }
  }
}
