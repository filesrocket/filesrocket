import { NextFunction, Request, Response } from "express";
import { BadRequest } from "http-errors";
import Busboy from "busboy";

import { ControllerMethods, Middleware, Service, FileEntity, ROCKET_RESULT } from "../declarations";
import { NotImplemented } from "../errors";
import { Query } from "../index";

export class FileController implements ControllerMethods {
  constructor(private readonly service: Service<FileEntity>) {}

  create(query?: Query): Middleware {
    return (req: Request, _: Response, next: NextFunction) => {
      try {
        const busboy = new Busboy({
          headers: req.headers,
          limits: { files: 1 },
          ...query
        });

        busboy.on("file", async (fieldname, stream, name, encoding, mimetype) => {
          if (typeof this.service.create !== "function") {
            return next(new NotImplemented("The create method not implemented"));
          }

          const data = await this.service.create({
            fieldname,
            stream,
            name,
            encoding,
            mimetype
          }, req.query);

          Object.defineProperty(req, ROCKET_RESULT, { value: data });
          next();
        });

        req.on("error", (err) => next(err));

        req.pipe(busboy);
      } catch (error) {
        next(error);
      }
    }
  }

  list(): Middleware {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        if (typeof this.service.list !== "function") {
          return next(new NotImplemented("The list method not implemented."));
        }

        const data = await this.service.list(req.query);
        Object.defineProperty(req, ROCKET_RESULT, { value: data });

        next();
      } catch (error) {
        next(error);
      }
    }
  }

  remove(): Middleware {
    return async (req: Request, _: Response, next: NextFunction) => {
      try {
        if (typeof this.service.remove !== "function") {
          return next(new NotImplemented("The remove method not implemented."));
        }

        if (!req.query.id) {
          return next(new BadRequest("The id property is required."));
        }

        const data = await this.service.remove(String(req.query.id), req.query);
        Object.defineProperty(req, ROCKET_RESULT, { value: data });

        next();
      } catch (error) {
        next(error);
      }
    }
  }
}
