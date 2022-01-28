import { Router } from 'express'

import { DirectoryController, FileController } from './index'
import { RouterParams, TypeEntities } from './declarations'
import { serviceHandler } from './hooks'

export class RocketRouter {
  /**
   * Responsible method of registering and exposing all services.
   * @param data Data - RouterParams.
   */
  static forRoot (data: RouterParams): Router {
    const router = Router()

    data.services.forEach((item) => {
      const service = item.service as any
      const Controller = service.controller as
        | typeof FileController
        | typeof DirectoryController
        | undefined
      const type = service.entityType as TypeEntities
      const name = item.name || service.serviceName

      if (!Controller) {
        throw new Error('Add the @Service controller to your service.')
      }

      const controller = new Controller(service)
      const path: string = `/${data.path}/${name}/${type.toLowerCase()}`

      const { after = {}, before = {} } = item.hooks || {}

      const createHandler = serviceHandler({
        controller,
        method: 'create',
        query: item.options,
        hooks: {
          after: after.create,
          before: before.create
        }
      })

      const listHandler = serviceHandler({
        controller,
        method: 'list',
        hooks: {
          after: after.list,
          before: before.list
        }
      })

      const removeHandler = serviceHandler({
        controller,
        method: 'remove',
        hooks: {
          after: after.remove,
          before: before.remove
        }
      })

      router.post(path, createHandler)
      router.get(path, listHandler)
      router.delete(path, removeHandler)
    })

    return router
  }
}
