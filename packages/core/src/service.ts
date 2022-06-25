import { FileController } from './controllers/file.controller'
import { InputEntity, ServiceMethods } from './index'

interface Rocket {
  name: string;
  controller: FileController;
  service: Partial<ServiceMethods>;
}

export class Filesrocket {
  private entities: Map<string, Rocket> = new Map()

  /**
   * Register a new service
   * @param name Service name
   * @param service ServiceMethods
   */
  register (name: string, service: Partial<ServiceMethods<any>>) {
    const controller = new FileController(service)
    this.entities.set(name, { name, service, controller })
  }

  /**
   * Method responsible for returning a service
   * @param name Service name
   */
  service (name: string): Partial<ServiceMethods<InputEntity>> | undefined {
    const data = this.entities.get(name)

    if (!data) return

    return data.service
  }

  /**
   * Method responsible for returning controller
   * @param name Service name
   */
  controller (name: string): FileController | undefined {
    const data = this.entities.get(name)

    if (!data) return

    return data.controller
  }

  /**
   * List of all registered services
   */
  get services (): Rocket[] {
    return [...this.entities].map((entity) => entity[1])
  }
}
