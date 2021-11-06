import { Router } from "express";

import { serviceHandler } from "./hooks";
import { RouterOptions } from "./index";

export function RocketRouter(params: RouterOptions): Router {
  const { rocket, path, hooks } = params;
  const router: Router = Router();

  router.post(path, serviceHandler(rocket, "create", hooks));

  router.get(path, serviceHandler(rocket, "list", hooks));

  router.delete(path, serviceHandler(rocket, "remove", hooks));

  return router;
}
