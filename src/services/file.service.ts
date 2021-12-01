import { Request, Response, NextFunction } from "express";
import { BadRequest } from "../errors";
import Busboy from "busboy";

import { PROPERTY_UPLOADED, Middleware, DataFile } from "../index";
import { ControllerOptions } from "../declarations";
import { RocketBase } from "../base";

export class FileService extends RocketBase {
  constructor(private readonly params: ControllerOptions) {
    super(params.path);
  }

  create(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const serviceName = req.params.service;

      const service = this.getService(serviceName);

      if (!service) {
        return next(new Error(`The ${serviceName} rocket not register`));
      }

      const busboy = new Busboy({
        ...this.params.options,
        headers: req.headers,
        limits: { files: 1 }
      });

      busboy.on("field", (fieldname, value) => {
        Object.assign(req.body, { [fieldname]: value });
      });

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (!filename) return next(new BadRequest("You need to add a file."));

        // Get extension.
        const result = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/g);
        if (!result) return next(new BadRequest("The extension format is invalid."));

        if (typeof service?.create !== "function") {
          return next(new Error("Create method not supported."));
        }

        const data: DataFile = { fieldname, file, filename, encoding, mimetype };
        service.create(data, req.query)
          .then(value => {
            Object.defineProperty(req, PROPERTY_UPLOADED, { value });
            next();
          })
          .catch(next);
      });

      req.pipe(busboy);
    }
  }

  list(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        const serviceName = req.params.service;

        const service = this.getService(serviceName);

        if (!service) {
          return next(new Error(`The ${serviceName} rocket not register`));
        }

        if (typeof service?.list !== "function") {
          return next(new Error("List method not supported."));
        }

        const files = await service.list(req.query);

        req = Object.defineProperty(req, PROPERTY_UPLOADED, { value: files });
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
        const { path = "" } = req.query;
        if (!path) return next(new BadRequest("The <path> property is required."));

        const service = this.getService(serviceName);

        if (!service) {
          return next(new Error(`The ${serviceName} rocket not register.`));
        }

        if (typeof service?.remove !== "function") {
          return next(new Error("Remove method not supported."));
        }

        const file = await service.remove(path as string, req.query);

        req = Object.defineProperty(req, PROPERTY_UPLOADED, { value: file });
        next();
      } catch (error) {
        next(error);
      }
    }
  }
}
