import { Router } from "express";

import {
  DataFile,
  DataResult,
  RouterParams,
  ServiceMethods,
  TypeServices
} from "./index";
import { HandlerOptions, serviceHandler } from "./hooks";

interface Entity<T, K> {
  /**
   * Represents the strategy of a service.
   */
  service: Partial<ServiceMethods<T, K>>;
  router: Router;
}

export class RocketBase<T = DataFile, K = DataResult> {
  private readonly entities: Map<string, Entity<T, K>> = new Map();
  protected type: TypeServices = "Files";

  constructor(private readonly path: string) {}

  /**
   * Register a new service.
   * @param name Service name.
   * @param params Params
   */
  register(name: string, params: RouterParams<T, K>): void {
    const { service, controller, hooks = {} } = params;
    const router = Router();

    const path: string = `/${ this.path }/:service/${ this.type.toLowerCase() }`;

    const options: Omit<HandlerOptions, "method"> = { controller, hooks }

    router.get(path, serviceHandler({ ...options, method: "list" }));
    router.post(path, serviceHandler({ ...options, method: "create" }));
    router.delete(path, serviceHandler({ ...options, method: "remove" }));

    this.entities.set(name, { service, router });
  }

  /**
   * Get a service.
   * @param name Service name
   */
  getService(name: string): Partial<ServiceMethods<T, K>> | undefined {
    const entity: Entity<T, K> | undefined = this.entities.get(name);
    return entity?.service;
  }

  /**
   * Get a service router.
   * @param name Service name.
   */
  getServiceRouter(name: string): Router | undefined {
    const entity: Entity<T, K> | undefined = this.entities.get(name);
    return entity?.router;
  }

  /**
   * Gets a list of routers.
   */
  get routers(): Router[] {
    return [...this.entities].map(entity => entity[1].router);
  }

  /**
   * Gets a list of services.
   */
  get services(): Partial<ServiceMethods<T, K>>[] {
    return [...this.entities].map(entity => entity[1].service);
  }
}
