import { Router } from "express";

import { ControllerMethods, RouterParams, TypeEntities } from "./declarations";
import { serviceHandler } from "./hooks";

export class RocketRouter {
  /**
   * Responsible method of registering and exposing all services.
   * @param data Data - RouterParams.
   */
  static forRoot(data: RouterParams): Router {
    const router = Router();

    data.services.forEach(item => {
      const controller = (item.service as any).controller as ControllerMethods | undefined;
      const type = (item.service as any).type as TypeEntities;
      if (!controller) throw new Error("Add the Service controller to your service.");

      const path: string = `/${ data.path }/${ item.name }/${ type.toLowerCase() }`;
      router.get(path, serviceHandler(controller, "list", item.hooks));
      router.post(path, serviceHandler(controller, "create", item.hooks));
      router.delete(path, serviceHandler(controller, "remove", item.hooks));
    });

    return router;
  }
}
