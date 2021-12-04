import { NextFunction, Request, Response } from "express";
import { ControllerMethods, Middleware, ServiceMethods } from "../declarations";

export class FileController implements Partial<ControllerMethods> {
  constructor(private readonly service: ServiceMethods<any>) {}

  create(): Middleware {
    return (req: Request, _: Response, next: NextFunction) => {
      console.log(req.query);
      console.log(this.service);
      next();
    }
  }

  list(): Middleware {
    return (req: Request, _: Response, next: NextFunction) => {
      console.log(req.query);
      console.log(this.service);
      next();
    }
  }

  remove(): Middleware {
    return (req: Request, _: Response, next: NextFunction) => {
      console.log(req.query);
      console.log(this.service);
      next();
    }
  }
}
