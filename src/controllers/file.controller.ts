import { NextFunction, Request, Response } from "express";
import Busboy from "busboy";

import { ControllerMethods, Middleware, Service, FileEntity, ROCKET_RESULT } from "../declarations";
import { BaseController } from "./base.controller";
import { NotImplemented } from "../errors";
import { Query } from "../index";

export class FileController extends BaseController implements ControllerMethods {
  constructor(protected readonly service: Service<FileEntity>) {
    super(service);
  }

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
}
