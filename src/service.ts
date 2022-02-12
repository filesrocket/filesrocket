import { ControllerMethods, ServiceMethods, TypeEntities } from './index'
import { ObjectHooks } from './hooks'

export interface Service<T> {
  controller: ControllerMethods;
  service: ServiceMethods<T>;
  hooks: ObjectHooks;
}

export class Filesrocket {
  private services: Map<string, Partial<ServiceMethods<any>>> = new Map();

  /**
   * Method responsible for registering services
   * @param service Service
   * @param hooks Hooks
   */
  register (service: Partial<ServiceMethods<any>>, hooks: ObjectHooks = {}) {
    const type = (service as any).typeEntity as TypeEntities
    const name = (service as any).serviceName as string
    const Controller = (service as any).controller

    if (!Controller) {
      throw new Error('Add the @Service controller to your service')
    }

    /**
     * It will be necessary to define the structure that
     * it will have when a new service is added, currently
     * we would have the controller, the service and the hooks
     */
    this.services.set(`${name}/${type.toLowerCase()}`, service)
  }
}
