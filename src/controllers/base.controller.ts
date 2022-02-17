import { Request, Response, NextFunction } from 'express'

import { ControllerMethods, ROCKET_RESULT, Middleware } from '../index'
import { BadRequest, NotImplemented } from '../errors'
import { ServiceMethods } from '../declarations'

type Service = Partial<ServiceMethods<any>>

export class BaseController implements Omit<ControllerMethods, 'create'> {
  constructor (protected readonly service: Service) {}

  list (): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (typeof this.service.list !== 'function') {
          return next(new NotImplemented('The list method not implemented.'))
        }

        const data = await this.service.list(req.query)

        req = Object.defineProperty(req, ROCKET_RESULT, { value: data })

        next()
      } catch (error) {
        next(error)
      }
    }
  }

  remove (): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (typeof this.service.remove !== 'function') {
          return next(new NotImplemented('The remove method not implemented.'))
        }

        if (!req.query.id) {
          return next(new BadRequest('The id property is required.'))
        }

        const data = await this.service.remove(String(req.query.id), req.query)

        req = Object.defineProperty(req, ROCKET_RESULT, { value: data })

        next()
      } catch (error) {
        next(error)
      }
    }
  }
}
