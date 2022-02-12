import { NextFunction, Request, Response } from 'express'
import { BadRequest, NotImplemented } from 'http-errors'

import { ControllerMethods, Middleware, Service, DirectoryEntity } from '../declarations'
import { BaseController } from './base.controller'
import { ROCKET_RESULT } from '../index'

/**
 * Controller methods will need to be modified.
 */
export class DirectoryController extends BaseController implements ControllerMethods {
  constructor (protected readonly service: Service<DirectoryEntity>) {
    super(service)
  }

  create (): Middleware {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (typeof this.service.create !== 'function') {
          return next(new NotImplemented('The create method not implemented.'))
        }

        if (!req.body || !Object.keys(req.body).length) {
          return next(new BadRequest('The body of the request is empty.'))
        }

        const data = await this.service.create(req.body, req.query)

        req = Object.defineProperty(req, ROCKET_RESULT, { value: data })
        next()
      } catch (error) {
        next(error)
      }
    }
  }
}
