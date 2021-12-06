import { Router } from "express";

import { DirectoryController, FileController } from "./index";
import { RouterParams, TypeEntities } from "./declarations";
import { Handler, serviceHandler } from "./hooks";

export class RocketRouter {
  /**
   * Responsible method of registering and exposing all services.
   * @param data Data - RouterParams.
   */
  static forRoot(data: RouterParams): Router {
    const router = Router();

    data.services.forEach((item) => {
      const service = item.service as any;
      const Controller = service.controller as
        | typeof FileController
        | typeof DirectoryController
        | undefined;
      const type = service.entityType as TypeEntities;
      const name = item.name || service.serviceName;

      if (!Controller) {
        throw new Error("Add the @Service controller to your service.");
      }

      const controller = new Controller(service);
      const path: string = `/${data.path}/${name}/${type.toLowerCase()}`;
      const options: Omit<Handler, "method"> = { controller, hooks: item.hooks };

      router.get(path, serviceHandler({ ...options, method: "list" }));
      router.post(
        path,
        serviceHandler({
          ...options,
          method: "create",
          query: data.options
        })
      );
      router.delete(path, serviceHandler({ ...options, method: "remove" }));
    });

    return router;
  }
}
