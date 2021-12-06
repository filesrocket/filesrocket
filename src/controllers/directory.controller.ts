import { NextFunction, Request, Response } from "express";
import { ControllerMethods, Middleware, Service, DirectoryEntity } from "../declarations";

export class DirectoryController implements Partial<ControllerMethods> {
  constructor(private readonly service: Service<DirectoryEntity>) {}

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
