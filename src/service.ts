import { NotImplemented, MethodNotAllowed, BadRequest } from "http-errors";
import { NextFunction, Request, Response } from "express";
import Busboy from "busboy";

import { ServiceOptions } from "declarations";
import { handlerPromise } from "./utils";
import { Middleware } from "./index";
import { BaseRocket } from "./base";

export class RocketService extends BaseRocket {
  constructor(private readonly options?: Partial<ServiceOptions>) {
    super();
  }

  /**
   * Middleware responsible method of upload file.
   */
  create(): Middleware<void> {
    return (req: Request, _: Response, next: NextFunction) => {
      const { service = "" } = req.query;
      const rocket = this.getRocket(service as string);
      if (!rocket) return next(
        new NotImplemented(`The ${ service } rocket is not registered.`)
      );

      const busboy = new Busboy({
        headers: req.headers,
        limits: { ...this.options, files: 1, fields: 1 }
      });

      busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (!filename) return next(new BadRequest("You need to add a file."));

        const result = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/g);
        if (!result) return next(new BadRequest("The extension format is invalid."));

        const { extensions = [] } = this.options || {};
        if (extensions.length) {
          const ext: string = result[0];
          const hasExist: string | undefined = extensions.find((item) => item === ext);

          if (!hasExist) return next(
            new BadRequest(`This extension is not allowed. Consider using: ${ extensions }`)
          );
        }

        if (typeof rocket.create !== "function") return next(
          new MethodNotAllowed("The create method not implemented.")
        );

        rocket
          .create({ fieldname, file, filename, encoding, mimetype }, req.query)
          .then(value => {
            req = Object.defineProperty(req, "rocketData", { value });
            next();
          })
          .catch(next);
      });

      req.pipe(busboy);
    }
  }

  /**
   * Middleware responsible for getting a list of files,
   */
  list(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const { service = "" } = req.query;
      const rocket = this.getRocket(service as string);
      if (!rocket) return next(
        new NotImplemented(`The ${ service } rocket is not registered.`)
      );

      if (typeof rocket.list !== "function") return next(
        new MethodNotAllowed("The list method not implemented.")
      );

      const [value, err] = await handlerPromise(rocket.list(req.query));
      if (!value || err) return next(err);

      req = Object.defineProperty(req, "rocketData", { value });
      next();
    }
  }

  /**
   * Middleware responsible for deleting a file.
   */
  remove(): Middleware<void> {
    return async (req: Request, _: Response, next: NextFunction) => {
      const { service = "", path = "" } = req.query;
      const rocket = this.getRocket(service as string);
      if (!rocket) return next(
        new NotImplemented(`The ${ service } rocket is not registered.`)
      );

      if (typeof rocket.remove !== "function") return next(
        new MethodNotAllowed("The remove method not implemented.")
      );

      const [value, err] = await handlerPromise(rocket.remove(path as string, req.query));
      if (!value || err) return next(err);

      req = Object.defineProperty(req, "rocketData", { value });
      next();
    }
  }
}
