import { FileController } from './controllers/file.controller'
import { InputEntity, ServiceMethods } from './index'

interface Rocket {
  name: string;
  controller: FileController;
  service: Partial<ServiceMethods>;
}

export class Filesrocket {
  private serviceMap: Map<string, Rocket> = new Map()

  /**
   * Register a new service
   * @param name Service name
   * @param service ServiceMethods
   */
  register (name: string, service: Partial<ServiceMethods<any>>) {
    if (this.serviceMap.get(name)) {
      throw new Error(`The ${name} service already exists.`)
    }

    const controller = new FileController(service)

    this.serviceMap.set(name, { name, service, controller })
  }

  /**
   * Method responsible for returning a service
   * @param name Service name
   */
  service (name: string): Partial<ServiceMethods<InputEntity>> | undefined {
    const data = this.serviceMap.get(name)

    if (!data) return

    return data.service
  }

  /**
   * Method responsible for returning controller
   * @param name Service name
   */
  controller (name: string): FileController | undefined {
    const data = this.serviceMap.get(name)

    if (!data) return

    return data.controller
  }

  /**
   * List of all registered services
   */
  get services (): Rocket[] {
    return [...this.serviceMap].map((entity) => entity[1])
  }
}
