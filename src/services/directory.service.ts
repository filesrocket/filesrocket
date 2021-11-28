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
      try {
        const serviceName = req.params.service;

        const service = this.getService(serviceName);

        if (!service) {
          return next(new Error(`The ${ serviceName } rocket not register`));
        }

        if (typeof service?.create !== "function") {
          return next(new Error("Create method not supported."));
        }

        const [entity, err] = await handlerPromise(service.create(req.body, req.query));
        if (!entity || err) return next(err);

        Object.defineProperty(req, PROPERTY_UPLOADED, { value: entity });
        next();
      } catch (error) {
        next(error);
      }
    }
  }

  list(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        const serviceName = req.params.service;

        const service = this.getService(serviceName);

        if (!service) {
          return next(new Error(`The ${ serviceName } rocket not register`));
        }

        if (typeof service?.list !== "function") {
          return next(new Error("List method not supported."));
        }

        const entities = await service.list(req.query);

        Object.defineProperty(req, PROPERTY_UPLOADED, { value: entities });
        next();
      } catch (error) {
        next(error);
      }
    }
  }

  remove(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        const serviceName = req.params.service;

        const service = this.getService(serviceName);

        if (!service) {
          return next(new Error(`The ${ serviceName } rocket not register`));
        }

        if (typeof service?.remove !== "function") {
          return next(new Error("Remove method not supported."));
        }

        const { path = "" } = req.query;
        const entity = await service.remove(path as string, req.query);

        Object.defineProperty(req, PROPERTY_UPLOADED, { value: entity });
        next();
      } catch (error) {
        next(error);
      }
    }
  }
}
