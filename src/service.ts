import { ControllerMethods, ServiceMethods, Rocket, Service } from './index'
import { DirectoryController } from './controllers/directory.controller'
import { FileController } from './controllers/file.controller'

export class Filesrocket {
  private entities: Map<string, Rocket> = new Map();

  /**
   * Method responsible for registering services
   * @param service Service
   * @param hooks Hooks
   */
  register (name: string, service: Partial<ServiceMethods<any>>) {
    const Controller = (service as any).controller as
      | typeof FileController
      | typeof DirectoryController
      | undefined

    if (!Controller) {
      throw new Error('Add the @Service controller to your service')
    }

    this.entities.set(name, {
      name,
      service: service as ServiceMethods<any>,
      controller: new Controller(service)
    })
  }

  /**
   * Method responsible for returning a service
   * @param name Service name
   */
  service <T> (name: string) {
    const data = this.entities.get(name)
    if (!data) throw new Error('Service is not registered')
    return data.service as Service<T>
  }

  /**
   * Method responsible for returning a controller
   * @param name Controller name
   */
  controller (name: string): ControllerMethods {
    const data = this.entities.get(name)
    if (!data) throw new Error('Controller is not registered')
    return data.controller
  }

  get services (): Rocket[] {
    return [...this.entities].map((entity) => entity[1])
  }
}