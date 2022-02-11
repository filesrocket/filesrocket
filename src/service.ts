import { DirectoryController, FileController, ServiceMethods, TypeEntities } from './index'
import { ObjectHooks } from './hooks'

export class Filesrocket {
  /**
   * Method responsible for registering services
   * @param service Service
   * @param hooks Hooks
   */
  register (service: Partial<ServiceMethods<any>>, hooks: ObjectHooks = {}) {
    const name = (service as any).serviceName as string
    const type = (service as any).typeEntity as TypeEntities
    const Controller = (service as any).controller as
      | typeof FileController
      | typeof DirectoryController
      | undefined

    if (!Controller) {
      throw new Error('Add the @Service controller to your service')
    }

    const controller = new Controller(service)
    const path: string = `/${name}/${type.toLowerCase()}`

    /**
     * It is necessary to add the router, the hooks,
     * and possibly change the controller.
     */
    console.log(controller)
    console.log(path)
  }
}
